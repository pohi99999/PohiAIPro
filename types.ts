// types.ts
// TranslationKey is defined in locales.ts and should be imported from there directly.
import type { TranslationKey } from "./locales";
import type { ReactNode } from "react";

export enum UserRole {
  ADMIN = "Administrator",
  CUSTOMER = "Customer", // Updated from BUYER
  MANUFACTURER = "Manufacturer",
}

export interface MenuItem {
  label: string; // Will hold the translated label
  labelKey: TranslationKey; // Updated from 'any' to TranslationKey
  path: string;
  icon?: ReactNode;
}

export interface ProductFeatures {
  diameterType: string;
  diameterFrom: string;
  diameterTo: string;
  length: string;
  quantity: string;
  cubicMeters?: number;
  notes?: string;
  // New specialized fields for Acacia orders
  processingType?: string;
  qualityGrade?: string;
  certifications?: string[];
}

export enum DemandStatus {
  RECEIVED = "Received",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface DemandItem extends ProductFeatures {
  id: string;
  productName?: string; // Added for general product specification
  submissionDate: string;
  status: DemandStatus;
  submittedByCompanyId?: string;
  submittedByCompanyName?: string;
}

export enum StockStatus {
  AVAILABLE = "Available",
  RESERVED = "Reserved",
  SOLD = "Sold",
}

export interface StockItem extends ProductFeatures {
  id?: string; // Optional: will be generated on save
  productName?: string; // Optional: Manufacturer can specify, or it can be inferred/standardized
  uploadDate?: string;
  status?: StockStatus;
  price?: string; // e.g. "120 EUR/m³" or "15 EUR/db"
  sustainabilityInfo?: string;
  uploadedByCompanyId?: string;
  uploadedByCompanyName?: string;
}

export interface MockCompany {
  id: string;
  companyName: string;
  role: UserRole.CUSTOMER | UserRole.MANUFACTURER;
  contactPerson?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  averageRating?: number;
  feedbackCount?: number;
  isVerified?: boolean;
}

export interface AlternativeProduct {
  id: string;
  name: string;
  specs: string;
}

export interface ComparisonData {
  original: { name: string; [key: string]: any };
  alternative: { name: string; [key: string]: any };
}

export interface GeminiComparisonItemDetails {
  name: string;
  dimensions_quantity_notes?: string;
  pros?: string[];
  cons?: string[];
}

export interface GeminiComparisonResponse {
  original: GeminiComparisonItemDetails;
  alternative: GeminiComparisonItemDetails;
}

export interface MarketNewsItem {
  id: string;
  title: TranslationKey; // Updated from 'any' to TranslationKey
  content: TranslationKey; // Updated from 'any' to TranslationKey
  date: string;
}

export interface FaqItem {
  id: string;
  question: TranslationKey; // Updated from 'any' to TranslationKey
  answer: TranslationKey; // Updated from 'any' to TranslationKey
}

export interface DemandForecast {
  region: string;
  productType: string;
  forecastValue: number;
  forecastUnit: string;
  forecastDirection: "increase" | "decrease" | "stagnation";
  timePeriod: string;
  reason?: string;
}

export interface FeedbackAnalysisData {
  positive: number;
  neutral: number;
  negative: number;
  summary: string;
  keyThemes?: string[];
  improvementSuggestions?: string[];
}

export interface OptimizationTip {
  id: string;
  tip: string;
}

export interface MatchmakingSuggestion {
  id: string;
  demandId: string;
  stockId: string;
  reason: string;
  matchStrength?: string;
  similarityScore?: number;
}

export interface AiStockSuggestion {
  stockItemId: string;
  reason: string;
  matchStrength?: string;
  similarityScore?: number;
}

export interface DisputeResolutionSuggestion {
  id: string;
  suggestion: string;
}

export interface Waypoint {
  name: string;
  type: "pickup" | "dropoff";
  order: number;
}

export interface LoadingPlanItem {
  name: string;
  volumeM3: number;
  quality?: string;
  densityTonPerM3?: string;
  weightTon?: string;
  loadingSuggestion?: string;
  destinationName?: string;
  dropOffOrder?: number;
  notesOnItem?: string;
  companyId?: string;
  demandId?: string;
  stockId?: string;
}

export interface LoadingPlanResponse {
  planDetails: string;
  items: LoadingPlanItem[] | string;
  capacityUsed: string;
  waypoints?: Waypoint[];
  optimizedRouteDescription?: string;
}

export interface LoadingPlan extends LoadingPlanResponse {
  id: string;
}

export interface CostEstimationResponse {
  totalCost: string;
  factors: string[];
}
export interface CostEstimation extends CostEstimationResponse {
  id: string;
}

export interface UserActivityDataPoint {
  date: string;
  count: number;
}

export interface UserActivitySummary {
  newRegistrations: UserActivityDataPoint[];
  activeByRole: { role: UserRole; count: number }[];
}

export interface ProductPerformanceData {
  id: string;
  productName: string;
  metricValue: number;
  unit: string;
}

export interface SystemHealthStatusItem {
  id: string;
  componentName: string;
  status: "OK" | "Warning" | "Error";
  details?: string;
}

export interface OrderStatusSummaryPoint {
  status: DemandStatus;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface StockStatusSummaryPoint {
  status: StockStatus;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface PriceTrendDataPoint {
  // Added definition
  periodLabel: string;
  price: number;
}

export interface KeyProductPriceTrend {
  productName: string;
  dataPoints: PriceTrendDataPoint[];
  unit: string;
}

export interface MonthlyPlatformSummaryData {
  month: string;
  newDemands: number;
  newStockItems: number;
  successfulMatches: number;
  aiInterpretation: string;
}

export interface GeneratedDataReport {
  newCustomers: number;
  newManufacturers: number;

  newDemands: number;
  newStockItems: number;
  productName: string;
  scenarioInfo?: string;
}

// ---- New Types for Billing & Commission ----
export interface ConfirmedMatch {
  id: string;
  demandId: string;
  demandDetails: DemandItem; // Snapshot of the demand item
  stockId: string;
  stockDetails: StockItem; // Snapshot of the stock item
  matchDate: string; // ISO date string
  commissionRate: number; // e.g., 0.05 for 5%
  commissionAmount: number; // Calculated commission
  billed: boolean;
  invoiceId?: string; // Optional: ID of the generated invoice
  shipmentId?: string; // Optional: ID of the shipment this match belongs to
}

export interface SuccessfulMatchEntry {
  // For aggregated views, charts
  id: string; // Can be month, product type, etc.
  label: string;
  matchCount: number;
  totalCommission: number;
}

export interface AiGeneratedInvoice {
  companyName: string;
  billingPeriod: string;
  invoiceDraftText: string;
  relatedMatchIds: string[];
}

export interface CommissionSourceAnalysis {
  topProducts: {
    product: string;
    totalCommission: number;
    percentage: number;
  }[];
  topCustomers: { name: string; totalCommission: number; percentage: number }[];
  summary: string;
}

export interface MarketPriceCommissionAdvice {
  productType: string;
  marketPriceInsights: string;
  suggestedCommissionRate: string; // e.g., "5-7%"
  justification: string;
}

// ---- Anomaly Detection ----
export enum AnomalySeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface AnomalyReportItem {
  id: string; // Unique ID for the anomaly instance
  type: string; // E.g., 'pricing_spike', 'activity_surge', 'inventory_mismatch', 'unusual_login'
  severity: AnomalySeverity;
  description: string; // Textual description of the anomaly
  recommendation: string; // Suggested action for the admin
  entityType?: "stock" | "user" | "demand" | "general"; // Optional: type of entity involved
  entityId?: string; // Optional: ID of the involved entity
  timestamp: string; // ISO date string
}

// ---- Types for Admin Dashboard Enhancements ----
export interface PlatformOverviewMetrics {
  totalActiveDemands: number;
  totalAvailableStock: number;
  totalCustomers: number;
  totalManufacturers: number;
  successfulMatchesThisMonth: number; // Example, could be more complex
  aiInterpretationKey?: TranslationKey; // For a simple, keyed interpretation
}

export interface RecentActivityItem {
  id: string;
  timestamp: string; // ISO date string
  icon?: ReactNode; // e.g., UserIcon, ShoppingCartIcon, CubeIcon
  descriptionKey: TranslationKey; // Key for the activity description
  params?: Record<string, string | number>; // Parameters for the translation key
  isInsight?: boolean;
}

// ---- Types for Manufacturer New Stock AI Listing Quality ----
export interface ListingQualityFeedback {
  score: number; // 0-100
  overallFeedback: string;
  positivePoints: string[];
  areasForImprovement: string[];
}

export interface ImageAnalysisResult {
  productNameSuggestion: string;
  woodType: string;
  estimatedQuality: string;
  suggestedNotes: string;
  photoQualityFeedback: string;
}

// ---- New Types for Messaging ----
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string; // e.g., 'ADMIN', 'comp-123'
  senderName: string;
  text: string;
  timestamp: string; // ISO date string
  isRead: boolean;
  isAIMessage?: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[]; // ['ADMIN', 'comp-123']
  participantNames: Record<string, string>; // { 'ADMIN': 'Admin', 'comp-123': 'Customer ABC' }
  lastMessageTimestamp: string;
  lastMessageText: string;
  unreadCount: number;
}

// ---- New Types for Deal Room & Negotiation ----
export enum DealStatus {
  NEGOTIATION = "Negotiation",
  AGREED = "Agreed",
  DISPUTED = "Disputed",
  CLOSED = "Closed",
}

export enum ShipmentStatus {
  PREPARING = "PREPARING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
}

export type NegotiationEventType =
  | "PROPOSAL"
  | "COUNTER_PROPOSAL"
  | "ACCEPTANCE"
  | "REJECTION"
  | "MESSAGE"
  | "AI_SUGGESTION"
  | "DEAL_CREATED";

export interface NegotiationEvent {
  id: string;
  timestamp: string; // ISO date string
  actorId: string; // User or company ID, or 'SYSTEM'
  actorName: string;
  eventType: NegotiationEventType;
  payload: {
    message?: string;
    price?: string; // e.g., "115 EUR/m³"
    quantity?: string; // e.g., "150 pcs"
    deliveryDate?: string; // e.g., "2024-09-15"
    // For AI suggestions
    suggestionText?: string;
  };
}

export interface Deal {
  id: string; // Unique ID for the deal
  matchId: string; // Original matchmaking suggestion ID
  status: DealStatus;
  participantIds: string[]; // [customerId, manufacturerId]
  participantNames: Record<string, string>;
  demandDetails: DemandItem;
  stockDetails: StockItem;
  negotiationHistory: NegotiationEvent[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Final agreed terms
  finalPrice?: string;
  finalQuantity?: string;
  finalDeliveryDate?: string;
  // Shipment tracking
  shipmentStatus?: ShipmentStatus;
  eta?: string; // ISO date string for estimated time of arrival
  customerFeedbackGiven?: boolean;
  manufacturerFeedbackGiven?: boolean;
  // Dispute details
  issueCategory?: string;
  issueDescription?: string;
  disputedBy?: "customer" | "manufacturer";
  contractText?: string;
}

export interface AiNegotiationSuggestion {
  summary?: string;
  suggestedAction?: string;
  suggestedMessageDraft?: string;
  // For structured proposal generation
  price?: string;
  quantity?: string;
  deliveryDate?: string;
  message?: string;
}

export interface GeneratedDocument {
  matchId: string;
  type: "invoice" | "contract" | "cmr" | "packing_list";
  text: string;
}

// ---- New types for enhanced dashboards ----
export interface MarketOpportunity {
  originalDemandSummary: string;
  suggestedStockSummary: string;
  suggestionReason: string;
  matchPercentage: number;
}

export interface DemandHotlistItem {
  trendingProduct: string;
  demandReason: string;
  suggestion: string;
}

export interface InventoryAnalysis {
  pricing_review: string[];
  demand_alignment: string[];
  untapped_opportunities: string[];
  listing_quality_improvement: string;
}

// ---- New Types for Logistics Command Center ----
export interface Shipment {
  id: string; // e.g., SHIP-20240725-1
  truckDetails: { id: string; name: string; capacityM3: number };
  matches: ConfirmedMatch[];
  status: ShipmentStatus;
  dispatchDate: string; // ISO
  estimatedArrivalDate: string; // ISO
  plan: LoadingPlan;
}

// ---- New types for Invoicing System ----
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export interface InvoiceLineItem {
  matchId: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string; // e.g., INV-2024-001
  companyId: string;
  companyName: string;
  relatedMatchIds: string[];
  lineItems: InvoiceLineItem[];
  issueDate: string; // ISO
  dueDate: string; // ISO
  totalAmount: number;
  status: InvoiceStatus;
  invoiceText: string;
}

// ---- New types for Feedback System ----
export interface Feedback {
  id: string;
  dealId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string; // ISO
}

// ---- New type for AI Dispute Analysis ----
export interface AiDisputeAnalysis {
  summary: string;
  suggestions: {
    title: string;
    description: string;
  }[];
}

// ---- New types for Notification System ----
export enum NotificationType {
  NEW_MESSAGE = "NEW_MESSAGE",
  DEAL_UPDATE = "DEAL_UPDATE",
  NEW_MATCH = "NEW_MATCH",
  SYSTEM_ALERT = "SYSTEM_ALERT",
}

export interface Notification {
  id: string;
  userId: string; // The ID of the user who should receive this
  type: NotificationType;
  messageKey: TranslationKey;
  messageParams?: Record<string, string | number>;
  link: string; // e.g., '/messages', '/deals/deal-123'
  timestamp: string; // ISO
  isRead: boolean;
}

// --- New Type for AI User Analysis ---
export interface AiUserAnalysis {
  behavioralSummary: string;
  loyaltyScore: {
    score: number; // 1-10
    justification: string;
  };
  riskAssessment: {
    level: "Low" | "Medium" | "High";
    reason: string;
  };
  actionableInsights: string[];
}

// --- New Type for AI "What-If" Scenario Simulator ---
export interface ScenarioAnalysis {
  scenarioTitle: string;
  impactOnRevenue: string;
  impactOnUsers: string;
  strategicRecommendations: string[];
}

// --- New Types for Sustainability Hub ---
export interface SustainabilityLeaderboardItem {
  companyId: string;
  companyName: string;
  score: number; // e.g., percentage of certified stock, or total volume
  unit: "%" | "m³";
}

export interface AiSustainabilityAnalysis {
  overallScore: number; // 0-100
  scoreJustification: string;
  trends: string[];
  opportunities: string[];
  risks: string[];
}

// --- New Types for AI Reports Page ---
export interface QuarterlyBusinessReview {
  period: string;
  keyMetrics: { label: string; value: string }[];
  financialSummary: { label: string; value: string }[];
  topPerformers: { category: string; list: string[] }[];
  aiExecutiveSummary: string;
  strategicRecommendations: string[];
}

export interface MarketTrendReport {
  period: string;
  supplyDemandBalance: {
    summary: string;
    supplyHotspots: string[];
    demandHotspots: string[];
  };
  topProducts: { name: string; trend: string }[];
  priceAnalysis: { summary: string; examples: string[] };
  regionalInsights: { region: string; insight: string }[];
  aiOutlook: string;
}

export interface UserSegment {
  segmentName: string;
  description: string;
  keyCharacteristics: string[];
  strategicRecommendations: string[];
  exampleUsers: string[];
}

export interface UserSegmentationReport {
  reportDate: string;
  segments: UserSegment[];
}

// --- New Types for AI Risk Management Center ---
export interface HighRiskDeal {
  dealId: string;
  participants: string;
  riskFactor: string; // e.g., "New user with large order", "Significant price deviation"
  riskLevel: "High" | "Medium" | "Low";
  recommendation: string;
}

export interface UserRiskProfile {
  userId: string;
  userName: string;
  riskScore: number; // 0-100
  summary: string;
  keyFactors: string[]; // e.g., "Low transaction history", "Inconsistent order patterns"
}

export interface MarketVolatilityAssessment {
  product: string;
  volatilityLevel: "Low" | "Medium" | "High";
  priceTrend: string; // "Stable", "Increasing", "Decreasing"
  supplyDemandRatio: string; // "Balanced", "High Demand", "Oversupply"
  summary: string;
}

// --- New Type for AI Performance Analysis on Profile Page ---
export interface AiPerformanceAnalysis {
  overallSummary: string;
  strengths: string[];
  areasForImprovement: string[];
}

export interface ProcurementAnalysis {
  cost_saving_opportunities: string[];
  alternative_product_suggestions: string[];
  future_outlook: string;
}

// --- New Type for Transactional Data Logging for AI ---
export enum TransactionType {
  // Deal Lifecycle
  DEAL_CREATED = "DEAL_CREATED",
  DEAL_STATUS_CHANGED = "DEAL_STATUS_CHANGED", // e.g., to AGREED, DISPUTED
  NEGOTIATION_EVENT = "NEGOTIATION_EVENT",

  // Shipment Lifecycle
  SHIPMENT_CREATED = "SHIPMENT_CREATED",
  SHIPMENT_STATUS_CHANGED = "SHIPMENT_STATUS_CHANGED", // e.g., to IN_TRANSIT, DELIVERED

  // Invoice Lifecycle
  INVOICE_CREATED = "INVOICE_CREATED",
  INVOICE_STATUS_CHANGED = "INVOICE_STATUS_CHANGED", // e.g., to PAID, OVERDUE

  // User Feedback
  FEEDBACK_SUBMITTED = "FEEDBACK_SUBMITTED",

  // Document Generation
  DOCUMENT_GENERATED = "DOCUMENT_GENERATED",
}

export interface Transaction<T = any> {
  id: string; // Unique ID for the transaction log
  timestamp: string; // ISO date string
  type: TransactionType;
  userId?: string; // User who initiated the event
  companyId?: string; // Company associated with the event
  payload: T; // The actual data of the event, e.g., a Deal object, an Invoice object
  aiProcessed?: boolean; // Flag to indicate if this transaction has been processed by an AI model
}
