export interface DrugProfile {
  genericName: string;
  brandNames: string[];
  drugClass: string;
  mechanismOfAction: string;
  pharmacologicalEffects: string;
  indications: string[];
  dosageAndAdministration: string;
  commonSideEffects: string[];
  seriousAdverseEffects: string[];
  contraindications: string[];
  drugDrugInteractions: string[];
  drugFoodInteractions: string[];
  monitoringParameters: string[];
  patientCounseling: string[];
  storageInformation: string;
  patientFactorDependency: string;
  pharmacyStudentTip: string;
  isFallback?: boolean;
  isQuotaExhausted?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface SearchHistoryItem {
  drugName: string;
  genericName: string;
  drugClass: string;
  timestamp: string;
}

export interface SuggestedDrug {
  name: string;
  class: string;
}
