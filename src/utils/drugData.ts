import { DRUG_PROFILES } from "../../drugProfiles";
import type { DrugProfile, SuggestedDrug } from "../types";

export const DEFAULT_SUGGESTED_DRUGS: SuggestedDrug[] = [
  { name: "Metformin", class: "Biguanide Antidiabetic" },
  { name: "Lisinopril", class: "ACE Inhibitor" },
  { name: "Atorvastatin", class: "HMG-CoA Reductase Inhibitor" },
  { name: "Amoxicillin", class: "Beta-Lactam Antibiotic" },
  { name: "Albuterol", class: "Beta-2 Adrenergic Agonist" },
  { name: "Gabapentin", class: "GABA Analog / Anticonvulsant" },
  { name: "Amlodipine", class: "Dihydropyridine Calcium Channel Blocker" },
  { name: "Omeprazole", class: "Proton Pump Inhibitor" },
  { name: "Levothyroxine", class: "Thyroid Hormone Replacement" },
  { name: "Warfarin", class: "Vitamin K Antagonist Anticoagulant" },
  { name: "Apixaban", class: "Direct Factor Xa Inhibitor" },
  { name: "Furosemide", class: "Loop Diuretic" },
  { name: "Metoprolol", class: "Beta-1 Selective Adrenergic Blocker" },
  { name: "Ibuprofen", class: "Nonsteroidal Anti-inflammatory Drug (NSAID)" },
  { name: "Sertraline", class: "Selective Serotonin Reuptake Inhibitor (SSRI)" },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function findProfileFromText(text: string): DrugProfile | null {
  const normalizedText = normalize(text);
  if (!normalizedText) {
    return null;
  }

  const rankedMatches = Object.values(DRUG_PROFILES)
    .map((profile) => {
      const names = [profile.genericName, ...profile.brandNames];
      const score = names.reduce((bestScore, name) => {
        const normalizedName = normalize(name);
        if (!normalizedName) {
          return bestScore;
        }

        if (normalizedText === normalizedName) {
          return Math.max(bestScore, 100);
        }

        if (normalizedText.includes(normalizedName) || normalizedName.includes(normalizedText)) {
          return Math.max(bestScore, 70);
        }

        const words = normalizedText.split(/[^a-z0-9]+/).filter(Boolean);
        if (words.includes(normalizedName)) {
          return Math.max(bestScore, 60);
        }

        return bestScore;
      }, 0);

      return { profile, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!rankedMatches.length) {
    return null;
  }

  const match = rankedMatches[0];
  return {
    ...match.profile,
    isFallback: true,
    isQuotaExhausted: true,
  };
}

export function findLocalDrugProfile(drugName: string): DrugProfile | null {
  const normalizedKey = normalize(drugName);
  const matchedProfile = Object.values(DRUG_PROFILES).find((profile) => {
    const genericName = normalize(profile.genericName);
    const brandNames = profile.brandNames.map((brand) => normalize(brand));
    return genericName === normalizedKey || brandNames.includes(normalizedKey) || normalizedKey.includes(genericName) || genericName.includes(normalizedKey);
  });

  if (matchedProfile) {
    return {
      ...matchedProfile,
      isFallback: true,
      isQuotaExhausted: true,
    };
  }

  const inferredProfile = findProfileFromText(drugName);
  if (inferredProfile) {
    return inferredProfile;
  }

  const capitalized = drugName.trim().charAt(0).toUpperCase() + drugName.trim().slice(1);
  return {
    genericName: capitalized || "Medication",
    brandNames: [`${capitalized || "Medication"} Generic Brand`],
    drugClass: "Clinical Pharmacology study template",
    mechanismOfAction: `The exact mechanism depends on the specific chemical structure of ${capitalized || "this medication"}. This built-in educational template is served directly in the browser for offline study use.`,
    pharmacologicalEffects: "Provides a general educational overview when the live API is unavailable.",
    indications: [`General therapeutic indications associated with ${capitalized || "this medication"}`],
    dosageAndAdministration: "Please consult a clinical reference for exact dosing and administration details.",
    commonSideEffects: ["Gastrointestinal upset", "Headache", "Fatigue"],
    seriousAdverseEffects: ["Serious hypersensitivity", "Major organ toxicity"],
    contraindications: ["Known hypersensitivity to the medication"],
    drugDrugInteractions: ["Potential interactions with other medications"],
    drugFoodInteractions: ["Potential food or beverage interactions"],
    monitoringParameters: ["Baseline renal and hepatic function", "Therapeutic response"],
    patientCounseling: ["Take exactly as prescribed", "Report new symptoms promptly"],
    storageInformation: "Store as directed by the product label.",
    patientFactorDependency: "Clinical use depends on age, renal/hepatic function, and other patient factors.",
    pharmacyStudentTip: "Use this offline template when live AI access is unavailable.",
    isFallback: true,
    isQuotaExhausted: true,
  };
}

export function getLocalChatFallback(message: string, drugName?: string, currentInfo?: DrugProfile | null): string {
  const lower = message.toLowerCase();
  const info = currentInfo || (drugName ? findLocalDrugProfile(drugName) : null) || findProfileFromText(message);

  if (info) {
    return `Here is a concise pharmacology overview for ${info.genericName}: it is classified as ${info.drugClass}. I can also provide a deeper explanation of its mechanism of action, adverse effects, monitoring requirements, dosing considerations, or important drug interactions.`;
  }

  if (lower.includes("side effect") || lower.includes("adverse")) {
    return "I’m using the offline pharmacology database. Ask about a specific drug such as Metformin, Lisinopril, or Warfarin for a structured safety overview.";
  }

  return "I’m using the built-in offline pharmacology database for now. Try a known drug name like Metformin or Lisinopril to get a study-friendly profile.";
}
