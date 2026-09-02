export interface HeroCmsContent {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineHighlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaAction: string;
  secondaryCtaText: string;
  secondaryCtaAction: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  trustBarText: string;
  trustBarPills: string[];
}

export interface TrustIntroCmsContent {
  tag: string;
  title: string;
  description: string;
  image: string;
  eyebrow?: string;
  headline?: string;
  points: {
    title: string;
    description: string;
  }[];
}

export interface PlatformFeatureItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  badge: string;
  detail: string;
  active: boolean;
}

export interface PlatformFeaturesCmsContent {
  tag: string;
  title: string;
  description: string;
  features: PlatformFeatureItem[];
}

export interface HowItWorksStepItem {
  stepNumber: string;
  title: string;
  description: string;
  iconName: string;
  active: boolean;
}

export interface HowItWorksCmsContent {
  tag: string;
  title: string;
  description: string;
  steps: HowItWorksStepItem[];
}

export interface SmartPricingCmsContent {
  tag: string;
  title: string;
  description: string;
  breakdownItems: {
    name: string;
    description: string;
    typicalCost: string;
    iconName: string;
  }[];
}

export interface PremiumExperienceCmsContent {
  tag: string;
  title: string;
  description: string;
  image: string;
  pillars?: {
    title: string;
    description: string;
    iconName: string;
  }[];
  features: {
    title: string;
    description: string;
    iconName: string;
  }[];
}

export interface CommercialWorkflowCmsContent {
  tag: string;
  title: string;
  description: string;
  stages: {
    step: string;
    title: string;
    desc: string;
    statusBadge: string;
  }[];
}

export interface FleetCostSimulatorCmsContent {
  tag: string;
  title: string;
  description: string;
  defaultDryLease: number;
  defaultCrewSalaries: number;
  defaultEngineReserve: number;
  defaultAirframeReserve: number;
  defaultCrewTraining: number;
  defaultWifiSub: number;
  defaultMonthlyHours: number;
  bulletPoints: string[];
}

export interface FinancingModelItem {
  id: string;
  title: string;
  iconName: string;
  description: string;
  active: boolean;
}

export interface FleetFinancingCmsContent {
  tag: string;
  title: string;
  description: string;
  models: FinancingModelItem[];
}

export interface RecurringCostItem {
  id: string;
  name: string;
  iconName: string;
  category: 'Fixed' | 'Variable' | 'Reserve';
  active: boolean;
}

export interface RecurringCostsCmsContent {
  tag: string;
  title: string;
  description: string;
  items: RecurringCostItem[];
}

export interface FerryPositioningCmsContent {
  tag: string;
  title: string;
  description: string;
  bulletPoints: string[];
}

export interface FleetCategoryItem {
  id: string;
  categoryName: string;
  ownershipType: string;
  description: string;
  featuredAircraftName: string;
  hourlyRateEst: string;
  rangeNm: number;
  passengers: number;
  active: boolean;
}

export interface FleetCategoriesCmsContent {
  tag: string;
  title: string;
  description: string;
  categories: FleetCategoryItem[];
}

export interface ServiceItemCms {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  badge: string;
  highlights: string[];
  ctaText: string;
  active: boolean;
}

export interface ServicesCmsContent {
  tag: string;
  title: string;
  description: string;
  services: ServiceItemCms[];
}

export interface ComparisonItemCms {
  id: string;
  topic: string;
  traditionalWay: string;
  flyAylaWay: string;
}

export interface StopGuessworkCmsContent {
  tag: string;
  title: string;
  description: string;
  comparisons: ComparisonItemCms[];
}

export interface TestimonialItemCms {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  companyOrFleet: string;
  initials: string;
  rating: number;
  active: boolean;
}

export interface TestimonialsCmsContent {
  tag: string;
  title: string;
  description: string;
  testimonials: TestimonialItemCms[];
}

export interface ContactCmsContent {
  tag: string;
  title: string;
  description: string;
  hqCity: string;
  hqAddress: string;
  hqPhone: string;
  opsCity: string;
  opsAddress: string;
  opsPhone: string;
  generalEmail: string;
  charterEmail: string;
  whatsappSupport: string;
  officeHours: string;
}

export interface CtaBannerCmsContent {
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: string;
  subtext: string;
}

export interface GlobalCmsStore {
  hero: HeroCmsContent;
  trustIntro: TrustIntroCmsContent;
  platform: PlatformFeaturesCmsContent;
  howItWorks: HowItWorksCmsContent;
  smartPricing: SmartPricingCmsContent;
  pricing?: SmartPricingCmsContent;
  premiumExperience: PremiumExperienceCmsContent;
  commercialWorkflow: CommercialWorkflowCmsContent;
  workflowCommercial?: CommercialWorkflowCmsContent;
  fleetCostSimulator: FleetCostSimulatorCmsContent;
  fleetFinancing: FleetFinancingCmsContent;
  recurringCosts: RecurringCostsCmsContent;
  ferryPositioning: FerryPositioningCmsContent;
  fleetCategories: FleetCategoriesCmsContent;
  services: ServicesCmsContent;
  stopGuesswork: StopGuessworkCmsContent;
  testimonials: TestimonialsCmsContent;
  contact: ContactCmsContent;
  ctaBanner: CtaBannerCmsContent;
}
