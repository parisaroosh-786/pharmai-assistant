import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { DRUG_PROFILES } from "./drugProfiles";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ strict: false }));

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

function findLocalProfileFromText(text: string): any | null {
  const normalizedText = text.trim().toLowerCase();
  if (!normalizedText) {
    return null;
  }

  const rankedMatches = Object.values(DRUG_PROFILES)
    .map((profile) => {
      const names = [profile.genericName, ...profile.brandNames];
      const score = names.reduce((bestScore, name) => {
        const normalizedName = name.trim().toLowerCase();
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

  return rankedMatches[0]?.profile || null;
}

function generateLocalChatFallback(message: string, drugName?: string, currentInfo?: any): string {
  const msgLower = message.toLowerCase();
  
  // Try to find the drug profile if we have one or can match drugName/message text
  let info = currentInfo;
  if (!info && drugName) {
    const normalizedKey = drugName.trim().toLowerCase();
    info = Object.values(DRUG_PROFILES).find(p => {
      return p.genericName.toLowerCase() === normalizedKey ||
             p.brandNames.some(brand => brand.toLowerCase() === normalizedKey) ||
             normalizedKey.includes(p.genericName.toLowerCase()) ||
             p.genericName.toLowerCase().includes(normalizedKey);
    });
  }
  if (!info) {
    info = findLocalProfileFromText(message);
  }

  if (info) {
    const genName = info.genericName;
    
    if (msgLower.includes("side effect") || msgLower.includes("adverse") || msgLower.includes("harm") || msgLower.includes("reaction") || msgLower.includes("toxic") || msgLower.includes("risk") || msgLower.includes("warning")) {
      return `For **${genName}**, the most important safety points are its common adverse effects and serious toxicity risks. In practice, you should be familiar with ${(info.commonSideEffects || []).slice(0, 3).join(", ")} and the key serious concerns such as ${(info.seriousAdverseEffects || []).slice(0, 2).join(" or ")}.`;
    }

    if (msgLower.includes("mechanism") || msgLower.includes("how does it work") || msgLower.includes("how it works") || msgLower.includes("moa") || msgLower.includes("action") || msgLower.includes("pharmacodynamic")) {
      return `The mechanism of action for **${genName}** is: ${info.mechanismOfAction} In short, this drug works by producing a characteristic pharmacologic effect that explains both its therapeutic use and its adverse effect profile.`;
    }

    if (msgLower.includes("monitor") || msgLower.includes("lab") || msgLower.includes("test") || msgLower.includes("check") || msgLower.includes("blood") || msgLower.includes("scr") || msgLower.includes("egfr")) {
      return `For **${genName}**, monitoring should focus on ${(info.monitoringParameters || []).slice(0, 3).join(", ")}. These checks help assess efficacy, toxicity, and whether therapy needs adjustment.`;
    }

    if (msgLower.includes("dose") || msgLower.includes("dosing") || msgLower.includes("dosage") || msgLower.includes("administer") || msgLower.includes("how to take") || msgLower.includes("route")) {
      return `The dosing and administration details for **${genName}** should be individualized based on indication, age, and organ function. A high-yield study point is that route, dose, and timing are essential to safe and effective therapy.`;
    }

    if (msgLower.includes("interaction") || msgLower.includes("interact") || msgLower.includes("food") || msgLower.includes("alcohol") || msgLower.includes("contraindication") || msgLower.includes("avoid")) {
      return `The main interactions for **${genName}** include ${(info.drugDrugInteractions || []).slice(0, 2).join(" and ")} as well as relevant food or alcohol considerations. These interactions are clinically significant because they can increase toxicity or reduce effectiveness.`;
    }

    if (msgLower.includes("counsel") || msgLower.includes("patient") || msgLower.includes("advice") || msgLower.includes("tell the patient")) {
      return `For counseling a patient about **${genName}**, the priority points are ${(info.patientCounseling || []).slice(0, 2).join(" and ")}. These are practical, high-yield topics for both exams and real-world pharmacy practice.`;
    }

    if (msgLower.includes("renal") || msgLower.includes("kidney") || msgLower.includes("hepatic") || msgLower.includes("liver") || msgLower.includes("preg") || msgLower.includes("lactat") || msgLower.includes("elderly") || msgLower.includes("geriatric") || msgLower.includes("child") || msgLower.includes("pediatric") || msgLower.includes("age") || msgLower.includes("factor")) {
      return `How **${genName}** is used and tolerated depends on patient-specific factors such as renal and hepatic function, age, and pregnancy status. This is an important clinical and exam consideration for safe prescribing.`;
    }

    if (msgLower.includes("tip") || msgLower.includes("exam") || msgLower.includes("student") || msgLower.includes("study") || msgLower.includes("focus")) {
      return `A high-yield study point for **${genName}** is that its class, mechanism, and key adverse effects are often tested together. Remembering those three areas will help you answer most related questions efficiently.`;
    }

    // Default response when a drug is active
    return `Here is a concise clinical pharmacology overview of **${genName}**:

- **Drug Class**: ${info.drugClass}
- **Mechanism of Action**: ${info.mechanismOfAction}
- **Typical Indications**: ${(info.indications || []).join(", ")}
- **High-Yield Exam Tip**: ${info.pharmacyStudentTip}

I can also explain its adverse effects, monitoring requirements, dosing considerations, or key drug interactions in greater detail.`;
  }

  // General fallback when no drug is active and we are rate limited
  return `Hello! I am your Clinical Pharmacist Study Companion. We are currently experiencing high request volumes / rate-limiting from the upstream AI service.

To study without any interruption, please search or click on one of our suggested drugs (such as **Metformin**, **Lisinopril**, **Warfarin**, or **Apixaban**). Our local database will immediately load their complete clinical profile, and you can chat about them with full detail!

For general pharmacology study, here is a high-yield overview of major drug classes:
1. **Antihypertensives**: ACE Inhibitors (dry cough due to bradykinin), ARBs (no bradykinin effect), Beta-Blockers (slow heart rate, avoid abrupt cessation), CCBs (peripheral edema with dihydropyridines).
2. **Anticoagulants**: Warfarin (VKORC1 inhibitor, requires INR monitoring of 2.0-3.0), DOACs like Apixaban (direct Factor Xa inhibitor, no routine monitoring).
3. **Oral Antidiabetics**: Metformin (first-line, activates AMPK, lactic acidosis risk, eGFR < 30 contraindicated), Sulfonylureas like Glipizide (stimulates insulin release, high hypoglycemia risk).`;
}

function generateOfflineDrugProfile(drugName: string): any {
  const capitalized = drugName.charAt(0).toUpperCase() + drugName.slice(1);
  return {
    genericName: capitalized,
    brandNames: [`${capitalized} Generic Brand`],
    drugClass: "Clinical Pharmacology agent (Offline High-Yield Template)",
    mechanismOfAction: `The exact mechanism depends on the specific chemical structure of ${capitalized}. Typically, pharmacological agents of this profile act on cell-surface receptors or intracellular enzymes to modulate physiological pathways. (Offline database mode)`,
    pharmacologicalEffects: `Modulates cellular responses and target organ functions to restore homeostasis or treat the underlying pathophysiological state.`,
    indications: [`General therapeutic indications associated with ${capitalized}`],
    dosageAndAdministration: `Dosing must be highly individualized based on patient weight, age, renal/hepatic clearance, and specific clinical indication. Consult standard clinical reference guides (e.g., Lexicomp, Micromedex) for exact dosing.`,
    commonSideEffects: [
      "Gastrointestinal upset (nausea, mild diarrhea)",
      "Headache or transient dizziness",
      "Fatigue or mild somnolence"
    ],
    seriousAdverseEffects: [
      "Severe hypersensitivity or anaphylaxis",
      "Organ toxicity (renal/hepatic impairment under prolonged/improper usage)",
      "Significant drug-drug interaction toxicities"
    ],
    contraindications: [
      "Known hypersensitivity to the drug or any component of the formulation",
      "Severe end-organ failure (unless specifically indicated and titrated)"
    ],
    drugDrugInteractions: [
      "CYP450 substrates/inhibitors (potential for altered plasma concentration)",
      "Additive CNS depressants (if active in the central nervous system)",
      "Renal transport competitors"
    ],
    drugFoodInteractions: [
      "Alcohol (potential to exacerbate adverse CNS or GI effects)",
      "Food (may affect absorption rate or total bioavailability; check specific monograph)"
    ],
    monitoringParameters: [
      "Baseline and periodic renal function (Serum Creatinine, eGFR)",
      "Hepatic function enzymes (AST/ALT) for long-term therapy",
      "Therapeutic efficacy and patient adherence"
    ],
    patientCounseling: [
      "Take exactly as prescribed by your healthcare provider.",
      "Do not abruptly discontinue this medication without medical advice.",
      "Report any severe skin rash, yellowing of skin/eyes, or severe breathing difficulties immediately.",
      "Keep a complete list of all medications and supplements to share with your pharmacist."
    ],
    storageInformation: "Store at room temperature 20°C to 25°C (68°F to 77°F) away from direct moisture and light.",
    patientFactorDependency: "Dosage adjustments are typically required for pediatric, geriatric, and renal/hepatic impaired cohorts. Always verify pregnancy/lactation categories (most standard agents require risk-benefit evaluation).",
    pharmacyStudentTip: `Exam tip for ${capitalized}: When encountering a drug under rate-limiting, remember to categorize its therapeutic index, primary route of elimination, and key adverse effect profile. This high-yield template is served offline to ensure study continuity!`
  };
}

// Mock list of popular drugs for autocomplete / suggestions
const SUGGESTED_DRUGS = [
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
  { name: "Sertraline", class: "Selective Serotonin Reuptake Inhibitor (SSRI)" }
];

app.get("/api/suggested-drugs", (req, res) => {
  res.json(SUGGESTED_DRUGS);
});

app.post("/api/drug-info", async (req, res) => {
  const { drugName } = req.body;

  if (!drugName || typeof drugName !== "string") {
    return res.status(400).json({ error: "Drug name is required" });
  }

  // 1. First, check if we have a pre-filled profile in our offline database
  const normalizedKey = drugName.trim().toLowerCase();
  const matchedProfile = Object.values(DRUG_PROFILES).find(p => {
    return p.genericName.toLowerCase() === normalizedKey ||
           p.brandNames.some(brand => brand.toLowerCase() === normalizedKey) ||
           normalizedKey.includes(p.genericName.toLowerCase()) ||
           p.genericName.toLowerCase().includes(normalizedKey);
  });

  if (matchedProfile) {
    console.log(`[Local DB] Serving cached/pre-filled drug profile for: ${drugName}`);
    return res.json(matchedProfile);
  }

  // If not matched locally and GEMINI_API_KEY is missing, serve a high-yield offline template
  if (!ai) {
    console.log(`[Local DB] API client not configured, generating offline profile for: ${drugName}`);
    const offlineProfile = generateOfflineDrugProfile(drugName);
    offlineProfile.isFallback = true;
    offlineProfile.isQuotaExhausted = false;
    return res.json(offlineProfile);
  }

  try {
    const prompt = `You are an expert Clinical Pharmacist. Your task is to provide a comprehensive, highly accurate, and structured drug information profile for the medicine: "${drugName}". 
This profile is primarily used by pharmacy students and healthcare professionals for clinical studying and reference.

You must follow these rules strictly:
1. Use highly professional and clear clinical language (e.g. mention specific receptors, enzymes, CYP450 metabolism, clearance pathways where relevant).
2. Detail how dosing, efficacy, or safety depends on patient factors (renal function, hepatic function, pregnancy/lactation, geriatric/pediatric populations, pharmacogenomics).
3. Do not diagnose patients. Provide educational pharmacology facts.
4. Strictly return your response matching the requested JSON schema. Make sure all 15 required clinical sections are answered comprehensively.

Provide the profile in structured JSON format.`;

    const config = {
      systemInstruction: "You are a clinical pharmacist assistant, providing professional, detailed, and clear drug information for pharmacy students and healthcare workers.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          genericName: { type: Type.STRING, description: "Official generic name of the drug." },
          brandNames: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Common brand names globally and in the US." 
          },
          drugClass: { type: Type.STRING, description: "Pharmacological class and therapeutic class of the drug." },
          mechanismOfAction: { type: Type.STRING, description: "Detailed, molecular and cellular mechanism of action suitable for high-yield pharmacy exams." },
          pharmacologicalEffects: { type: Type.STRING, description: "Physiological and therapeutic effects of the drug on organ systems." },
          indications: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "FDA-approved and notable off-label clinical indications." 
          },
          dosageAndAdministration: { type: Type.STRING, description: "Standard clinical dosing, routes, and administration guidelines." },
          commonSideEffects: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Common side effects (e.g., >1% or clinically frequent)." 
          },
          seriousAdverseEffects: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Life-threatening adverse reactions, toxicities, or black box warnings." 
          },
          contraindications: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Absolute and major relative contraindications." 
          },
          drugDrugInteractions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Major clinically significant drug-drug interactions (e.g., CYP450 pathways, synergisms)." 
          },
          drugFoodInteractions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Clinically significant food, herb, or beverage interactions." 
          },
          monitoringParameters: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Required laboratory tests or vitals to monitor before/during therapy." 
          },
          patientCounseling: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Critical patient counseling instructions." 
          },
          storageInformation: { type: Type.STRING, description: "Storage parameters, light sensitivity, and stability." },
          patientFactorDependency: { type: Type.STRING, description: "How administration and safety depend on patient factors (renal/hepatic clearance, age, pregnancy/lactation, pharmacogenomics)." },
          pharmacyStudentTip: { type: Type.STRING, description: "A high-yield pharmacology student clinical tip, exam focus point, or biochemical link." }
        },
        required: [
          "genericName", "brandNames", "drugClass", "mechanismOfAction", "pharmacologicalEffects",
          "indications", "dosageAndAdministration", "commonSideEffects", "seriousAdverseEffects",
          "contraindications", "drugDrugInteractions", "drugFoodInteractions", "monitoringParameters",
          "patientCounseling", "storageInformation", "patientFactorDependency", "pharmacyStudentTip"
        ]
      }
    };

    let response;
    try {
      // Try gemini-3.6-flash first
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config
      });
    } catch (apiErr: any) {
      console.warn("gemini-3.6-flash failed or rate-limited for drug-info, falling back to gemini-3.1-flash-lite. Error:", apiErr?.message || apiErr);
      // Fallback to gemini-3.1-flash-lite
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config
      });
    }

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini");
    }

    const data = JSON.parse(text.trim());
    data.isFallback = false;
    data.isQuotaExhausted = false;
    res.json(data);
  } catch (error: any) {
    console.error("Gemini API Error in drug-info, using offline fallback:", error);
    // Graceful fallback to offline dynamically-generated template
    const offlineProfile = generateOfflineDrugProfile(drugName);
    offlineProfile.isFallback = true;
    offlineProfile.isQuotaExhausted = true;
    return res.json(offlineProfile);
  }
});

app.post("/api/drug-chat", async (req, res) => {
  const { drugName, currentInfo, message, chatHistory } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  // If Gemini API is not configured or fails, we use our local responder directly
  if (!ai) {
    const answer = generateLocalChatFallback(message, drugName, currentInfo);
    return res.json({ answer, isFallback: true, isQuotaExhausted: false });
  }

  try {
    const contextText = drugName && currentInfo
      ? `The user is studying or asking about the drug "${drugName}". Here is the known pharmacological data for reference:
Drug Class: ${currentInfo.drugClass}
Mechanism of Action: ${currentInfo.mechanismOfAction}
Common Side Effects: ${(currentInfo.commonSideEffects || []).join(", ")}
Monitoring: ${(currentInfo.monitoringParameters || []).join(", ")}`
      : "The user is asking a general clinical pharmacology or pharmacy-related question.";

    const prompt = `${contextText}

User (Pharmacy Student / Professional): "${message}"

You are an expert Clinical Pharmacist. Provide a highly accurate, clinically detailed response to help them study or understand this topic.
- Use medical terminology but explain clearly.
- Discuss mechanisms, receptor targets, or metabolism if relevant.
- Do not diagnose patients. Include educational facts only.
- Maintain professional clinical tone.
- Conclude with a reminder that this is for educational study only.`;

    let response;
    try {
      // Try gemini-3.6-flash first
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a clinical pharmacist assisting a healthcare professional or pharmacy student. Answer with high-yield clinical facts, clear reasoning, and study-focused explanations.",
        }
      });
    } catch (apiErr: any) {
      console.warn("gemini-3.6-flash failed or rate-limited for drug-chat, falling back to gemini-3.1-flash-lite. Error:", apiErr?.message || apiErr);
      // Fallback to gemini-3.1-flash-lite
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          systemInstruction: "You are a clinical pharmacist assisting a healthcare professional or pharmacy student. Answer with high-yield clinical facts, clear reasoning, and study-focused explanations.",
        }
      });
    }

    res.json({ answer: response.text, isFallback: false, isQuotaExhausted: false });
  } catch (error: any) {
    console.error("Gemini API Error in drug-chat, using local fallback:", error);
    const answer = generateLocalChatFallback(message, drugName, currentInfo);
    res.json({ answer, isFallback: true, isQuotaExhausted: true });
  }
});

// Configure Vite or production static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clinical Pharmacist Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
