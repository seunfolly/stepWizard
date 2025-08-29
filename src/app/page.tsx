"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Wifi,
  Building,
  Globe,
  Rocket,
  Zap,
  RefreshCw,
  TrendingUp,
  LoaderCircle,
  LucideIcon,
} from "lucide-react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// STRIPE INITIALIZATION 
const stripePromise: Promise<Stripe | null> = loadStripe(
  "pk_test_51OsCJ5P1A39VkufThp1PVDexesvf2XAY8faTyK0uucC1qRl9NW9QkpBdwXQDyjCAjzL166zjMWNn5Zr25ZkaQJVi00vurq61mj"
);

// TYPE DEFINITIONS 
type SolutionTypeId = "website" | "trinity" | "both";
type IndustryId =
  | "restaurant"
  | "retail"
  | "services"
  | "hospitality"
  | "property"
  | "other";
type GoalId =
  | "fees"
  | "brand"
  | "automation"
  | "scale"
  | "customers"
  | "insights";
type PlatformTierId = "foundation" | "full" | "premium";
type TrinityOptionId = string;

interface TrinityOption {
  id: TrinityOptionId;
  type: "individual" | "package";
  name: string;
  icon: string;
  description: string;
  betaPrice: number;
  earlyPrice: number;
  standardPrice: number;
  features?: string[];
  includes?: string[];
  savings?: string;
  baseRecommended?: boolean;
  bestValue?: boolean;
  note?: string;
}
type SolutionType = {
  id: SolutionTypeId;
  name: string;
  icon: LucideIcon;
  description: string;
};
type Industry = {
  id: IndustryId;
  name: string;
  icon: string;
  examples: string;
};
type Goal = {
  id: GoalId;
  name: string;
  icon: string;
  description: string;
  savings: string;
};
type PlatformTier = {
  id: PlatformTierId;
  name: string;
  minPrice: number;
  maxPrice: number;
  features: string[];
};

// Props types for each extracted component
type SolutionChoiceProps = {
  solutionType: SolutionTypeId | null;
  setSolutionType: Dispatch<SetStateAction<SolutionTypeId | null>>;
  nextStep: () => void;
};
type TrinityPackagesProps = {
  trinitySelectionId: TrinityOptionId | null;
  setTrinitySelectionId: Dispatch<SetStateAction<TrinityOptionId | null>>;
  recommendations: { trinityRec: TrinityOptionId };
  nextStep: () => void;
  prevStep: () => void;
};
type StoreTypeProps = {
  trinitySelectionId: TrinityOptionId | null;
  hasPhysicalStore: boolean | null;
  setHasPhysicalStore: Dispatch<SetStateAction<boolean | null>>;
  nextStep: () => void;
  prevStep: () => void;
};
type IndustryStepProps = {
  selectedIndustry: IndustryId | null;
  setSelectedIndustry: Dispatch<SetStateAction<IndustryId | null>>;
  nextStep: () => void;
  prevStep: () => void;
};
type GoalsStepProps = {
  selectedGoals: GoalId[];
  setSelectedGoals: Dispatch<SetStateAction<GoalId[]>>;
  budget: number;
  setBudget: Dispatch<SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
};
type PlatformTierProps = {
  selectedTier: PlatformTierId | null;
  setSelectedTier: Dispatch<SetStateAction<PlatformTierId | null>>;
  recommendations: { tierRec: PlatformTierId };
  nextStep: () => void;
  prevStep: () => void;
};
type ROICalculatorProps = {
  calculateRunningTotal: () => number;
  selectedGoals?: GoalId[];
  trinitySelectionId: TrinityOptionId | null;
};
type FinalSummaryProps = {
  trinitySelectionId: TrinityOptionId | null;
  selectedTier: PlatformTierId | null;
  selectedIndustry: IndustryId | null;
  solutionType: SolutionTypeId | null;
  budget: number;
  hasPhysicalStore: boolean | null;
  selectedGoals: GoalId[];
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  additionalNotes: string;
  setAdditionalNotes: Dispatch<SetStateAction<string>>;
  keywords: string;
  setKeywords: Dispatch<SetStateAction<string>>;
  selectedSystems: string;
  setSelectedSystems: Dispatch<SetStateAction<string>>;
  selectedDashboards: string;
  setSelectedDashboards: Dispatch<SetStateAction<string>>;
  prevStep: () => void;
  handleCheckout: () => Promise<void>;
  isProcessing: boolean;
  calculateRunningTotal: () => number;
};

// --- CONSTANT DATA ---
const betaDaysRemaining = 10;
const ALL_TRINITY_OPTIONS: TrinityOption[] = [
  {
    id: "expense",
    type: "individual",
    name: "Expense Manager",
    icon: "💰",
    description:
      "AI-powered financial planning that ensures you never run out of cash",
    betaPrice: 200,
    earlyPrice: 500,
    standardPrice: 1500,
    features: [
      "Predictive cash flow",
      "7 allocation rules",
      "Emergency fund protection",
      "Automatic priority reshuffling",
    ],
  },
  {
    id: "mcd",
    type: "individual",
    name: "MCD System",
    icon: "📈",
    description:
      "Marketing Cost Displacement - automatically adjusts prices based on ad spend",
    betaPrice: 200,
    earlyPrice: 500,
    standardPrice: 1500,
    features: [
      "Real-time price optimization",
      "Marketing spend integration",
      "Automatic profit protection",
      "Platform cost tracking",
    ],
  },
  {
    id: "rcd",
    type: "individual",
    name: "RCD System",
    icon: "🎯",
    description:
      "Returning Customer Discounts - creates viral loyalty networks",
    betaPrice: 200,
    earlyPrice: 500,
    standardPrice: 1500,
    features: [
      "Automatic loyalty tracking",
      "Viral referral networks",
      "Personalized discount vectors",
      "Lifetime value optimization",
    ],
  },
  {
    id: "garo",
    type: "individual",
    name: "GARO System",
    icon: "🧬",
    description:
      "Genetic Algorithm Restocking Optimizer - evolves perfect inventory decisions",
    betaPrice: 200,
    earlyPrice: 500,
    standardPrice: 1500,
    features: [
      "500+ generation evolution",
      "Multi-objective fitness scoring",
      "70% stockout reduction",
      "Predictive demand modeling",
    ],
    note: "Physical stores: +£1,600 for Square setup & training",
  },
  {
    id: "aed",
    type: "individual",
    name: "AED System",
    icon: "🚀",
    description:
      "Advertising Efficiency Dashboard - unifies and optimizes all ad platforms",
    betaPrice: 200,
    earlyPrice: 500,
    standardPrice: 1500,
    features: [
      "4+ platform integration",
      "Real-time budget reallocation",
      "Machine learning optimization",
      "30% cost reduction average",
    ],
  },
  {
    id: "trinity-core",
    type: "package",
    name: "Trinity Core Package",
    icon: "⚡",
    description: "Essential business intelligence: Expense Manager + MCD + RCD",
    betaPrice: 600,
    earlyPrice: 1500,
    standardPrice: 4500,
    includes: ["💰 Expense Manager", "📈 MCD System", "🎯 RCD System"],
    savings: "Save £3,900 vs standard pricing",
    baseRecommended: true,
  },
  {
    id: "trinity-plus",
    type: "package",
    name: "Trinity Plus Package",
    icon: "🌟",
    description: "Complete suite: All 5 systems working in perfect harmony",
    betaPrice: 1000,
    earlyPrice: 2500,
    standardPrice: 7500,
    includes: [
      "💰 Expense Manager",
      "📈 MCD System",
      "🎯 RCD System",
      "🧬 GARO System",
      "🚀 AED System",
    ],
    savings: "Save £6,500 vs standard pricing",
    bestValue: true,
    note: "GARO requires +£1,600 for physical stores",
  },
];
const solutionTypes: SolutionType[] = [
  {
    id: "website",
    name: "Website & Digital Platform",
    icon: Globe,
    description: "Custom web development & dashboards",
  },
  {
    id: "trinity",
    name: "Trinity Business Systems",
    icon: Zap,
    description: "AI-powered business intelligence",
  },
  {
    id: "both",
    name: "Complete Digital Transformation",
    icon: Rocket,
    description: "Website + Trinity systems",
  },
];
const industries: Industry[] = [
  {
    id: "restaurant",
    name: "Restaurant & Food",
    icon: "🍽️",
    examples: "Restaurants, Takeaways, Cafes",
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    icon: "🛍️",
    examples: "Shops, Online Stores, Boutiques",
  },
  {
    id: "services",
    name: "Professional Services",
    icon: "💼",
    examples: "Consulting, Legal, Financial",
  },
  {
    id: "hospitality",
    name: "Hospitality & Events",
    icon: "🏨",
    examples: "Hotels, Venues, Tourism",
  },
  {
    id: "property",
    name: "Property & Real Estate",
    icon: "🏠",
    examples: "Agents, Management, Development",
  },
  {
    id: "other",
    name: "Other Industry",
    icon: "🚀",
    examples: "Tell us about your business",
  },
];
const goals: Goal[] = [
  {
    id: "fees",
    name: "Eliminate Platform Fees",
    icon: "💰",
    description: "Stop paying 20-35% commission",
    savings: "Save £1,000-5,000/month",
  },
  {
    id: "brand",
    name: "Build Brand Identity",
    icon: "🎨",
    description: "Create unique digital presence",
    savings: "73% better brand recall",
  },
  {
    id: "automation",
    name: "Automate Operations",
    icon: "⚡",
    description: "Streamline workflows",
    savings: "15-20 hours/week saved",
  },
  {
    id: "scale",
    name: "Scale Your Business",
    icon: "📈",
    description: "Systems that grow with you",
    savings: "Multi-location ready",
  },
  {
    id: "customers",
    name: "Own Customer Relationships",
    icon: "👥",
    description: "Direct customer connection",
    savings: "Build lasting loyalty",
  },
  {
    id: "insights",
    name: "Data-Driven Decisions",
    icon: "📊",
    description: "Analytics for growth",
    savings: "Real-time dashboards",
  },
];
const platformTiers: PlatformTier[] = [
  {
    id: "foundation",
    name: "Foundation",
    minPrice: 600,
    maxPrice: 1000,
    features: [
      "Professional Website",
      "Mobile Responsive",
      "Basic SEO",
      "Contact Forms",
      "Social Media Links",
    ],
  },
  {
    id: "full",
    name: "Full System",
    minPrice: 1200,
    maxPrice: 2000,
    features: [
      "Everything in Foundation",
      "Complete Ordering System",
      "Customer Database",
      "Email Automation",
      "Payment Processing",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    minPrice: 1800,
    maxPrice: 3000,
    features: [
      "Everything in Full System",
      "Advanced Analytics",
      "Multi-location Support",
      "API Access",
      "AI Predictions",
    ],
  },
];

// --- STEP COMPONENTS (Defined outside App for performance and correctness) ---

const SolutionChoice: FC<SolutionChoiceProps> = ({
  solutionType,
  setSolutionType,
  nextStep,
}) => (
  <div className="animate-fadeIn">
    <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
      Step 1: Choose Your Path
    </div>
    <h2 className="text-3xl font-bold mb-2 text-white">
      What type of solution do you need?
    </h2>
    <p className="text-gray-400 mb-8">
      Select the best fit for your business transformation.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {solutionTypes.map((solution) => (
        <div
          key={solution.id}
          className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${solutionType === solution.id ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"}`}
          onClick={() => setSolutionType(solution.id)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            {React.createElement(solution.icon, {
              className: "w-8 h-8 text-blue-400",
            })}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            {solution.name}
          </h3>
          <p className="text-gray-400 text-sm">{solution.description}</p>
        </div>
      ))}
    </div>
    <div className="flex gap-4">
      <button
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={nextStep}
        disabled={!solutionType}
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
const MemoizedSolutionChoice = React.memo(SolutionChoice);

const TrinityPackages: FC<TrinityPackagesProps> = ({
  trinitySelectionId,
  setTrinitySelectionId,
  recommendations,
  nextStep,
  prevStep,
}) => (
  <div className="animate-fadeIn">
    <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
      Trinity Systems Selection
    </div>
    <h2 className="text-3xl font-bold mb-2">
      Choose Your{" "}
      <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Trinity Solution
      </span>
    </h2>
    <p className="text-gray-400 mb-6">
      Select individual systems or complete packages. Beta pricing ends in{" "}
      {betaDaysRemaining} days!
    </p>
    <div className="inline-flex items-center gap-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg mb-8">
      <span className="text-red-500 font-semibold">🔥 BETA PRICING ACTIVE</span>
      <div className="text-center">
        <div className="text-red-500 font-bold text-lg">
          {betaDaysRemaining}
        </div>
        <div className="text-xs text-gray-400 uppercase">Days Remaining</div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {ALL_TRINITY_OPTIONS.map((option) => {
        const isRecommended = recommendations.trinityRec === option.id;
        return (
          <div
            key={option.id}
            className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 cursor-pointer transition-all duration-300 border-2 ${trinitySelectionId === option.id ? "border-blue-500 bg-blue-500/10 scale-[1.02]" : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"} ${option.type === "package" ? "lg:col-span-2" : ""}`}
            onClick={() => setTrinitySelectionId(option.id)}
          >
            {isRecommended && !option.bestValue && (
              <div className="absolute -top-3 left-5 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold uppercase">
                Recommended for You
              </div>
            )}
            {option.bestValue && (
              <div className="absolute -top-3 left-5 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-semibold uppercase">
                Best Value
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{option.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                      £{option.betaPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Beta price</div>
                    <div className="text-xs text-gray-500 line-through">
                      £{option.standardPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
                {option.features && (
                  <ul className="text-xs text-gray-300 space-y-1 mt-3">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-green-500 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {option.includes && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {option.includes.map((system, idx) => (
                        <span
                          key={idx}
                          className="bg-white/10 px-2 py-1 rounded-lg text-xs"
                        >
                          {system}
                        </span>
                      ))}
                    </div>
                    {option.savings && (
                      <div className="text-green-400 text-sm font-semibold">
                        {option.savings}
                      </div>
                    )}
                  </div>
                )}
                {option.note && (
                  <div className="mt-3 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                    ⚠️ {option.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="flex gap-4">
      <button
        className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/5 transition-all"
        onClick={prevStep}
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <button
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={nextStep}
        disabled={!trinitySelectionId}
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
const MemoizedTrinityPackages = React.memo(TrinityPackages);

const StoreType: FC<StoreTypeProps> = ({
  trinitySelectionId,
  hasPhysicalStore,
  setHasPhysicalStore,
  nextStep,
  prevStep,
}) => {
  const needsStoreInfo =
    trinitySelectionId === "trinity-plus" || trinitySelectionId === "garo";
  useEffect(() => {
    if (!needsStoreInfo) {
      nextStep();
    }
  }, [needsStoreInfo, nextStep]);
  if (!needsStoreInfo) {
    return null;
  }
  const trinitySelection = ALL_TRINITY_OPTIONS.find(
    (opt) => opt.id === trinitySelectionId
  );
  const basePrice = trinitySelection ? trinitySelection.betaPrice : 0;
  return (
    <div className="animate-fadeIn">
      <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
        Business Type
      </div>
      <h2 className="text-3xl font-bold mb-2 text-white">
        Do you have a physical storefront?
      </h2>
      <p className="text-gray-400 mb-8">
        This affects GARO system setup requirements.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${hasPhysicalStore === false ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"}`}
          onClick={() => setHasPhysicalStore(false)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            E-commerce Only
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Online business without a physical location.
          </p>
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            £{basePrice.toLocaleString()}
          </div>
          <p className="text-green-500 text-sm mt-2">Standard API setup</p>
        </div>
        <div
          className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${hasPhysicalStore === true ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"}`}
          onClick={() => setHasPhysicalStore(true)}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <Building className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            Physical Storefront
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Brick-and-mortar with inventory.
          </p>
          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            £{(basePrice + 1600).toLocaleString()}
          </div>
          <p className="text-amber-500 text-sm mt-2">
            +£1,600 Square setup & training
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/5 transition-all"
          onClick={prevStep}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={nextStep}
          disabled={hasPhysicalStore === null}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
const MemoizedStoreType = React.memo(StoreType);

const IndustryStep: FC<IndustryStepProps> = ({
  selectedIndustry,
  setSelectedIndustry,
  nextStep,
  prevStep,
}) => (
  <div className="animate-fadeIn">
    <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
      Industry
    </div>
    <h2 className="text-3xl font-bold mb-2 text-white">
      What industry are you in?
    </h2>
    <p className="text-gray-400 mb-8">This helps us tailor recommendations.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {industries.map((industry) => (
        <div
          key={industry.id}
          className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${selectedIndustry === industry.id ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"}`}
          onClick={() => setSelectedIndustry(industry.id)}
        >
          <div className="text-4xl mb-4">{industry.icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            {industry.name}
          </h3>
          <p className="text-gray-400 text-sm">{industry.examples}</p>
        </div>
      ))}
    </div>
    <div className="flex gap-4">
      <button
        className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/5 transition-all"
        onClick={prevStep}
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <button
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={nextStep}
        disabled={!selectedIndustry}
      >
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
const MemoizedIndustryStep = React.memo(IndustryStep);

const GoalsStep: FC<GoalsStepProps> = ({
  selectedGoals,
  setSelectedGoals,
  budget,
  setBudget,
  nextStep,
  prevStep,
}) => {
  const toggleGoal = (id: GoalId) => {
    setSelectedGoals((prevGoals) =>
      prevGoals.includes(id)
        ? prevGoals.filter((g) => g !== id)
        : [...prevGoals, id]
    );
  };
  return (
    <div className="animate-fadeIn">
      <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
        Goals
      </div>
      <h2 className="text-3xl font-bold mb-2 text-white">
        What are your primary goals?
      </h2>
      <p className="text-gray-400 mb-8">Select all that apply.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${selectedGoals.includes(goal.id) ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"}`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="text-4xl mb-4">{goal.icon}</div>
            <h4 className="text-lg font-semibold mb-2 text-white">
              {goal.name}
            </h4>
            <p className="text-gray-400 text-sm">{goal.description}</p>
            <p className="text-green-500 text-sm font-semibold mt-2">
              {goal.savings}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-white">
          What&apos;s your budget range?
        </h3>
        <input
          type="range"
          min="500"
          max="25000"
          step="100"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center mt-4">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            £{budget.toLocaleString()}
          </div>
          <p className="text-gray-400 text-sm mt-1">Investment Range</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/5 transition-all"
          onClick={prevStep}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={nextStep}
          disabled={selectedGoals.length === 0}
        >
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
const MemoizedGoalsStep = React.memo(GoalsStep);

const PlatformTier: FC<PlatformTierProps> = ({
  selectedTier,
  setSelectedTier,
  recommendations,
  nextStep,
  prevStep,
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 rounded-full text-sm font-semibold mb-4 border border-purple-500/30">
        Platform
      </div>
      <h2 className="text-3xl font-bold mb-2 text-white">
        Choose Your Platform Tier
      </h2>
      <p className="text-gray-400 mb-6">
        Select the web platform features you need.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {platformTiers.map((tier) => {
          const isRecommended = recommendations.tierRec === tier.id;
          return (
            <div
              key={tier.id}
              className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${selectedTier === tier.id ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-5 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold uppercase">
                  Recommended for You
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4 text-white">
                {tier.name}
              </h3>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                £{tier.minPrice} - £{tier.maxPrice}
              </p>
              <ul className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-sm text-gray-400"
                  >
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4">
        <button
          className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/5 transition-all"
          onClick={prevStep}
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={nextStep}
          disabled={!selectedTier}
        >
          Review & Proceed <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
const MemoizedPlatformTier = React.memo(PlatformTier);

const ROICalculator: FC<ROICalculatorProps> = (
  ({ calculateRunningTotal, selectedGoals=[], trinitySelectionId }) => {
    const totalCost = calculateRunningTotal();

    const estimatedMonthlySavings = useMemo(() => {
      let savings = 0;
      if (selectedGoals.includes("fees")) savings += 1500;
      if (selectedGoals.includes("automation")) savings += 800;
      if (trinitySelectionId) savings += 500;
      if (trinitySelectionId === "trinity-plus") savings += 700;
      return savings;
    }, [selectedGoals, trinitySelectionId]);

    const breakEvenMonths =
      estimatedMonthlySavings > 0
        ? (totalCost / estimatedMonthlySavings).toFixed(1)
        : "N/A";

    if (estimatedMonthlySavings === 0) return null;

    return (
      <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <TrendingUp className="text-green-400" />
          Estimated Return on Investment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-green-400">
              £{estimatedMonthlySavings.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">Estimated Monthly Savings</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-400">
              {breakEvenMonths}
            </p>
            <p className="text-gray-400 text-sm">Months to Break Even</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          *This is an illustrative estimate based on typical results.
        </p>
      </div>
    );
  })
const MemoizedROICalculator = React.memo(ROICalculator);

const FinalSummary: FC<FinalSummaryProps> = ({
  trinitySelectionId,
  selectedTier,
  selectedIndustry,
  solutionType,
  budget,
  hasPhysicalStore,
  name,
  setName,
  email,
  setEmail,
  additionalNotes,
  setAdditionalNotes,
  keywords,
  setKeywords,
  selectedSystems,
  setSelectedSystems,
  selectedDashboards,
  setSelectedDashboards,
  prevStep,
  handleCheckout,
  isProcessing,
  calculateRunningTotal,
  selectedGoals,
}) => {
  const trinitySelection = ALL_TRINITY_OPTIONS.find(
    (opt) => opt.id === trinitySelectionId
  );
  const tier = platformTiers.find((t) => t.id === selectedTier);
  const industry = industries.find((ind) => ind.id === selectedIndustry);
  const total = calculateRunningTotal();
  const isBundle = solutionType === "both" && trinitySelection && tier;
  const discountedTotal = isBundle ? Math.round(total * 0.9) : total;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Your Custom Solution Summary
        </h2>
        <p className="text-gray-400">
          Review your selections and add final details before checkout.
        </p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3 text-white border-b border-white/10 pb-2">
              Your Selections
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-400">Solution Type:</span>
                <span className="text-white font-medium capitalize bg-white/10 px-2 py-1 rounded">
                  {solutionType}
                </span>
              </li>
              {industry && (
                <li className="flex justify-between items-center">
                  <span className="text-gray-400">Industry:</span>
                  <span className="text-white font-medium">
                    {industry.name}
                  </span>
                </li>
              )}
              {trinitySelection && (
                <li className="flex justify-between items-center">
                  <span className="text-gray-400">Trinity System:</span>
                  <span className="text-white font-medium">
                    {trinitySelection.name}
                  </span>
                </li>
              )}
              {tier && (
                <li className="flex justify-between items-center">
                  <span className="text-gray-400">Platform Tier:</span>
                  <span className="text-white font-medium">{tier.name}</span>
                </li>
              )}
              <li className="flex justify-between items-center">
                <span className="text-gray-400">Budget:</span>
                <span className="text-white font-medium">
                  ~£{budget.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 text-white border-b border-white/10 pb-2">
              Cost Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              {trinitySelection && (
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">{trinitySelection.name}</span>
                  <span className="text-white">
                    £{trinitySelection.betaPrice.toLocaleString()}
                  </span>
                </div>
              )}
              {hasPhysicalStore &&
                (trinitySelectionId === "trinity-plus" ||
                  trinitySelectionId === "garo") && (
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Storefront Setup</span>
                    <span className="text-white">£1,600</span>
                  </div>
                )}
              {tier && (
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">{tier.name} Platform</span>
                  <span className="text-white">
                    £{((tier.minPrice + tier.maxPrice) / 2).toLocaleString()}
                  </span>
                </div>
              )}
              {isBundle && (
                <div className="flex justify-between py-2 border-b border-white/10 text-green-400">
                  <span>Bundle Discount (10%)</span>
                  <span>-£{Math.round(total * 0.1).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 text-lg font-bold">
                <span className="text-white">Total Investment</span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  £{discountedTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="font-semibold text-lg mb-4 text-white">
            Your Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.smith@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="font-semibold text-lg mb-4 text-white">
            Advanced Customization
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="systems"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Systems to Integrate (comma-separated)
              </label>
              <input
                type="text"
                id="systems"
                value={selectedSystems}
                onChange={(e) => setSelectedSystems(e.target.value)}
                placeholder="e.g., Shopify, Google Analytics"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dashboards"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Required Dashboards (comma-separated)
              </label>
              <input
                type="text"
                id="dashboards"
                value={selectedDashboards}
                onChange={(e) => setSelectedDashboards(e.target.value)}
                placeholder="e.g., Sales Dashboard, Customer Insights"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Primary Keywords (comma-separated)
              </label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., brand marketing, digital strategy"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
                placeholder="Any other requirements, e.g., focus on eco-friendly branding."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <MemoizedROICalculator
        calculateRunningTotal={calculateRunningTotal}
        selectedGoals={selectedGoals}
        trinitySelectionId={trinitySelectionId}
      />

      <div className="flex gap-4 mt-8">
        <button
          onClick={prevStep}
          className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white/5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <LoaderCircle className="animate-spin w-5 h-5" /> Processing...
            </>
          ) : (
            `Proceed to Checkout - £${discountedTotal.toLocaleString()}`
          )}
        </button>
      </div>
    </div>
  );
};
const MemoizedFinalSummary = React.memo(FinalSummary);

// --- MAIN APP COMPONENT ---
const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [solutionType, setSolutionType] = useState<SolutionTypeId | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId | null>(
    null
  );
  const [selectedGoals, setSelectedGoals] = useState<GoalId[]>([]);
  const [trinitySelectionId, setTrinitySelectionId] =
    useState<TrinityOptionId | null>(null);
  const [selectedTier, setSelectedTier] = useState<PlatformTierId | null>(null);
  const [budget, setBudget] = useState(5000);
  const [hasPhysicalStore, setHasPhysicalStore] = useState<boolean | null>(
    null
  );
  const [showToast, setShowToast] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [keywords, setKeywords] = useState("");
  const [selectedSystems, setSelectedSystems] = useState("");
  const [selectedDashboards, setSelectedDashboards] = useState("");

  useEffect(() => {
    const savedState = localStorage.getItem("quoteBuilderState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setCurrentStep(parsedState.currentStep || 1);
      setSolutionType(parsedState.solutionType || null);
      setSelectedIndustry(parsedState.selectedIndustry || null);
      setSelectedGoals(parsedState.selectedGoals || []);
      setTrinitySelectionId(parsedState.trinitySelectionId || null);
      setSelectedTier(parsedState.selectedTier || null);
      setBudget(parsedState.budget || 5000);
      setHasPhysicalStore(parsedState.hasPhysicalStore || null);
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      currentStep,
      solutionType,
      selectedIndustry,
      selectedGoals,
      trinitySelectionId,
      selectedTier,
      budget,
      hasPhysicalStore,
    };
    localStorage.setItem("quoteBuilderState", JSON.stringify(stateToSave));
  }, [
    currentStep,
    solutionType,
    selectedIndustry,
    selectedGoals,
    trinitySelectionId,
    selectedTier,
    budget,
    hasPhysicalStore,
  ]);

  const calculateRunningTotal = useCallback(() => {
    let total = 0;
    const trinitySelection = ALL_TRINITY_OPTIONS.find(
      (opt) => opt.id === trinitySelectionId
    );
    if (trinitySelection) {
      total += trinitySelection.betaPrice;
      if (
        hasPhysicalStore &&
        (trinitySelection.id === "trinity-plus" ||
          trinitySelection.id === "garo")
      ) {
        total += 1600;
      }
    }
    if (selectedTier) {
      const tier = platformTiers.find((t) => t.id === selectedTier);
      if (tier) {
        total += (tier.minPrice + tier.maxPrice) / 2;
      }
    }
    return Math.round(total);
  }, [trinitySelectionId, selectedTier, hasPhysicalStore]);

  const showToastMessage = useCallback((message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  }, []);

  const getSteps = useCallback(() => {
    if (solutionType === "trinity") {
      return [
        "Solution Type",
        "Trinity Package",
        "Store Type",
        "Review & Purchase",
      ];
    } else if (solutionType === "website") {
      return ["Solution Type", "Industry", "Goals", "Platform Tier", "Review"];
    } else if (solutionType === "both") {
      return [
        "Solution Type",
        "Industry",
        "Trinity Package",
        "Platform Tier",
        "Review",
      ];
    }
    return ["Solution Type"];
  }, [solutionType]);

  const nextStep = useCallback(() => {
    const steps = getSteps();
    if (currentStep < steps.length) {
      let nextStepNum = currentStep + 1;
      const needsStoreInfo =
        trinitySelectionId === "trinity-plus" || trinitySelectionId === "garo";
      if (solutionType === "trinity" && nextStepNum === 3 && !needsStoreInfo) {
        nextStepNum++;
      }
      setCurrentStep(nextStepNum);
      window.scrollTo(0, 0);
    }
  }, [currentStep, getSteps, solutionType, trinitySelectionId]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      let prevStepNum = currentStep - 1;
      const needsStoreInfo =
        trinitySelectionId === "trinity-plus" || trinitySelectionId === "garo";
      if (solutionType === "trinity" && prevStepNum === 3 && !needsStoreInfo) {
        prevStepNum--;
      }
      setCurrentStep(prevStepNum);
      window.scrollTo(0, 0);
    }
  }, [currentStep, solutionType, trinitySelectionId]);

  const resetSelections = useCallback(() => {
    setCurrentStep(1);
    setSolutionType(null);
    setSelectedIndustry(null);
    setSelectedGoals([]);
    setTrinitySelectionId(null);
    setSelectedTier(null);
    setBudget(5000);
    setHasPhysicalStore(null);
    setName("");
    setEmail("");
    setAdditionalNotes("");
    setKeywords("");
    setSelectedSystems("");
    setSelectedDashboards("");
    localStorage.removeItem("quoteBuilderState");
    showToastMessage("Selections have been reset.");
  }, [showToastMessage]);

  const recommendations = useMemo(() => {
    let trinityRec: TrinityOptionId = "trinity-core";
    let tierRec: PlatformTierId = "full";
    if (selectedGoals.includes("scale") || selectedIndustry === "retail") {
      trinityRec = "trinity-plus";
    }
    if (
      selectedGoals.includes("automation") &&
      selectedGoals.includes("insights")
    ) {
      tierRec = "premium";
    } else if (selectedGoals.length <= 1 && !selectedGoals.includes("scale")) {
      tierRec = "foundation";
    }
    return { trinityRec, tierRec };
  }, [selectedGoals, selectedIndustry]);

  const handleCheckout = useCallback(async () => {
    if (!name || !email) {
      showToastMessage("Please enter your name and email to proceed.");
      return;
    }
    setIsProcessing(true);
    const trinitySelection = ALL_TRINITY_OPTIONS.find(
      (opt) => opt.id === trinitySelectionId
    );
    const tier = platformTiers.find((t) => t.id === selectedTier);
    const parseToArray = (str: string) =>
      str
        ? str
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];
    const commonData = {
      selectedSystems: parseToArray(selectedSystems),
      selectedIndustryDashboards: parseToArray(selectedDashboards),
      selectedUniversalDashboards: [],
      additionalNotes,
    };
    const selectedServices = [];
    if (solutionType === "website" || solutionType === "both") {
      selectedServices.push({
        serviceType: "brand_identity_package",
        price: tier ? (tier.minPrice + tier.maxPrice) / 2 : 0,
        keywords: parseToArray(keywords),
        ...commonData,
      });
    }
    if (solutionType === "trinity" || solutionType === "both") {
      let trinityPrice = trinitySelection ? trinitySelection.betaPrice : 0;
      if (
        hasPhysicalStore &&
        (trinitySelectionId === "trinity-plus" || trinitySelectionId === "garo")
      ) {
        trinityPrice += 1600;
      }
      selectedServices.push({
        serviceType: "seo_optimization",
        price: trinityPrice,
        keywords: parseToArray(keywords),
        ...commonData,
      });
    }
    const total = calculateRunningTotal();
    const isBundle = solutionType === "both" && trinitySelection && tier;
    const finalPrice = isBundle ? Math.round(total * 0.9) : total;
    const payload = { name, email, totalPrice: finalPrice, selectedServices };
    console.log("SENDING PAYLOAD:", JSON.stringify(payload, null, 2));
    try {
      const response = await fetch(
        "https://prevail-services-e973123f8b1e.herokuapp.com/api/create-multiple-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create checkout session."
        );
      }
      const session = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet.");
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (error) {
        throw new Error((error as { message: string }).message);
      }
    } catch (error) {
      console.error("Checkout process failed:", error);
      showToastMessage(`Error: ${(error as { message?: string }).message ?? "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  }, [
    name,
    email,
    solutionType,
    trinitySelectionId,
    selectedTier,
    hasPhysicalStore,
    additionalNotes,
    keywords,
    selectedSystems,
    selectedDashboards,
    calculateRunningTotal,
    showToastMessage,
  ]);

  const renderStepContent = () => {
    const steps = getSteps();
    const isReviewStep = steps.length > 1 && steps.length === currentStep;

    if (isReviewStep && solutionType) {
      return (
        <MemoizedFinalSummary
          trinitySelectionId={trinitySelectionId}
          selectedTier={selectedTier}
          selectedIndustry={selectedIndustry}
          solutionType={solutionType}
          budget={budget}
          hasPhysicalStore={hasPhysicalStore}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          additionalNotes={additionalNotes}
          setAdditionalNotes={setAdditionalNotes}
          keywords={keywords}
          setKeywords={setKeywords}
          selectedSystems={selectedSystems}
          setSelectedSystems={setSelectedSystems}
          selectedDashboards={selectedDashboards}
          setSelectedDashboards={setSelectedDashboards}
          prevStep={prevStep}
          handleCheckout={handleCheckout}
          isProcessing={isProcessing}
          calculateRunningTotal={calculateRunningTotal}
        />
      );
    }

    switch (solutionType) {
      case "trinity":
        switch (currentStep) {
          case 1:
            return (
              <MemoizedSolutionChoice
                solutionType={solutionType}
                setSolutionType={setSolutionType}
                nextStep={nextStep}
              />
            );
          case 2:
            return (
              <MemoizedTrinityPackages
                trinitySelectionId={trinitySelectionId}
                setTrinitySelectionId={setTrinitySelectionId}
                recommendations={recommendations}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          case 3:
            return (
              <MemoizedStoreType
                trinitySelectionId={trinitySelectionId}
                hasPhysicalStore={hasPhysicalStore}
                setHasPhysicalStore={setHasPhysicalStore}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          default:
            return null;
        }
      case "website":
        switch (currentStep) {
          case 1:
            return (
              <MemoizedSolutionChoice
                solutionType={solutionType}
                setSolutionType={setSolutionType}
                nextStep={nextStep}
              />
            );
          case 2:
            return (
              <MemoizedIndustryStep
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          case 3:
            return (
              <MemoizedGoalsStep
                selectedGoals={selectedGoals}
                setSelectedGoals={setSelectedGoals}
                budget={budget}
                setBudget={setBudget}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          case 4:
            return (
              <MemoizedPlatformTier
                selectedTier={selectedTier}
                setSelectedTier={setSelectedTier}
                recommendations={recommendations}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          default:
            return null;
        }
      case "both":
        switch (currentStep) {
          case 1:
            return (
              <MemoizedSolutionChoice
                solutionType={solutionType}
                setSolutionType={setSolutionType}
                nextStep={nextStep}
              />
            );
          case 2:
            return (
              <MemoizedIndustryStep
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          case 3:
            return (
              <MemoizedTrinityPackages
                trinitySelectionId={trinitySelectionId}
                setTrinitySelectionId={setTrinitySelectionId}
                recommendations={recommendations}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          case 4:
            return (
              <MemoizedPlatformTier
                selectedTier={selectedTier}
                setSelectedTier={setSelectedTier}
                recommendations={recommendations}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            );
          default:
            return null;
        }
      default:
        return (
          <MemoizedSolutionChoice
            solutionType={solutionType}
            setSolutionType={setSolutionType}
            nextStep={nextStep}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-black to-indigo-950 opacity-90 z-0" />
      <div className="fixed inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-10 animate-pulse z-[1]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              Transform Your Business with{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Intelligent Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Custom websites, AI-powered systems, or both - tailored to your
              needs
            </p>
          </div>
          <button
            onClick={resetSelections}
            className="absolute top-0 right-0 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            title="Start Over"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {getSteps().map((step, i) => {
            const stepNum = i + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <div
                key={i}
                className={`flex items-center px-4 py-2 rounded-full text-sm transition-all duration-300 border ${isActive ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent scale-105" : isCompleted ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent" : "bg-white/5 backdrop-blur-sm text-gray-400 border-white/10"}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 font-semibold transition-colors ${isActive ? "bg-white/20" : isCompleted ? "bg-transparent" : "bg-white/10"}`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </span>
                <span>{step}</span>
              </div>
            );
          })}
        </div>
        {renderStepContent()}
      </div>
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-slideIn border border-white/20 z-50">
          <Check className="w-5 h-5 text-green-500" />
          <span className="text-white">{showToast}</span>
        </div>
      )}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          border: none;
        }
      `}</style>
    </div>
  );
};

export default App;
