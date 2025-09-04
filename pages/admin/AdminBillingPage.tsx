// pages/admin/AdminBillingPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from '../../LocaleContext';
import { ai } from '../../lib/gemini';
import { GenerateContentResponse, Type } from "@google/genai";
import { ConfirmedMatch, MockCompany, Shipment, ShipmentStatus, Invoice, InvoiceStatus, InvoiceLineItem, CommissionSourceAnalysis, MarketPriceCommissionAdvice } from '../../types';
import { SHIPMENTS_STORAGE_KEY, MOCK_COMPANIES_STORAGE_KEY, INVOICES_STORAGE_KEY, CONFIRMED_MATCHES_STORAGE_KEY } from '../../constants';
import { getTranslatedInvoiceStatus, TranslationKey } from '../../locales';

import PageTitle from '../../components/PageTitle';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import AiFeatureButton from '../../components/AiFeatureButton';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import Input from '../../components/Input';
import { CurrencyDollarIcon, PencilSquareIcon, CheckBadgeIcon, EyeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

type BillingTab = 'billable' | 'generator' | 'issued' | 'commissionAnalysis';

export const AdminBillingPage: React.FC = () => {
    const { t, locale } = useLocale();
    const [activeTab, setActiveTab] = useState<BillingTab>('billable');
    
    const [isLoading, setIsLoading] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState<Record<string, boolean>>({});
    
    // Data states
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [companies, setCompanies] = useState<MockCompany[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [matches, setMatches] = useState<ConfirmedMatch[]>([]);

    // Generator state
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);
    const [generatorError, setGeneratorError] = useState<string | null>(null);
    
    // Modal state for viewing invoice
    const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

    // Commission Analysis State
    const [commissionAnalysisResult, setCommissionAnalysisResult] = useState<CommissionSourceAnalysis | null>(null);
    const [commissionProductQuery, setCommissionProductQuery] = useState('');
    const [commissionAdvice, setCommissionAdvice] = useState<MarketPriceCommissionAdvice | null>(null);

    const loadData = () => {
        setIsLoading(true);
        try {
            setShipments(JSON.parse(localStorage.getItem(SHIPMENTS_STORAGE_KEY) || '[]'));
            setCompanies(JSON.parse(localStorage.getItem(MOCK_COMPANIES_STORAGE_KEY) || '[]'));
            setInvoices(JSON.parse(localStorage.getItem(INVOICES_STORAGE_KEY) || '[]'));
            setMatches(JSON.parse(localStorage.getItem(CONFIRMED_MATCHES_STORAGE_KEY) || '[]'));
        } catch(e) { console.error("Error loading billing data:", e); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadData(); }, []);
    
    const billableShipments = useMemo(() => shipments.filter(s => 
        s.status === ShipmentStatus.DELIVERED && s.matches.some(m => !m.billed)
    ), [shipments]);
    
    const unbilledMatchesForCompany = useMemo(() => {
        if (!selectedCompanyId) return [];
        const companyMatchIds = new Set(
            shipments
                .filter(s => s.status === ShipmentStatus.DELIVERED)
                .flatMap(s => s.matches)
                .filter(m => !m.billed && (m.demandDetails.submittedByCompanyId === selectedCompanyId || m.stockDetails.uploadedByCompanyId === selectedCompanyId))
                .map(m => m.id)
        );
        return matches.filter(m => companyMatchIds.has(m.id));
    }, [selectedCompanyId, shipments, matches]);

    const handleGenerateInvoice = async () => {
        if (!ai || !selectedCompanyId || unbilledMatchesForCompany.length === 0) return;
        setIsAiLoading({ invoice: true });
        setGeneratedInvoice(null);
        setGeneratorError(null);

        const company = companies.find(c => c.id === selectedCompanyId);
        if (!company) {
            setGeneratorError("Company not found.");
            setIsAiLoading({});
            return;
        }

        const lineItems: InvoiceLineItem[] = unbilledMatchesForCompany.map(m => ({
            matchId: m.id,
            description: `Commission for ${m.demandDetails.productName} (Match: ${m.id.slice(-6)})`,
            amount: m.commissionAmount,
        }));
        const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
        const promptLang = locale === 'hu' ? 'Hungarian' : 'English';

        const prompt = `Generate a professional invoice draft in ${promptLang}.
To: ${company.companyName}, ${company.address?.street}, ${company.address?.zipCode} ${company.address?.city}
From: Pohi AI Pro, Timber Valley 1, 1234 Woodsville, VAT: TIMBER12345
Line Items: ${JSON.stringify(lineItems.map(li => ({desc: li.description, amt: li.amount})))}
Total Amount: ${totalAmount.toFixed(2)} EUR
Payment Terms: Net 30 days
The response must be the plain text of the invoice, without any markdown formatting.`;

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const issueDate = new Date();
            const dueDate = new Date(issueDate);
            dueDate.setDate(issueDate.getDate() + 30);
            
            const newInvoice: Invoice = {
                id: `INV-${issueDate.getFullYear()}-${(invoices.length + 1).toString().padStart(4, '0')}`,
                companyId: company.id,
                companyName: company.companyName,
                relatedMatchIds: lineItems.map(li => li.matchId),
                lineItems,
                issueDate: issueDate.toISOString(),
                dueDate: dueDate.toISOString(),
                totalAmount,
                status: InvoiceStatus.DRAFT,
                invoiceText: response.text,
            };
            setGeneratedInvoice(newInvoice);
        } catch (e) {
            console.error(e);
            setGeneratorError(t('adminBilling_error_invoiceGenerationFailed' as TranslationKey));
        } finally {
            setIsAiLoading({});
        }
    };
    
    const handleConfirmAndSaveInvoice = () => {
        if (!generatedInvoice) return;

        const updatedInvoices = [...invoices, generatedInvoice];
        setInvoices(updatedInvoices);
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updatedInvoices));

        const updatedMatches = matches.map(m => 
            generatedInvoice.relatedMatchIds.includes(m.id) ? { ...m, billed: true, invoiceId: generatedInvoice.id } : m
        );
        setMatches(updatedMatches);
        localStorage.setItem(CONFIRMED_MATCHES_STORAGE_KEY, JSON.stringify(updatedMatches));

        alert(t('adminBilling_invoiceSaveSuccess' as TranslationKey, { invoiceId: generatedInvoice.id }));
        setGeneratedInvoice(null);
        setSelectedCompanyId('');
        loadData(); // To refresh billable shipments list
    };
    
    const handleInvoiceStatusChange = (invoiceId: string, newStatus: InvoiceStatus) => {
        const updatedInvoices = invoices.map(inv => 
            inv.id === invoiceId ? { ...inv, status: newStatus } : inv
        );
        setInvoices(updatedInvoices);
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updatedInvoices));
    };

    const handleAnalyzeCommissions = async () => {
        if (!ai) return;
        setIsAiLoading({ analysis: true });
        setCommissionAnalysisResult(null);

        const billedMatches = matches.filter(m => m.billed);
        if (billedMatches.length === 0) {
            setCommissionAnalysisResult({ summary: "No billed matches to analyze yet.", topProducts: [], topCustomers: [] });
            setIsAiLoading({});
            return;
        }

        const summaryForPrompt = billedMatches.map(m => ({
            product: m.stockDetails.productName,
            commission: m.commissionAmount,
            customer: m.demandDetails.submittedByCompanyName,
        }));
        
        const prompt = `Analyze the following commission data from a timber marketplace. Identify the top 3 product types and top 3 customers by total commission. Provide a brief, actionable summary for the platform admin. Respond in ${locale}.
        Data: ${JSON.stringify(summaryForPrompt.slice(0, 20))}
        The response MUST ONLY be a valid JSON object adhering to the schema.`;
        
        const schema = {
            type: Type.OBJECT, properties: {
                topProducts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { product: { type: Type.STRING }, totalCommission: { type: Type.NUMBER }, percentage: { type: Type.NUMBER } } } },
                topCustomers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, totalCommission: { type: Type.NUMBER }, percentage: { type: Type.NUMBER } } } },
                summary: { type: Type.STRING }
            }
        };

        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema }});
            setCommissionAnalysisResult(JSON.parse(response.text));
        } catch(e) { console.error(e); } finally { setIsAiLoading({}); }
    };
    
    const handleGetCommissionAdvice = async () => {
        if (!ai || !commissionProductQuery) return;
        setIsAiLoading({ advice: true });
        setCommissionAdvice(null);

        const prompt = `As a timber market expert, advise on a suitable commission rate for "${commissionProductQuery}". Consider market prices, product value, and typical logistics complexity. Provide a suggested rate (e.g., a range), justification, and market insights. Respond in ${locale}.
        The response MUST ONLY be a valid JSON object adhering to the schema.`;

        const schema = {
            type: Type.OBJECT, properties: {
                productType: { type: Type.STRING },
                marketPriceInsights: { type: Type.STRING },
                suggestedCommissionRate: { type: Type.STRING },
                justification: { type: Type.STRING }
            }
        };
        
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: schema }});
            setCommissionAdvice(JSON.parse(response.text));
        } catch(e) { console.error(e); } finally { setIsAiLoading(prev => ({...prev, advice: false})); }
    };

    const getStatusColor = (status: InvoiceStatus) => {
        switch(status) {
            case InvoiceStatus.DRAFT: return 'bg-slate-500';
            case InvoiceStatus.SENT: return 'bg-sky-500';
            case InvoiceStatus.PAID: return 'bg-green-500';
            case InvoiceStatus.OVERDUE: return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const renderBillableTab = () => (
        <Card title={t('adminBilling_billable_title' as TranslationKey)}>
            <p className="text-sm text-slate-300 mb-4">{t('adminBilling_billable_desc' as TranslationKey)}</p>
            {billableShipments.length === 0 ? <p className="text-slate-400">{t('adminBilling_noBillableShipments' as TranslationKey)}</p> : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {billableShipments.map(s => {
                        const unbilledInShipment = s.matches.filter(m => !m.billed);
                        const totalUnbilled = unbilledInShipment.reduce((sum, m) => sum + m.commissionAmount, 0);
                        const flatCompanies = unbilledInShipment.flatMap(m => [
                            {id: m.demandDetails.submittedByCompanyId, name: m.demandDetails.submittedByCompanyName},
                            {id: m.stockDetails.uploadedByCompanyId, name: m.stockDetails.uploadedByCompanyName}
                        ]).filter((c: any) => c && c.id && c.name) as {id: string, name: string}[];

                        const companiesInvolved = flatCompanies.reduce((acc: {id: string, name: string}[], current) => {
                            if (!acc.find(item => item.id === current.id)) acc.push(current);
                            return acc;
                        }, []);

                        return (
                            <div key={s.id} className="p-3 bg-slate-700/50 rounded-lg">
                                <p className="font-semibold text-cyan-300">{t('adminBilling_shipmentId' as TranslationKey)}: {s.id.slice(-8)}</p>
                                <p className="text-sm">{t('adminBilling_unbilledCommission' as TranslationKey)}: <span className="font-bold text-green-400">{totalUnbilled.toFixed(2)} EUR</span></p>
                                <div className="mt-2 text-xs">
                                    <p className="font-medium text-slate-300">{t('adminBilling_involvedCompanies' as TranslationKey)}:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                    {companiesInvolved.map(c => c.id && (
                                        <Button key={c.id} size="sm" variant="secondary" onClick={() => { setSelectedCompanyId(c.id!); setActiveTab('generator'); }}>
                                            {t('adminBilling_generateInvoiceForCompany' as TranslationKey, {companyName: c.name || 'N/A'})}
                                        </Button>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </Card>
    );

    const renderGeneratorTab = () => (
        <Card title={t('adminBilling_invoiceGenerator_title' as TranslationKey)}>
            <p className="text-sm text-slate-300 mb-4">{t('adminBilling_invoiceGenerator_desc' as TranslationKey)}</p>
            <Select 
                label={t('adminBilling_selectCompany' as TranslationKey)}
                options={companies.map(c => ({ value: c.id, label: c.companyName }))}
                value={selectedCompanyId}
                onChange={e => { setSelectedCompanyId(e.target.value); setGeneratedInvoice(null); }}
                placeholder={t('select' as TranslationKey)}
            />
            {selectedCompanyId && (
                <div className="mt-4">
                    <h4 className="font-semibold text-cyan-300 mb-2">{t('adminBilling_unbilledItemsForCompany' as TranslationKey, { companyName: companies.find(c=>c.id === selectedCompanyId)?.companyName || '' })}</h4>
                    {unbilledMatchesForCompany.length === 0 ? <p className="text-sm text-slate-400">{t('adminBilling_noUnbilledItemsForCompany' as TranslationKey)}</p> : (
                        <div className="text-xs space-y-1 mb-3">
                            {unbilledMatchesForCompany.map(m => <p key={m.id}>- Match {m.id.slice(-6)}: {m.commissionAmount.toFixed(2)} EUR</p>)}
                        </div>
                    )}
                    <AiFeatureButton 
                        text={t('adminBilling_generateInvoice_ai' as TranslationKey)}
                        onClick={handleGenerateInvoice}
                        isLoading={isAiLoading.invoice}
                        disabled={unbilledMatchesForCompany.length === 0}
                        leftIcon={<PencilSquareIcon className="h-5 w-5"/>}
                    />
                </div>
            )}
            {isAiLoading.invoice && <LoadingSpinner text={t('adminBilling_generatingInvoice' as TranslationKey)} />}
            {generatorError && <p className="text-red-400 mt-2 text-sm">{generatorError}</p>}
            {generatedInvoice && (
                <div className="mt-4 space-y-3">
                    <h4 className="font-semibold text-cyan-300">{t('adminBilling_generatedDraft' as TranslationKey)}</h4>
                    <Textarea value={generatedInvoice.invoiceText} readOnly rows={12} className="text-xs"/>
                    <Button onClick={handleConfirmAndSaveInvoice} leftIcon={<CheckBadgeIcon className="h-5 w-5"/>}>{t('adminBilling_confirmAndSaveInvoice' as TranslationKey)}</Button>
                </div>
            )}
        </Card>
    );

    const renderIssuedTab = () => (
        <Card title={t('adminBilling_issuedInvoices_title' as TranslationKey)}>
            {invoices.length === 0 ? <p className="text-slate-400">{t('adminBilling_noInvoicesIssued' as TranslationKey)}</p> : (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                            <tr>
                                <th className="p-3">{t('invoiceTable_id' as TranslationKey)}</th>
                                <th className="p-3">{t('invoiceTable_company' as TranslationKey)}</th>
                                <th className="p-3">{t('invoiceTable_issueDate' as TranslationKey)}</th>
                                <th className="p-3">{t('invoiceTable_dueDate' as TranslationKey)}</th>
                                <th className="p-3 text-right">{t('invoiceTable_amount' as TranslationKey)}</th>
                                <th className="p-3 text-center">{t('invoiceTable_status' as TranslationKey)}</th>
                                <th className="p-3">{t('invoiceTable_actions' as TranslationKey)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).map(inv => (
                                <tr key={inv.id} className="border-b border-slate-700">
                                    <td className="p-3 font-mono text-cyan-300">{inv.id}</td>
                                    <td className="p-3">{inv.companyName}</td>
                                    <td className="p-3">{new Date(inv.issueDate).toLocaleDateString(locale)}</td>
                                    <td className="p-3">{new Date(inv.dueDate).toLocaleDateString(locale)}</td>
                                    <td className="p-3 text-right font-semibold">{inv.totalAmount.toFixed(2)} EUR</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(inv.status)}`}>
                                            {getTranslatedInvoiceStatus(inv.status, t)}
                                        </span>
                                    </td>
                                    <td className="p-3 flex gap-1">
                                        <Button size="sm" variant="ghost" onClick={() => setViewingInvoice(inv)} title={t('invoiceActions_view' as TranslationKey)}><EyeIcon className="h-4 w-4"/></Button>
                                        {inv.status === InvoiceStatus.DRAFT && <Button size="sm" variant="secondary" onClick={() => handleInvoiceStatusChange(inv.id, InvoiceStatus.SENT)}>{t('invoiceActions_markSent' as TranslationKey)}</Button>}
                                        {inv.status === InvoiceStatus.SENT && <Button size="sm" variant="secondary" onClick={() => handleInvoiceStatusChange(inv.id, InvoiceStatus.PAID)}>{t('invoiceActions_markPaid' as TranslationKey)}</Button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

    const renderCommissionAnalysisTab = () => (
        <div className="space-y-6">
            <Card title={t('adminBilling_commissionAnalysis_title' as TranslationKey)}>
                <p className="text-sm text-slate-300 mb-4">{t('adminBilling_commissionAnalysis_desc' as TranslationKey)}</p>
                <AiFeatureButton 
                    text={t('adminBilling_analyzeCommissions' as TranslationKey)}
                    onClick={handleAnalyzeCommissions}
                    isLoading={isAiLoading.analysis}
                    leftIcon={<ChartBarIcon className="h-5 w-5"/>}
                />
                {isAiLoading.analysis && <LoadingSpinner text={t('adminBilling_analyzingCommissions' as TranslationKey)} />}
                {commissionAnalysisResult && (
                    <div className="mt-4 space-y-3 text-sm">
                        <h4 className="font-semibold text-cyan-300">{t('adminBilling_commissionAnalysisResult' as TranslationKey)}</h4>
                        <p className="italic">{commissionAnalysisResult.summary}</p>
                        {/* You can add charts here in the future based on the data */}
                    </div>
                )}
            </Card>
            <Card title={t('adminBilling_commissionAdvice_title' as TranslationKey)}>
                <p className="text-sm text-slate-300 mb-4">{t('adminBilling_commissionAdvice_desc' as TranslationKey)}</p>
                <Input 
                    label={t('adminBilling_productType_label' as TranslationKey)}
                    value={commissionProductQuery}
                    onChange={e => setCommissionProductQuery(e.target.value)}
                    placeholder={t('adminBilling_productType_placeholder' as TranslationKey)}
                />
                 <AiFeatureButton 
                    text={t('adminBilling_getCommissionAdvice' as TranslationKey)}
                    onClick={handleGetCommissionAdvice}
                    isLoading={isAiLoading.advice}
                    disabled={!commissionProductQuery.trim()}
                />
                {isAiLoading.advice && <LoadingSpinner text={t('adminBilling_gettingAdvice' as TranslationKey)} />}
                {commissionAdvice && (
                    <div className="mt-4 space-y-2 text-sm p-3 bg-slate-700/50 rounded-lg">
                         <h4 className="font-semibold text-cyan-300">{t('adminBilling_commissionAdviceResult' as TranslationKey)}</h4>
                         <p><strong>{t('adminBilling_productType_label' as TranslationKey)}:</strong> {commissionAdvice.productType}</p>
                         <p><strong>{commissionAdvice.suggestedCommissionRate}</strong> - {commissionAdvice.justification}</p>
                         <p className="text-xs text-slate-300 italic mt-1">{commissionAdvice.marketPriceInsights}</p>
                    </div>
                )}
            </Card>
        </div>
    );

    return (
        <>
            <PageTitle title={t('adminBilling_title' as TranslationKey)} subtitle={t('adminBilling_subtitle' as TranslationKey)} icon={<CurrencyDollarIcon className="h-8 w-8" />} />
            
            <div className="mb-6 flex space-x-2 border-b border-slate-700">
                <Button variant={activeTab === 'billable' ? 'primary' : 'ghost'} onClick={() => setActiveTab('billable')} className="rounded-b-none">{t('adminBilling_tab_billableShipments' as TranslationKey)}</Button>
                <Button variant={activeTab === 'generator' ? 'primary' : 'ghost'} onClick={() => setActiveTab('generator')} className="rounded-b-none">{t('adminBilling_tab_invoiceGenerator' as TranslationKey)}</Button>
                <Button variant={activeTab === 'issued' ? 'primary' : 'ghost'} onClick={() => setActiveTab('issued')} className="rounded-b-none">{t('adminBilling_tab_issuedInvoices' as TranslationKey)}</Button>
                <Button variant={activeTab === 'commissionAnalysis' ? 'primary' : 'ghost'} onClick={() => setActiveTab('commissionAnalysis')} className="rounded-b-none">{t('adminBilling_tab_commissionAnalysis' as TranslationKey)}</Button>
            </div>

            {isLoading ? <LoadingSpinner /> : (
                <div className="animate-fade-in">
                    {activeTab === 'billable' && renderBillableTab()}
                    {activeTab === 'generator' && renderGeneratorTab()}
                    {activeTab === 'issued' && renderIssuedTab()}
                    {activeTab === 'commissionAnalysis' && renderCommissionAnalysisTab()}
                </div>
            )}
            
            {viewingInvoice && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setViewingInvoice(null)}>
                    <Card title={t('invoice_modal_title' as TranslationKey, { invoiceId: viewingInvoice.id })} className="w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-4">
                            <pre className="text-xs whitespace-pre-wrap">{viewingInvoice.invoiceText}</pre>
                        </div>
                        <div className="p-4 border-t border-slate-700 text-right">
                            <Button onClick={() => setViewingInvoice(null)}>{t('invoice_modal_close' as TranslationKey)}</Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};