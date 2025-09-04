import React, { useState, useEffect, useCallback } from 'react';
import PageTitle from '../../components/PageTitle';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MatchmakingVisualization } from '../../components/MatchmakingVisualization'; 
import {
    MatchmakingSuggestion,
    DemandItem,
    StockItem,
    DemandStatus,
    StockStatus,
    ConfirmedMatch
} from '../../types';
import {
    ArrowsRightLeftIcon,
    CheckCircleIcon,
    UserGroupIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { Type } from "@google/genai";
import { useLocale } from '../../LocaleContext';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ai } from '../../lib/gemini';

type ActiveTab = 'ai' | 'manual';

interface RankedStock extends StockItem {
    reason: string;
    score: number;
}

export const AdminMatchmakingPage: React.FC = () => {
    const { t, locale } = useLocale();
    const [activeTab, setActiveTab] = useState<ActiveTab>('ai');

    // Common data states
    const [allDemands, setAllDemands] = useState<DemandItem[]>([]);
    const [allStock, setAllStock] = useState<StockItem[]>([]);

    // AI Suggestions Tab State
    const [suggestions, setSuggestions] = useState<MatchmakingSuggestion[] | string | null>(null);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

    // Manual Workbench Tab State
    const [selectedDemand, setSelectedDemand] = useState<DemandItem | null>(null);
    const [rankedStock, setRankedStock] = useState<RankedStock[]>([]);
    const [isRankingLoading, setIsRankingLoading] = useState(false);
    const [manualMatchSuccess, setManualMatchSuccess] = useState<string | null>(null);

    const activeDemands = allDemands.filter(d => d.status === DemandStatus.RECEIVED);
    const availableStock = allStock.filter(s => s.status === StockStatus.AVAILABLE);

    const loadData = useCallback(async () => {
        try {
            const demandsCollection = collection(db, 'demands');
            const stockCollection = collection(db, 'stockItems');

            const demandsSnapshot = await getDocs(demandsCollection);
            const stockSnapshot = await getDocs(stockCollection);

            const demandsData = demandsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DemandItem));
            const stockData = stockSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockItem));

            setAllDemands(demandsData);
            setAllStock(stockData);

        } catch (e) { console.error("Error loading data from Firestore", e); }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const generateAutomaticPairingSuggestions = useCallback(async (): Promise<MatchmakingSuggestion[] | string> => {
        if (!ai) return t('customerNewDemand_error_aiUnavailable');
        if (activeDemands.length === 0 || availableStock.length === 0) return t('adminMatchmaking_noPairingSuggestions');
        
        const promptContent = `You are an AI assistant for a timber trading platform. Based on the following active Customer Demands and available Manufacturer Stock, identify the most promising pairings. Provide your response as a JSON array in ${locale}.
        Customer Demands: ${JSON.stringify(activeDemands.slice(0, 7))}
        Manufacturer Stock: ${JSON.stringify(availableStock.slice(0, 7))}
        The response MUST ONLY contain the JSON array adhering to the schema.`;

        const matchmakingSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { demandId: { type: Type.STRING }, stockId: { type: Type.STRING }, reason: { type: Type.STRING }, matchStrength: { type: Type.STRING }, similarityScore: { type: Type.NUMBER } }, required: ["demandId", "stockId", "reason"] } };

        try {
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: promptContent, config: { responseMimeType: "application/json", responseSchema: matchmakingSchema } });
            const parsed = JSON.parse(response.text.trim());
            return Array.isArray(parsed) ? parsed.map((item, i) => ({ ...item, id: `sugg-${i}-${Date.now()}` })) : t('customerNewDemand_error_aiResponseNotArray');
        } catch (error) {
            console.error(error);
            return t('adminMatchmaking_error_pairingGeneric');
        }
    }, [activeDemands, availableStock, locale, t]);
    
    const rankStockForDemandWithGemini = useCallback(async (demand: DemandItem): Promise<RankedStock[] | string> => {
        if (!ai) return t('customerNewDemand_error_aiUnavailable');
        if (availableStock.length === 0) return t('adminMatchmaking_workbench_noRankedStock');

        const prompt = `Rank the following stock items based on their relevance to the selected demand. Return a JSON array of objects with "stockId", "reason", and "score" (0.0 to 1.0).
        Selected Demand: ${JSON.stringify(demand)}
        Available Stock: ${JSON.stringify(availableStock)}
        The response MUST ONLY contain the JSON array.`;

        const rankingSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stockId: { type: Type.STRING }, reason: { type: Type.STRING }, score: { type: Type.NUMBER } }, required: ["stockId", "reason", "score"] } };

        try {
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: rankingSchema } });
            type RankedResult = { stockId: string, reason: string, score: number };
            const rankedResults: RankedResult[] = JSON.parse(response.text.trim());
            
            const stockMap = new Map(allStock.map(s => [s.id, s]));
            const finalRankedStock: RankedStock[] = rankedResults
                .map(res => {
                    const stockItem = stockMap.get(res.stockId);
                    return stockItem ? ({ ...(stockItem as StockItem), reason: res.reason, score: res.score } as RankedStock) : null;
                })
                .filter((item): item is RankedStock => item !== null)
                .sort((a, b) => b.score - a.score);
                
            return finalRankedStock;
        } catch (error) {
            console.error(error);
            return t('adminUsers_error_aiFeatureGeneric');
        }
    }, [availableStock, allStock, t]);

    const handleFetchSuggestions = useCallback(async () => {
        setIsSuggestionsLoading(true);
        setSuggestions(null);
        const result = await generateAutomaticPairingSuggestions();
        setSuggestions(result);
        setIsSuggestionsLoading(false);
    }, [generateAutomaticPairingSuggestions]);

    const handleSelectDemand = useCallback(async (demand: DemandItem) => {
        setSelectedDemand(demand);
        setIsRankingLoading(true);
        setRankedStock([]);
        const result = await rankStockForDemandWithGemini(demand);
        if (Array.isArray(result)) {
            setRankedStock(result);
        } else {
            // Handle string error if needed
            console.error("AI Ranking Error:", result);
        }
        setIsRankingLoading(false);
    }, [rankStockForDemandWithGemini]);

    const handleMatch = async (demandId: string, stockId: string, isManual: boolean) => {
        const demand = allDemands.find(d => d.id === demandId);
        const stock = allStock.find(s => s.id === stockId);
        if (!demand || !stock) return;

        const newMatchId = `CONF-${Date.now()}-${demand.id.slice(-4)}-${stock.id?.slice(-4)}`;
        const newMatch: ConfirmedMatch = {
            id: newMatchId,
            demandId: demand.id,
            demandDetails: demand,
            stockId: stock.id!,
            stockDetails: stock,
            matchDate: new Date().toISOString(),
            commissionRate: 0.05, // Example rate
            commissionAmount: parseFloat(((stock.cubicMeters || 1) * 15).toFixed(2)), // Example calculation
            billed: false,
        };

        // --- Firestore Transaction ---
        try {
            const batch = writeBatch(db);

            // 1. Create new confirmed match document
            const matchRef = doc(db, "confirmedMatches", newMatchId);
            batch.set(matchRef, newMatch);

            // 2. Update demand status
            const demandRef = doc(db, "demands", demandId);
            batch.update(demandRef, { status: DemandStatus.PROCESSING });

            // 3. Update stock status
            const stockRef = doc(db, "stockItems", stockId);
            batch.update(stockRef, { status: StockStatus.RESERVED });

            await batch.commit();
            console.log("Firestore batch commit successful!");

            

            loadData(); // Reload data to refresh UI

            if (isManual) {
                setSelectedDemand(null);
                setRankedStock([]);
                setManualMatchSuccess(t('adminMatchmaking_workbench_matchCreatedSuccess', { matchId: newMatch.id }));
                setTimeout(() => setManualMatchSuccess(null), 5000);
            }

        } catch (error) {
            console.error("Error committing match to Firestore: ", error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <>
            <PageTitle title={t('adminMatchmaking_title')} subtitle={t('adminMatchmaking_subtitle')} icon={<ArrowsRightLeftIcon className="h-8 w-8"/>}/>
            
            {manualMatchSuccess && (
                <div className="fixed top-20 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-[100] flex items-center animate-pulse">
                    <CheckCircleIcon className="h-6 w-6 mr-2"/>
                    <span>{manualMatchSuccess}</span>
                </div>
            )}
            
            <div className="mb-6 flex space-x-1 border-b border-slate-700">
                <Button variant={activeTab === 'ai' ? 'primary' : 'ghost'} onClick={() => setActiveTab('ai')} className="rounded-b-none">{t('adminMatchmaking_tab_aiSuggestions')}</Button>
                <Button variant={activeTab === 'manual' ? 'primary' : 'ghost'} onClick={() => setActiveTab('manual')} className="rounded-b-none">{t('adminMatchmaking_tab_manualWorkbench')}</Button>
            </div>

            {activeTab === 'ai' && (
                <Card title={t('adminMatchmaking_requestMatchmakingSuggestions')}>
                    <Button onClick={handleFetchSuggestions} isLoading={isSuggestionsLoading}>{t('adminMatchmaking_requestMatchmakingSuggestions')}</Button>
                    {isSuggestionsLoading && <LoadingSpinner />}
                    {suggestions && !isSuggestionsLoading && (
                        <div className="mt-4">
                            <MatchmakingVisualization suggestions={suggestions} demands={allDemands} stockItems={allStock} onConfirmMatch={(sugg) => handleMatch(sugg.demandId, sugg.stockId, false)} />
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'manual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title={t('adminMatchmaking_workbench_demandsTitle')}>
                        <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                        {activeDemands.map(demand => (
                            <div key={demand.id} onClick={() => handleSelectDemand(demand)} className={`p-3 rounded-md cursor-pointer border ${selectedDemand?.id === demand.id ? 'bg-cyan-800/70 border-cyan-500' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'}`}>
                                <p className="font-semibold text-white">{demand.productName || 'N/A'}</p>
                                <p className="text-sm text-slate-300">
                                    <UserGroupIcon className="h-4 w-4 inline-block mr-1"/> {demand.submittedByCompanyName}
                                </p>
                                <p className="text-xs text-slate-400">Ø{demand.diameterFrom}-{demand.diameterTo}cm, {demand.length}m, {demand.quantity}pcs</p>
                            </div>
                        ))}
                        </div>
                    </Card>
                    <Card title={t('adminMatchmaking_workbench_stockTitle')}>
                        {isRankingLoading && <LoadingSpinner text={t('adminMatchmaking_workbench_loadingRankedStock')} />}
                        {!isRankingLoading && !selectedDemand && <p className="text-slate-400 text-center py-8">{t('adminMatchmaking_workbench_selectDemandPrompt')}</p>}
                        {!isRankingLoading && selectedDemand && rankedStock.length === 0 && <p className="text-slate-400 text-center py-8">{t('adminMatchmaking_workbench_noRankedStock')}</p>}
                        {!isRankingLoading && rankedStock.length > 0 && (
                             <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                                {rankedStock.map(stock => (
                                    <div key={stock.id} className="p-3 bg-slate-700/50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-white">{stock.productName || 'N/A'}</p>
                                                <p className="text-sm text-slate-300">
                                                    <BuildingStorefrontIcon className="h-4 w-4 inline-block mr-1"/> {stock.uploadedByCompanyName}
                                                </p>
                                                <p className="text-xs text-slate-400">Ø{stock.diameterFrom}-{stock.diameterTo}cm, {stock.length}m, {stock.quantity}pcs</p>
                                                <p className="text-xs mt-1 italic text-yellow-300">Reason: {stock.reason} (Score: {(stock.score * 100).toFixed(0)}%)</p>
                                            </div>
                                            <Button size="sm" onClick={() => handleMatch(selectedDemand!.id, stock.id!, true)}>{t('adminMatchmaking_workbench_manualMatchButton')}</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </>
    );
};

export default AdminMatchmakingPage;