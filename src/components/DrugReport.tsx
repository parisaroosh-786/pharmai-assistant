import { useState } from "react";
import { motion } from "motion/react";
import { 
  Dna, 
  ShieldAlert, 
  ClipboardCheck, 
  HelpCircle, 
  Copy, 
  Check, 
  Printer, 
  AlertOctagon, 
  Layers, 
  FileText, 
  Heart, 
  Eye, 
  Briefcase, 
  BookOpen, 
  Sparkles, 
  Baby, 
  AlertTriangle 
} from "lucide-react";
import { DrugProfile } from "../types";

interface DrugReportProps {
  profile: DrugProfile;
}

export default function DrugReport({ profile }: DrugReportProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const handleCopySection = (title: string, text: string | string[]) => {
    const textToCopy = Array.isArray(text) ? text.join("\n- ") : text;
    navigator.clipboard.writeText(`${title}:\n${textToCopy}`);
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    const brandStr = profile.brandNames.join(", ") || "N/A";
    const fullReport = `DRUG INFORMATION PROFILE: ${profile.genericName.toUpperCase()}
=============================================================
1. Generic Name: ${profile.genericName}
2. Brand Names: ${brandStr}
3. Drug Class: ${profile.drugClass}
4. Mechanism of Action: ${profile.mechanismOfAction}
5. Pharmacological Effects: ${profile.pharmacologicalEffects}
6. Indications/Uses:
- ${profile.indications.join("\n- ")}
7. Dosage and Administration: ${profile.dosageAndAdministration}
8. Common Side Effects:
- ${profile.commonSideEffects.join("\n- ")}
9. Serious Adverse Effects:
- ${profile.seriousAdverseEffects.join("\n- ")}
10. Contraindications:
- ${profile.contraindications.join("\n- ")}
11. Drug-Drug Interactions:
- ${profile.drugDrugInteractions.join("\n- ")}
12. Drug-Food Interactions:
- ${profile.drugFoodInteractions.join("\n- ")}
13. Monitoring Parameters:
- ${profile.monitoringParameters.join("\n- ")}
14. Patient Counseling Points:
- ${profile.patientCounseling.join("\n- ")}
15. Storage Information: ${profile.storageInformation}

SPECIAL PATIENT FACTOR DEPENDENCIES:
${profile.patientFactorDependency}

HIGH-YIELD PHARMACY STUDENT TIP:
${profile.pharmacyStudentTip}

-------------------------------------------------------------
Educational information only. Clinical decisions should be made by qualified healthcare professionals.`;

    navigator.clipboard.writeText(fullReport);
    setCopiedSection("ALL");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleCheck = (itemId: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // 15 mandatory sections mapping
  const sections = [
    { id: "generic", label: "1. Generic Name", category: "Core" },
    { id: "brand", label: "2. Brand Names", category: "Core" },
    { id: "class", label: "3. Drug Class", category: "Core" },
    { id: "moa", label: "4. Mechanism of Action", category: "Core" },
    { id: "effects", label: "5. Pharmacological Effects", category: "Core" },
    { id: "indications", label: "6. Indications / Uses", category: "Therapeutics" },
    { id: "dosage", label: "7. Dosage & Administration", category: "Therapeutics" },
    { id: "storage", label: "15. Storage Information", category: "Therapeutics" },
    { id: "side-effects", label: "8. Common Side Effects", category: "Safety" },
    { id: "adverse", label: "9. Serious Adverse Effects", category: "Safety" },
    { id: "contra", label: "10. Contraindications", category: "Safety" },
    { id: "ddi", label: "11. Drug-Drug Interactions", category: "Safety" },
    { id: "dfi", label: "12. Drug-Food Interactions", category: "Safety" },
    { id: "monitoring", label: "13. Monitoring Parameters", category: "Monitoring" },
    { id: "counseling", label: "14. Patient Counseling Points", category: "Monitoring" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div id="drug-report-root" className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Table of Contents sidebar */}
      <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4 bg-[#111827] p-4 rounded-xl border border-slate-800 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            Quick Navigation
          </span>
          <button 
            id="btn-print-report"
            onClick={handlePrint}
            className="text-xs flex items-center gap-1 text-slate-300 hover:text-sky-400 bg-[#1E293B] border border-slate-750 hover:border-sky-500 py-1 px-2 rounded-md transition-all shadow-sm"
          >
            <Printer className="w-3 h-3" />
            Print
          </button>
        </div>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {["Core", "Therapeutics", "Safety", "Monitoring"].map((cat) => (
            <div key={cat} className="space-y-1">
              <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500 block px-1 mt-2">
                {cat} Information
              </span>
              {sections
                .filter(s => s.category === cat)
                .map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className="w-full text-left py-1.5 px-2 rounded hover:bg-[#1E293B] hover:text-sky-400 hover:shadow-sm text-slate-400 transition-all truncate block"
                  >
                    {s.label}
                  </button>
                ))}
            </div>
          ))}
          <div className="border-t border-slate-800 pt-2 mt-2 space-y-1">
            <button
              onClick={() => scrollToSection("patient-factors")}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-[#1E293B] hover:text-sky-400 text-slate-300 font-medium flex items-center gap-1.5"
            >
              <Baby className="w-3.5 h-3.5 text-indigo-400" />
              Patient Factors
            </button>
            <button
              onClick={() => scrollToSection("student-tip")}
              className="w-full text-left py-1.5 px-2 rounded hover:bg-[#1E293B] hover:text-sky-400 text-slate-300 font-medium flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              High-Yield Study Tip
            </button>
          </div>
        </div>

        <button
          id="btn-copy-all-profile"
          onClick={handleCopyAll}
          className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm mt-4"
        >
          {copiedSection === "ALL" ? (
            <>
              <Check className="w-4 h-4" />
              Copied Study Sheet!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Full Study Sheet
            </>
          )}
        </button>
      </div>

      {/* Main clinical profile display */}
      <div className="lg:col-span-3 space-y-6">
        {/* Drug Header Summary Block */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E293B] border-l-4 border-sky-500 p-6 rounded-r-xl border-y border-r border-slate-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-100">{profile.genericName}</h2>
              <span className="bg-sky-950/40 text-sky-300 border border-sky-800 text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
                {profile.drugClass}
              </span>
            </div>
            
            <div className="mt-2 text-sm text-slate-400">
              <span className="font-semibold text-slate-300">US Brand Names: </span>
              {profile.brandNames.length > 0 ? (
                profile.brandNames.map((brand, i) => (
                  <span key={brand} className="inline-block bg-[#0F172A] text-slate-300 px-2 py-0.5 rounded-md text-xs mr-1.5 font-medium border border-slate-700 mt-1">
                    {brand}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">None standard</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden self-start md:self-auto">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-[#0F172A] hover:bg-[#111827] text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Guide
            </button>
          </div>
        </motion.div>

        {/* 1. Core Pharmacology Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mt-2">
            <Dna className="w-4 h-4 text-sky-400" />
            Core Pharmacology
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Generic & Class Details */}
            <div id="generic" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-slate-100">1. Generic Name & Classification</h4>
                <button 
                  onClick={() => handleCopySection("Generic Name & Class", `${profile.genericName} (${profile.drugClass})`)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Generic Name & Class" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p><strong className="text-slate-200">Generic:</strong> {profile.genericName}</p>
                <p id="class"><strong className="text-slate-200">Drug Class:</strong> {profile.drugClass}</p>
                <p id="brand"><strong className="text-slate-200">Brands:</strong> {profile.brandNames.join(", ") || "N/A"}</p>
              </div>
            </div>

            {/* Pharmacological Effects */}
            <div id="effects" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-slate-100">5. Pharmacological Effects</h4>
                <button 
                  onClick={() => handleCopySection("Pharmacological Effects", profile.pharmacologicalEffects)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Pharmacological Effects" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{profile.pharmacologicalEffects}</p>
            </div>
          </div>

          {/* Mechanism of Action - Wide block for detail */}
          <div id="moa" className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-md relative group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-950/50 text-sky-400 rounded-lg">
                  <Dna className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-slate-100">4. Mechanism of Action (High-Yield Biology)</h4>
              </div>
              <button 
                onClick={() => handleCopySection("Mechanism of Action", profile.mechanismOfAction)}
                className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                title="Copy Section"
              >
                {copiedSection === "Mechanism of Action" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {profile.mechanismOfAction}
            </p>
          </div>
        </div>

        {/* 2. Therapeutics & Dosing */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mt-2">
            <Briefcase className="w-4 h-4 text-sky-400" />
            Therapeutics & Dosing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Indications */}
            <div id="indications" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-slate-100">6. Clinical Indications & Uses</h4>
                <button 
                  onClick={() => handleCopySection("Indications & Uses", profile.indications)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Indications & Uses" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <ul className="space-y-1.5">
                {profile.indications.map((ind, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 shrink-0" />
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Storage Information */}
            <div id="storage" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-slate-100">15. Storage & Stability Information</h4>
                <button 
                  onClick={() => handleCopySection("Storage Information", profile.storageInformation)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Storage Information" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {profile.storageInformation}
              </p>
            </div>
          </div>

          {/* Dosage and Administration */}
          <div id="dosage" className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-md relative group">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-bold text-slate-100">7. Dosage & Administration Details</h4>
              <button 
                onClick={() => handleCopySection("Dosage and Administration", profile.dosageAndAdministration)}
                className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                title="Copy Section"
              >
                {copiedSection === "Dosage and Administration" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {profile.dosageAndAdministration}
            </p>
          </div>
        </div>

        {/* 3. Safety, Risks & Contraindications */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mt-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Safety Profile & Risks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Side Effects */}
            <div id="side-effects" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-slate-100">8. Common Side Effects</h4>
                <button 
                  onClick={() => handleCopySection("Common Side Effects", profile.commonSideEffects)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Common Side Effects" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <ul className="space-y-1.5">
                {profile.commonSideEffects.map((se, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                    <span>{se}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Serious Adverse Effects */}
            <div id="adverse" className="bg-rose-950/10 p-5 rounded-xl border border-rose-500/30 shadow-md relative group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <h4 className="text-sm font-bold text-rose-400">9. Serious Adverse Effects & Box Warnings</h4>
                </div>
                <button 
                  onClick={() => handleCopySection("Serious Adverse Effects", profile.seriousAdverseEffects)}
                  className="text-slate-500 hover:text-rose-300 p-1 rounded hover:bg-rose-950/30 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Serious Adverse Effects" ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <ul className="space-y-1.5">
                {profile.seriousAdverseEffects.map((ae, i) => (
                  <li key={i} className="text-sm text-slate-300 font-medium flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                    <span>{ae}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contraindications */}
            <div id="contra" className="bg-amber-950/10 p-5 rounded-xl border border-amber-500/20 shadow-md relative group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-amber-400">10. Contraindications (Absolute/Relative)</h4>
                </div>
                <button 
                  onClick={() => handleCopySection("Contraindications", profile.contraindications)}
                  className="text-slate-500 hover:text-amber-300 p-1 rounded hover:bg-amber-950/30 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Contraindications" ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <ul className="space-y-1.5">
                {profile.contraindications.map((contra, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Food/Herb Interactions */}
            <div id="dfi" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-bold text-slate-100">12. Drug-Food Interactions</h4>
                <button 
                  onClick={() => handleCopySection("Drug-Food Interactions", profile.drugFoodInteractions)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Drug-Food Interactions" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <ul className="space-y-1.5">
                {profile.drugFoodInteractions.map((food, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Drug-Drug Interactions */}
          <div id="ddi" className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-md relative group">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-bold text-slate-100">11. Clinically Significant Drug-Drug Interactions</h4>
              <button 
                onClick={() => handleCopySection("Drug-Drug Interactions", profile.drugDrugInteractions)}
                className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                title="Copy Section"
              >
                {copiedSection === "Drug-Drug Interactions" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.drugDrugInteractions.map((ddi, i) => (
                <li key={i} className="text-sm text-slate-300 bg-[#0F172A] p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                  <span className="font-semibold text-slate-450 text-xs shrink-0 bg-slate-800 h-5 w-5 rounded-full flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{ddi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Monitoring & Education */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mt-2">
            <ClipboardCheck className="w-4 h-4 text-sky-400" />
            Monitoring & Patient Education (Study Checklists)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monitoring Parameters with Memorization Checklist */}
            <div id="monitoring" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">13. Monitoring Parameters</h4>
                  <p className="text-[10px] text-slate-450">Interactive checklist for pharmacology memorization</p>
                </div>
                <button 
                  onClick={() => handleCopySection("Monitoring Parameters", profile.monitoringParameters)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Monitoring Parameters" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="space-y-2 mt-3">
                {profile.monitoringParameters.map((param, i) => {
                  const key = `mon-${profile.genericName}-${i}`;
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleCheck(key)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${
                        completedItems[key] 
                          ? "bg-sky-950/20 border-sky-850/30 text-slate-500 line-through" 
                          : "bg-[#0F172A] border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span className={`w-4.5 h-4.5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                        completedItems[key] 
                          ? "bg-sky-500 border-sky-500 text-white" 
                          : "border-slate-750 bg-slate-850"
                      }`}>
                        {completedItems[key] && <Check className="w-3 h-3" />}
                      </span>
                      <span className="text-xs">{param}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patient Counseling with Memorization Checklist */}
            <div id="counseling" className="bg-[#1E293B] p-5 rounded-xl border border-slate-700 shadow-md relative group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">14. Patient Counseling Points</h4>
                  <p className="text-[10px] text-slate-450">Core clinical counseling tips to memorize</p>
                </div>
                <button 
                  onClick={() => handleCopySection("Patient Counseling Points", profile.patientCounseling)}
                  className="text-slate-500 hover:text-sky-400 p-1 rounded hover:bg-slate-800 transition-all print:hidden"
                  title="Copy Section"
                >
                  {copiedSection === "Patient Counseling Points" ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="space-y-2 mt-3">
                {profile.patientCounseling.map((counsel, i) => {
                  const key = `coun-${profile.genericName}-${i}`;
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleCheck(key)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${
                        completedItems[key] 
                          ? "bg-sky-950/20 border-sky-850/30 text-slate-500 line-through" 
                          : "bg-[#0F172A] border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span className={`w-4.5 h-4.5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                        completedItems[key] 
                          ? "bg-sky-500 border-sky-500 text-white" 
                          : "border-slate-750 bg-slate-850"
                      }`}>
                        {completedItems[key] && <Check className="w-3 h-3" />}
                      </span>
                      <span className="text-xs">{counsel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SPECIAL SECTIONS */}
        <hr className="border-slate-800 print:hidden" />

        {/* Patient Factor Dependency Summary */}
        <div id="patient-factors" className="bg-[#1E293B] border border-indigo-500/20 p-6 rounded-xl shadow-md relative group">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-950/50 text-indigo-400 rounded-lg">
                <Baby className="w-4 h-4 text-indigo-400" />
              </span>
              <h4 className="text-sm font-bold text-slate-100">Special Population & Patient Factor Adjustments</h4>
            </div>
            <button 
              onClick={() => handleCopySection("Patient Factor Dependencies", profile.patientFactorDependency)}
              className="text-slate-500 hover:text-indigo-400 p-1 rounded hover:bg-indigo-950/30 transition-all print:hidden"
              title="Copy Section"
            >
              {copiedSection === "Patient Factor Dependencies" ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
            {profile.patientFactorDependency}
          </p>
        </div>

        {/* High-Yield Pharmacy Student Tip (Highlight Study Focus Card) */}
        <div id="student-tip" className="bg-[#1E293B] border border-amber-500/20 p-6 rounded-xl shadow-md relative group">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-950/50 text-amber-400 rounded-lg">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </span>
              <h4 className="text-sm font-bold text-slate-100">High-Yield Pharmacology Study Focus</h4>
            </div>
            <button 
              onClick={() => handleCopySection("High-Yield Study Focus", profile.pharmacyStudentTip)}
              className="text-slate-500 hover:text-amber-400 p-1 rounded hover:bg-amber-950/30 transition-all print:hidden"
              title="Copy Section"
            >
              {copiedSection === "High-Yield Study Focus" ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-sm text-amber-200 leading-relaxed font-sans font-medium whitespace-pre-line bg-[#0F172A]/80 p-4 rounded-lg border border-amber-500/20 shadow-inner">
            {profile.pharmacyStudentTip}
          </p>
        </div>

        {/* Disclaimer Note at end of profile */}
        <div className="text-center pt-6 pb-2 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-medium italic flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            Educational information only. Clinical decisions should be made by qualified healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
