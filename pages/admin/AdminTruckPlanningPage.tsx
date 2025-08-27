// pages/admin/AdminTruckPlanningPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from '../../LocaleContext';
import { ai } from '../../lib/gemini';
import { GenerateContentResponse, Type } from "@google/genai";
import { ConfirmedMatch, MockCompany, Shipment, LoadingPlan, ShipmentStatus, CostEstimation, OptimizationTip, LoadingPlanItem } from '../../types';
import { CONFIRMED_MATCHES_STORAGE_KEY, MOCK_COMPANIES_STORAGE_KEY, SHIPMENTS_STORAGE_KEY } from '../../constants';
import PageTitle from '../../components/PageTitle';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import AiFeatureButton from '../../components/AiFeatureButton';
import VisualTruckLoad from '../../components/VisualTruckLoad';
import SimulatedRouteMap from '../../components/SimulatedRouteMap';
import { ComputerDesktopIcon, TruckIcon, InboxStackIcon, Cog6ToothIcon, CheckCircleIcon, ArrowUturnLeftIcon, BanknotesIcon, LightBulbIcon, MapIcon } from '@heroicons/react/24/outline';
import Select from '../../components/Select';
import type { TranslationKey } from '../../locales';

// Virtual Fleet for the prototype
const VIRTUAL_TRUCKS = [
    { id: 'truck-01', name: 'Standard Flatbed (25m³)', capacityM3: 25 },
    { id: 'truck-02', name: 'Large Flatbed (30m³)', capacityM3: 30 },
    { id: 'truck-03', name: 'Small Truck (12m³)', capacityM3: 12 },
];

export const AdminTruckPlanningPage: React.FC = () => {
    const { t, locale } = useLocale();
    const [unassignedMatches, setUnassignedMatches] = useState<ConfirmedMatch[]>([]);
    const [companies, setCompanies] = useState<MockCompany[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState<Record<string, boolean>>({});
    
    // Command Center State
    const [selectedTruck, setSelectedTruck] = useState(VIRTUAL_TRUCKS[0]);
    const [stagedMatchIds, setStagedMatchIds] = useState<Set<string>>(new Set());
    const [generatedPlan, setGeneratedPlan] = useState<LoadingPlan | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);
    const [costEstimation, setCostEstimation] = useState<CostEstimation | null>(null);
    const [freightTips, setFreightTips] = useState<OptimizationTip[] | null>(null);
    const [aiRouteSummary, setAiRouteSummary] = useState<string | null>(null);
    const [isAwaitingPlanGeneration, setIsAwaitingPlanGeneration] = useState(false);


    const loadData = useCallback(() => {
        setIsLoading(true);
        try {
            const matchesRaw = localStorage.getItem(CONFIRMED_MATCHES_STORAGE_KEY);
            const companiesRaw = localStorage.getItem(MOCK_COMPANIES_STORAGE_KEY);
            
            const allMatches: ConfirmedMatch[] = matchesRaw ? JSON.parse(matchesRaw) : [];
            setUnassignedMatches(allMatches.filter(m => !m.shipmentId).sort((a,b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()));
            setCompanies(companiesRaw ? JSON.parse(companiesRaw) : []);
        } catch (e) {
            console.error("Error loading data for command center:", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const stagedMatches = useMemo(() => 
        unassignedMatches.filter(m => stagedMatchIds.has(m.id)),
    [unassignedMatches, stagedMatchIds]);

    const totalStagedVolume = useMemo(() => 
        stagedMatches.reduce((sum, m) => sum + (m.stockDetails.cubicMeters || 0), 0),
    [stagedMatches]);

    const itemsForVisualizer = useMemo(() => {
        if (generatedPlan) {
            // Ensure items is an array before passing. If it's a string from an error, pass an empty array.
            return Array.isArray(generatedPlan.items) ? generatedPlan.items : [];
        }
        // If no plan, show the staged matches
        return stagedMatches.map(m => ({
            name: m.id,
            volumeM3: m.stockDetails.cubicMeters || 0,
            destinationName: m.demandDetails.submittedByCompanyName,
            dropOffOrder: 0 // No drop-off order until plan is generated
        }));
    }, [generatedPlan, stagedMatches]);


    const handleStageMatch = (matchId: string) => {
        const match = unassignedMatches.find(m => m.id === matchId);
        if (match && (totalStagedVolume + (match.stockDetails.cubicMeters || 0)) <= selectedTruck.capacityM3) {
            setStagedMatchIds(prev => new Set(prev).add(matchId));
        } else {
            alert(t('commandCenter_error_truckFull'));
        }
    };
    
    const handleUnstageMatch = (matchId: string) => {
        setStagedMatchIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(matchId);
            return newSet;
        });
    };
    
    const handleClearStaging = () => {
        setStagedMatchIds(new Set());
        setGeneratedPlan(null);
        setAiError(null);
        setCostEstimation(null);
        setAiRouteSummary(null);
    };

    const handleAutofillTruck = async () => {
        if (!ai) return;
        setIsAiLoading({ autofill: true });
        setAiError(null);

        const availableMatchesForPrompt = unassignedMatches
            .filter(m => !stagedMatchIds.has(m.id))
            .map(m => {
                const origin = companies.find(c => c.id === m.stockDetails.uploadedByCompanyId);
                const destination = companies.find(c => c.id === m.demandDetails.submittedByCompanyId);
                return {
                    id: m.id,
                    volume: m.stockDetails.cubicMeters,
                    originCity: origin?.address?.city,
                    destinationCity: destination?.address?.city,
                };
            });
        
        const currentStagedVolume = totalStagedVolume;
        const remainingCapacity = selectedTruck.capacityM3 - currentStagedVolume;

        const prompt = `You are a logistics optimization AI for a timber marketplace. A truck needs to be filled.
Truck: ${selectedTruck.name}, Remaining Capacity: ${remainingCapacity.toFixed(2)}m³
Current Staged Volume: ${currentStagedVolume.toFixed(2)}m³
Available Shipments to add: ${JSON.stringify(availableMatchesForPrompt)}

Task: Select the best combination of available shipments to add to the truck.
Prioritize maximizing truck capacity utilization.
Also, try to group shipments with nearby origins or destinations if possible.
Return a JSON object with a single key "shipmentIds", which is an array of the IDs of the shipments to add.
If no shipments can fit or are suitable, return an empty array.
The response MUST ONLY contain the JSON object.`;

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.OBJECT, properties: { shipmentIds: { type: Type.ARRAY, items: { type: Type.STRING }}}}
                }
            });
            const result: { shipmentIds: string[] } = JSON.parse(response.text);
            
            let newVolume = currentStagedVolume;
            const newIdsToAdd = new Set<string>();
            for (const id of result.shipmentIds) {
                const match = unassignedMatches.find(m => m.id === id);
                if (match && (newVolume + (match.stockDetails.cubicMeters || 0)) <= selectedTruck.capacityM3) {
                    newVolume += match.stockDetails.cubicMeters || 0;
                    newIdsToAdd.add(id);
                }
            }
            setStagedMatchIds(prev => new Set([...prev, ...newIdsToAdd]));

        } catch (e) {
            console.error("AI Autofill error:", e);
            setAiError(t('commandCenter_error_aiGeneric'));
        } finally {
            setIsAiLoading({});
        }
    };
    
    const handleGeneratePlan = useCallback(async () => {
        if (!ai || stagedMatches.length === 0) return;
        setIsAiLoading({ plan: true });
        setAiError(null);
        setGeneratedPlan(null);
        setCostEstimation(null);

        const waypointsData = stagedMatches.flatMap(m => {
            const manufacturer = companies.find(c => c.id === m.stockDetails.uploadedByCompanyId);
            const customer = companies.find(c => c.id === m.demandDetails.submittedByCompanyId);
            return [
                { type: 'pickup', company: manufacturer, matchId: m.id, items: [{ name: m.stockDetails.productName, stockId: m.stockDetails.id, volumeM3: m.stockDetails.cubicMeters }] },
                { type: 'dropoff', company: customer, matchId: m.id, items: [{ name: m.demandDetails.productName, demandId: m.demandDetails.id, volumeM3: m.demandDetails.cubicMeters }] }
            ];
        }).filter(wp => wp.company && wp.company.address?.latitude && wp.company.address?.longitude);


        const prompt = `Generate an optimal loading and transport plan.
        Truck: ${selectedTruck.name} (${selectedTruck.capacityM3}m³)
        Total Load Volume: ${totalStagedVolume.toFixed(2)}m³
        Waypoints: ${JSON.stringify(waypointsData.map(wp => ({ type: wp.type, companyName: wp.company?.companyName, address: wp.company?.address, items: wp.items })))}

        Task: Create a plan in ${locale} that includes:
        1. A brief overall plan summary ('planDetails').
        2. A list of all items to be loaded ('items'), with loading suggestions based on LIFO for a multi-drop route. Assign a 'destinationName' and a 'dropOffOrder' (1 for first drop, etc.) to each item.
        3. A 'capacityUsed' percentage string.
        4. An ordered list of waypoints ('waypoints') for pickups and drop-offs. Each waypoint object must have 'name', 'type', and 'order'.
        5. A short text description of the optimized route ('optimizedRouteDescription').

        The response MUST be a valid JSON object adhering to the schema.
        The response must ONLY contain the JSON object.`;

        const planSchema = {
            type: Type.OBJECT,
            properties: {
                planDetails: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            volumeM3: { type: Type.NUMBER },
                            destinationName: { type: Type.STRING },
                            dropOffOrder: { type: Type.NUMBER },
                            loadingSuggestion: { type: Type.STRING },
                        }
                    }
                },
                capacityUsed: { type: Type.STRING },
                waypoints: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['pickup', 'dropoff'] },
                            order: { type: Type.NUMBER },
                        }
                    }
                },
                optimizedRouteDescription: { type: Type.STRING },
            }
        };
        
        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: planSchema }
            });
            
            const parsedPlan = JSON.parse(response.text.trim());
            const newPlan: LoadingPlan = { id: `PLAN-${Date.now()}`, ...parsedPlan };
            setGeneratedPlan(newPlan);
        } catch(e) {
            console.error("AI Plan Generation error:", e);
            setAiError(t('commandCenter_error_aiGeneric'));
        } finally {
            setIsAiLoading({});
        }
    }, [ai, stagedMatches, selectedTruck, totalStagedVolume, locale, companies, t]);

    useEffect(() => {
        if (isAwaitingPlanGeneration && stagedMatches.length > 0) {
            handleGeneratePlan();
            setIsAwaitingPlanGeneration(false);
        }
    }, [isAwaitingPlanGeneration, stagedMatches, handleGeneratePlan]);

    const handleGenerateOptimalRoute = async () => {
        if (!ai) return;
        setIsAiLoading({ optimalRoute: true });
        handleClearStaging();

        const matchesForPrompt = unassignedMatches.map(m => {
            const origin = companies.find(c => c.id === m.stockDetails.uploadedByCompanyId);
            const destination = companies.find(c => c.id === m.demandDetails.submittedByCompanyId);
            return {
                matchId: m.id,
                volumeM3: m.stockDetails.cubicMeters || 0,
                originCity: origin?.address?.city,
                destinationCity: destination?.address?.city,
            };
        });

        const prompt = `You are a master logistics planner for a timber marketplace. Your task is to create the most efficient multi-stop delivery route.
        
        Truck Selected: ${selectedTruck.name} (Capacity: ${selectedTruck.capacityM3}m³)
        
        Available Shipments (unassigned matches):
        ${JSON.stringify(matchesForPrompt)}
        
        Task:
        1. Select the best combination of shipments to maximize the truck's capacity utilization.
        2. Prioritize shipments with geographically close pickup points and drop-off points to create an efficient route.
        3. Return a JSON object with the IDs of the selected matches ('matchIdsToStage') and a brief summary of why this route is optimal ('routeSummary').
        
        The response MUST be a valid JSON object in ${locale} and must ONLY contain this object.`;
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                matchIdsToStage: { type: Type.ARRAY, items: { type: Type.STRING } },
                routeSummary: { type: Type.STRING }
            }
        };

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: schema }
            });
            const result: { matchIdsToStage: string[], routeSummary: string } = JSON.parse(response.text.trim());
            setAiRouteSummary(result.routeSummary);
            setStagedMatchIds(new Set(result.matchIdsToStage));
            setIsAwaitingPlanGeneration(true); // Trigger plan generation after state update
        } catch(e) {
            console.error("AI Optimal Route Generation Error:", e);
            setAiError(t('commandCenter_error_aiGeneric'));
        } finally {
            setIsAiLoading({});
        }
    };


    const handleConfirmAndDispatch = () => {
        if (!generatedPlan) return;
        
        const shipmentId = `SHIP-${Date.now()}`;
        const newShipment: Shipment = {
            id: shipmentId,
            truckDetails: { id: selectedTruck.id, name: selectedTruck.name, capacityM3: selectedTruck.capacityM3 },
            matches: stagedMatches,
            status: ShipmentStatus.PREPARING,
            dispatchDate: new Date().toISOString(),
            estimatedArrivalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Dummy ETA
            plan: generatedPlan,
        };

        const allShipments: Shipment[] = JSON.parse(localStorage.getItem(SHIPMENTS_STORAGE_KEY) || '[]');
        localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify([newShipment, ...allShipments]));

        const allMatches: ConfirmedMatch[] = JSON.parse(localStorage.getItem(CONFIRMED_MATCHES_STORAGE_KEY) || '[]');
        const updatedMatches = allMatches.map(m => stagedMatchIds.has(m.id) ? { ...m, shipmentId } : m);
        localStorage.setItem(CONFIRMED_MATCHES_STORAGE_KEY, JSON.stringify(updatedMatches));
        
        handleClearStaging();
        loadData();
        alert(t('alert_dispatch_success', { shipmentId }));
    };

    const handleEstimateCost = async () => {
        if (!ai || !generatedPlan) return;
        setIsAiLoading({ cost: true });
        setAiError(null);
        setCostEstimation(null);
    
        const prompt = `You are a logistics cost estimator for a timber marketplace. Based on the following transport plan, provide a cost estimation.
        - Truck: ${selectedTruck.name} (${selectedTruck.capacityM3}m³)
        - Total Load: ${totalStagedVolume.toFixed(2)}m³ (${generatedPlan.capacityUsed})
        - Route: ${generatedPlan.optimizedRouteDescription}
        - Stops: ${generatedPlan.waypoints?.length || 0}
        
        Task: Provide a JSON object with a 'totalCost' string (e.g., "450-550 EUR") and an array of 'factors' that influence this cost. Respond in ${locale}.
        The response MUST ONLY contain the JSON object.`;
        
        const costSchema = {
            type: Type.OBJECT,
            properties: {
                totalCost: { type: Type.STRING },
                factors: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        };
    
        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: costSchema }
            });
            const parsedResult = JSON.parse(response.text.trim());
            setCostEstimation({ id: `cost-${Date.now()}`, ...parsedResult });
        } catch(e) {
            console.error("AI Cost Estimation error:", e);
            setAiError(t('commandCenter_error_aiGeneric'));
        } finally {
            setIsAiLoading(prev => ({...prev, cost: false}));
        }
    };

    const handleGetFreightTips = async () => {
        if (!ai) return;
        setIsAiLoading({ tips: true });
        setAiError(null);
        setFreightTips(null);
    
        const prompt = `You are a logistics expert for the timber industry. Provide 3-4 concise, actionable freight optimization tips for a platform administrator. Respond in ${locale} with a JSON array of objects, each having an 'id' and a 'tip'.
        The response MUST ONLY contain the JSON array.`;
    
        const tipsSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    tip: { type: Type.STRING }
                }
            }
        };
        
        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: tipsSchema }
            });
            const parsedResult = JSON.parse(response.text.trim());
            setFreightTips(parsedResult);
        } catch(e) {
            console.error("AI Freight Tips error:", e);
            setAiError(t('commandCenter_error_aiGeneric'));
        } finally {
            setIsAiLoading(prev => ({...prev, tips: false}));
        }
    };

    return (
        <>
            <PageTitle title={t('commandCenter_title')} subtitle={t('commandCenter_subtitle')} icon={<ComputerDesktopIcon className="h-8 w-8"/>} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card title={t('commandCenter_unassignedShipments')} bodyClassName="p-2">
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-2 p-2">
                            {isLoading ? <LoadingSpinner /> : unassignedMatches.filter(m => !stagedMatchIds.has(m.id)).map(match => (
                                <div key={match.id} className="p-2 bg-slate-700/50 rounded flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-bold">{match.demandDetails.productName}</p>
<<<<<<< HEAD
                                        <p>{match.stockDetails.uploadedByCompanyName} {'->'} {match.demandDetails.submittedByCompanyName}</p>
=======
                                        <div key={match.id} className="p-2 bg-slate-700/50 rounded flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-bold">{match.demandDetails.productName}</p>
                                        <p>{match.stockDetails.uploadedByCompanyName} &rarr; {match.demandDetails.submittedByCompanyName}</p>
                                        <p className="text-cyan-400">{match.stockDetails.cubicMeters?.toFixed(2)} m³</p>
                                    </div>
                                    <Button size="sm" onClick={() => handleStageMatch(match.id)}>{t('commandCenter_stageButton')}</Button>
                                </div>
>>>>>>> 46e110c15044f7d5a098d7381e24e7b226747da9
                                        <p className="text-cyan-400">{match.stockDetails.cubicMeters?.toFixed(2)} m³</p>
                                    </div>
                                    <Button size="sm" onClick={() => handleStageMatch(match.id)}>{t('commandCenter_stageButton')}</Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title={t('commandCenter_truckStaging')}>
                        <div className="flex justify-between items-center mb-3">
                            <Select 
                                options={VIRTUAL_TRUCKS.map(t => ({ value: t.id, label: t.name }))}
                                value={selectedTruck.id}
                                onChange={e => setSelectedTruck(VIRTUAL_TRUCKS.find(t => t.id === e.target.value) || VIRTUAL_TRUCKS[0])}
                                label={t('commandCenter_selectTruck')}
                                className="mb-0 flex-grow"
                            />
                            <div className="text-right ml-4">
                                <p className="text-xs text-slate-400">{t('commandCenter_capacity')}</p>
                                <p className="font-bold text-lg">{selectedTruck.capacityM3} m³</p>
                            </div>
                        </div>
                        
                        <VisualTruckLoad 
                            items={itemsForVisualizer} 
                            truckCapacityM3={selectedTruck.capacityM3}
                            planDetails={generatedPlan?.planDetails}
                        />
                        
                        <div className="mt-3 max-h-[200px] overflow-y-auto custom-scrollbar space-y-1 pr-2">
                            {stagedMatches.length === 0 ? <p className="text-sm text-slate-400 text-center">{t('commandCenter_stagingEmpty')}</p> : stagedMatches.map(match => (
                                <div key={match.id} className="text-xs p-1.5 bg-slate-700 rounded flex justify-between items-center">
                                    <p>{match.id.slice(-6)}: {match.stockDetails.cubicMeters?.toFixed(2)}m³</p>
                                    <Button size="sm" variant="danger" onClick={() => handleUnstageMatch(match.id)} className="!py-0.5 !px-1.5">
                                        <ArrowUturnLeftIcon className="h-3 w-3 mr-1"/> {t('commandCenter_unstageButton')}
                                    </Button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2">
                             <AiFeatureButton text={t('commandCenter_autofill')} onClick={handleAutofillTruck} isLoading={isAiLoading.autofill} size="sm" leftIcon={<Cog6ToothIcon className="h-4 w-4"/>}/>
                             <Button onClick={handleClearStaging} variant="secondary" size="sm">{t('commandCenter_clearStaging')}</Button>
                        </div>
                        <AiFeatureButton 
                            text={t('commandCenter_generateOptimalRoute' as TranslationKey)} 
                            onClick={handleGenerateOptimalRoute} 
                            isLoading={isAiLoading.optimalRoute} 
                            size="md" 
                            leftIcon={<MapIcon className="h-5 w-5"/>}
                            className="w-full mt-2 !bg-cyan-700/50 !border-cyan-500 hover:!bg-cyan-600/50"
                        />
                         {isAiLoading.optimalRoute && <LoadingSpinner text={t('commandCenter_generatingOptimalRoute' as TranslationKey)} />}
                    </Card>
                </div>
                
                <div className="space-y-6">
                    <Card title={t('commandCenter_generatedPlan')}>
                        {aiRouteSummary && !generatedPlan && <div className="p-3 bg-slate-700/50 rounded-md mb-4 text-sm italic flex items-start gap-2"><LightBulbIcon className="h-4 w-4 text-yellow-300 shrink-0 mt-0.5"/> <span><strong>{t('commandCenter_aiRouteSummary' as TranslationKey)}:</strong> {aiRouteSummary}</span></div>}
                        <AiFeatureButton 
                            text={t('commandCenter_generatePlan')}
                            onClick={handleGeneratePlan}
                            isLoading={isAiLoading.plan}
                            disabled={stagedMatches.length === 0}
                            leftIcon={<InboxStackIcon className="h-5 w-5"/>}
                        />
                        
                        {isAiLoading.plan && <LoadingSpinner text={t('commandCenter_generatingPlan')} />}
                        
                        {!generatedPlan && !isAiLoading.plan && (
                            <div className="text-center py-8 text-slate-500">{t('commandCenter_planWillAppearHere')}</div>
                        )}

                        {generatedPlan && !isAiLoading.plan && (
                            <div className="mt-4 space-y-4">
                                <SimulatedRouteMap waypoints={generatedPlan.waypoints || []} companies={companies} optimizedRouteDescription={generatedPlan.optimizedRouteDescription}/>
                                <Button onClick={handleConfirmAndDispatch} className="w-full" leftIcon={<CheckCircleIcon className="h-5 w-5"/>}>
                                    {t('commandCenter_confirmAndDispatch')}
                                </Button>
                            </div>
                        )}
                    </Card>

                    <Card title={t('commandCenter_planAnalysis')}>
                        <div className="space-y-4">
                            <div>
                                <AiFeatureButton
                                    text={t('commandCenter_estimateCost')}
                                    onClick={handleEstimateCost}
                                    isLoading={isAiLoading.cost}
                                    disabled={!generatedPlan}
                                    leftIcon={<BanknotesIcon className="h-5 w-5"/>}
                                />
                                {isAiLoading.cost && <LoadingSpinner text={t('commandCenter_estimatingCost')}/>}
                                {costEstimation && (
                                    <div className="mt-3 p-3 bg-slate-700/50 rounded-lg text-sm">
                                        <h4 className="font-semibold text-cyan-300 mb-2">{t('commandCenter_costEstimationResult')}</h4>
                                        <p className="text-lg font-bold text-green-400">{costEstimation.totalCost}</p>
                                        <p className="text-xs text-slate-300 mt-2 font-semibold">{t('commandCenter_costFactors')}:</p>
                                        <ul className="list-disc list-inside text-xs text-slate-400">
                                            {costEstimation.factors.map((factor, i) => <li key={i}>{factor}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div>
                                <AiFeatureButton
                                    text={t('commandCenter_getFreightTips')}
                                    onClick={handleGetFreightTips}
                                    isLoading={isAiLoading.tips}
                                    leftIcon={<LightBulbIcon className="h-5 w-5"/>}
                                />
                                {isAiLoading.tips && <LoadingSpinner text={t('commandCenter_gettingTips')}/>}
                                {freightTips && (
                                    <div className="mt-3 p-3 bg-slate-700/50 rounded-lg text-sm">
                                        <h4 className="font-semibold text-cyan-300 mb-2">{t('commandCenter_freightTipsResult')}</h4>
                                        <ul className="space-y-2">
                                            {freightTips.map(tip => <li key={tip.id} className="text-xs text-slate-300 flex items-start gap-2"><LightBulbIcon className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5"/><span>{tip.tip}</span></li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                         {aiError && <p className="text-red-400 text-sm mt-2">{aiError}</p>}
                    </Card>
                </div>
            </div>
        </>
    );
};