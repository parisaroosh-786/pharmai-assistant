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

  const textTokens = new Set(normalizedText.split(/[^a-z0-9]+/).filter(Boolean));
  const rankedMatches = Object.values(DRUG_PROFILES)
    .map((profile) => {
      const names = [profile.genericName, ...profile.brandNames];
      let score = 0;

      names.forEach((name) => {
        const normalizedName = normalize(name);
        if (!normalizedName) {
          return;
        }

        const aliasTokens = new Set(normalizedName.split(/[^a-z0-9]+/).filter(Boolean));
        const overlap = [...textTokens].filter((token) => aliasTokens.has(token)).length;

        if (normalizedText === normalizedName) {
          score = Math.max(score, 120);
        } else if (normalizedText.includes(normalizedName) || normalizedName.includes(normalizedText)) {
          score = Math.max(score, 90);
        } else if (overlap > 0) {
          score = Math.max(score, 60 + overlap * 10);
        }
      });

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

  if (lower.includes("loop diuretic") && lower.includes("thiazide")) {
    return "Loop diuretics and thiazides both increase sodium excretion, but they act at different nephron sites. Loop diuretics inhibit the Na+-K+-2Cl− cotransporter in the thick ascending limb and produce a stronger diuretic effect with more calcium loss. Thiazides inhibit the Na+/Cl− cotransporter in the distal convoluted tubule and are usually less potent, but they increase calcium reabsorption.";
  }

  if (lower.includes("ace inhibitor") && lower.includes("arb")) {
    return "ACE inhibitors and ARBs both reduce angiotensin II signaling, but ACE inhibitors block angiotensin-converting enzyme, which also increases bradykinin and can cause cough. ARBs block the AT1 receptor directly, so they do not typically cause bradykinin-mediated cough.";
  }

  if (info) {
    const genericName = info.genericName;
    const drugClass = info.drugClass;
    const mechanism = info.mechanismOfAction;
    const sideEffects = info.commonSideEffects?.slice(0, 3).join(", ") || "common adverse effects";
    const seriousEffects = info.seriousAdverseEffects?.slice(0, 2).join(" or ") || "serious toxicity";
    const monitoring = info.monitoringParameters?.slice(0, 3).join(", ") || "relevant labs and clinical follow-up";
    const interactions = info.drugDrugInteractions?.slice(0, 2).join("; ") || "major drug interactions";
    const counseling = info.patientCounseling?.slice(0, 2).join("; ") || "patient counseling points";
    const indications = info.indications?.slice(0, 2).join(" or ") || "its typical therapeutic use";

    if (lower.includes("mechanism") || lower.includes("how it works") || lower.includes("moa") || lower.includes("action")) {
      return `${genericName} is a ${drugClass}. Its mechanism of action is ${mechanism}. In practical terms, that means it works by producing a predictable pharmacologic effect that is central to its therapeutic use and its adverse effect profile.`;
    }

      if (lower.includes("side effect") || lower.includes("adverse") || lower.includes("reaction") || lower.includes("safe") || lower.includes("toxicity") || lower.includes("risk")) {
      return `${genericName} commonly causes ${sideEffects}. The most important safety concerns to remember are ${seriousEffects}. For patient counseling, emphasize early recognition of these effects and when to seek urgent help.`;
    }

    if (lower.includes("dose") || lower.includes("dosing") || lower.includes("dosage") || lower.includes("administer") || lower.includes("take") || lower.includes("route")) {
      return `For ${genericName}, dosing should be individualized based on indication, age, renal function, and clinical context. A practical study point is that dosing and route of administration are critical parts of safe use and should always be verified against the clinical scenario.`;
    }

    if (lower.includes("interaction") || lower.includes("interact") || lower.includes("contraindication") || lower.includes("avoid") || lower.includes("with") && lower.includes("drug")) {
      return `${genericName} has clinically important interactions such as ${interactions}. These can alter efficacy, increase toxicity, or change the safety profile, so they are an important exam and counseling topic.`;
    }

    if (lower.includes("monitor") || lower.includes("lab") || lower.includes("blood") || lower.includes("renal") || lower.includes("hepatic") || lower.includes("check")) {
      return `Monitoring for ${genericName} should focus on ${monitoring}. Clinically, routine review of response, toxicity, and organ function is a key part of safe therapy.`;
    }

    if (lower.includes("counsel") || lower.includes("patient") || lower.includes("advise") || lower.includes("tell the patient") || lower.includes("counseling")) {
      return `When counseling a patient about ${genericName}, the key points are ${counseling}. These are high-yield topics for pharmacy practice and exam preparation.`;
    }

    if (lower.includes("mechanism") || lower.includes("how it works") || lower.includes("moa") || lower.includes("action") || lower.includes("work")) {
      return `${genericName} is a ${drugClass}. Its mechanism of action is ${mechanism}. In practical terms, that means it works by producing a predictable pharmacologic effect that is central to its therapeutic use and its adverse effect profile.`;
    }

    return `${genericName} is commonly classified as ${drugClass} and is used for ${indications}. A strong study summary should include its mechanism, common adverse effects, monitoring needs, dosing considerations, and notable interactions.`;
  }

  if (lower.includes("side effect") || lower.includes("adverse") || lower.includes("reaction") || lower.includes("risk") || lower.includes("safety")) {
    return "I can provide a structured safety overview for a specific medication, including major adverse effects, monitoring considerations, and high-yield counseling points.";
  }

  if (lower.includes("mechanism") || lower.includes("how it works") || lower.includes("moa") || lower.includes("action")) {
    return "I can explain the mechanism of action and the pharmacologic basis of a specific drug in a study-focused way.";
  }

  if (lower.includes("dose") || lower.includes("dosing") || lower.includes("dosage") || lower.includes("administer") || lower.includes("route")) {
    return "I can summarize the dosing, route, and important administration considerations for a specific medication.";
  }

  if (lower.includes("monitor") || lower.includes("lab") || lower.includes("blood") || lower.includes("renal") || lower.includes("hepatic")) {
    return "I can outline the monitoring requirements and lab checks that are most relevant for a specific drug.";
  }

  if (lower.includes("interact") || lower.includes("interaction") || lower.includes("contraindication") || lower.includes("avoid")) {
    return "I can summarize the major interactions, contraindications, and counseling considerations for a specific medication.";
  }

  return "I can help with clinical pharmacology questions about specific drugs, including mechanism of action, adverse effects, dosing, monitoring, and key interactions.";
}
