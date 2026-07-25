import { ReactNode } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeftRight, 
  Dna, 
  ShieldAlert, 
  ClipboardCheck, 
  Layers, 
  HelpCircle, 
  FileText 
} from "lucide-react";
import { DrugProfile } from "../types";

interface ComparePanelProps {
  drugA: DrugProfile | null;
  drugB: DrugProfile | null;
  loadingA: boolean;
  loadingB: boolean;
  onSearchDrug: (name: string, target: "A" | "B") => void;
  suggestedDrugs: { name: string; class: string }[];
}

export default function ComparePanel({
  drugA,
  drugB,
  loadingA,
  loadingB,
  onSearchDrug,
  suggestedDrugs,
}: ComparePanelProps) {
  const renderComparisonRow = (
    title: string,
    icon: ReactNode,
    valA: string | string[] | undefined,
    valB: string | string[] | undefined,
    isLoadingA: boolean,
    isLoadingB: boolean
  ) => {
    const formatValue = (val: string | string[] | undefined) => {
      if (!val) return <span className="text-slate-500 italic">No drug loaded</span>;
      if (Array.isArray(val)) {
        return (
          <ul className="space-y-1 text-xs text-slate-300 list-disc pl-4">
            {val.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      }
      return <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{val}</p>;
    };

    return (
      <div className="border-b border-slate-800 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-[#1E293B]/35 transition-colors px-2 rounded-lg">
        <div className="md:col-span-2 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-slate-400">
          <span className="p-1 bg-[#0F172A] rounded text-slate-300">{icon}</span>
          <span>{title}</span>
        </div>
        
        <div className="md:col-span-5 bg-[#1E293B] p-3 rounded-lg border border-slate-700 min-h-[60px] shadow-sm">
          {isLoadingA ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-sky-400" />
              Loading drug info...
            </div>
          ) : (
            formatValue(valA)
          )}
        </div>

        <div className="md:col-span-5 bg-[#1E293B] p-3 rounded-lg border border-slate-700 min-h-[60px] shadow-sm">
          {isLoadingB ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-sky-400" />
              Loading drug info...
            </div>
          ) : (
            formatValue(valB)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111827] p-4 rounded-xl border border-slate-800">
        {/* Drug A Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
            Compare Drug A:
          </label>
          <div className="relative">
            <input
              id="compare-input-a"
              type="text"
              placeholder="Search first medicine (e.g., Metformin)..."
              defaultValue={drugA?.genericName || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearchDrug(e.currentTarget.value, "A");
                }
              }}
              className="w-full pl-3 pr-20 py-2 text-sm bg-[#1E293B] text-slate-100 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
            <button
              onClick={(e) => {
                const el = document.getElementById("compare-input-a") as HTMLInputElement;
                if (el?.value) onSearchDrug(el.value, "A");
              }}
              className="absolute right-1.5 top-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs px-2.5 py-1 rounded transition-colors"
            >
              Load A
            </button>
          </div>
          {drugA && (
            <div className="mt-1.5 flex items-center justify-between text-xs px-2">
              <span className="font-semibold text-sky-400 truncate max-w-[200px]">
                Active: {drugA.genericName}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                {drugA.drugClass}
              </span>
            </div>
          )}
        </div>

        {/* Drug B Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
            Compare Drug B:
          </label>
          <div className="relative">
            <input
              id="compare-input-b"
              type="text"
              placeholder="Search second medicine (e.g., Glipizide)..."
              defaultValue={drugB?.genericName || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearchDrug(e.currentTarget.value, "B");
                }
              }}
              className="w-full pl-3 pr-20 py-2 text-sm bg-[#1E293B] text-slate-100 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
            <button
              onClick={(e) => {
                const el = document.getElementById("compare-input-b") as HTMLInputElement;
                if (el?.value) onSearchDrug(el.value, "B");
              }}
              className="absolute right-1.5 top-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs px-2.5 py-1 rounded transition-colors"
            >
              Load B
            </button>
          </div>
          {drugB && (
            <div className="mt-1.5 flex items-center justify-between text-xs px-2">
              <span className="font-semibold text-sky-400 truncate max-w-[200px]">
                Active: {drugB.genericName}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                {drugB.drugClass}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Quick Comparisons */}
      {!drugA && !drugB && (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl max-w-lg mx-auto">
          <ArrowLeftRight className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">Side-by-Side Pharmacological Contrast</h4>
          <p className="text-xs text-slate-400 px-6 mt-1 leading-relaxed">
            Enter two medicines above to compare their mechanisms of action, safety indices, drug interactions, and specific dosage profiles in a single, aligned grid.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 px-4">
            <button
              onClick={() => {
                onSearchDrug("Lisinopril", "A");
                onSearchDrug("Losartan", "B");
              }}
              className="text-[10px] font-medium bg-[#1E293B] hover:bg-sky-950/40 hover:text-sky-400 text-slate-300 border border-slate-700 rounded-full px-2.5 py-1 transition-all"
            >
              Lisinopril vs Losartan
            </button>
            <button
              onClick={() => {
                onSearchDrug("Warfarin", "A");
                onSearchDrug("Apixaban", "B");
              }}
              className="text-[10px] font-medium bg-[#1E293B] hover:bg-sky-950/40 hover:text-sky-400 text-slate-300 border border-slate-700 rounded-full px-2.5 py-1 transition-all"
            >
              Warfarin vs Apixaban
            </button>
            <button
              onClick={() => {
                onSearchDrug("Metformin", "A");
                onSearchDrug("Glipizide", "B");
              }}
              className="text-[10px] font-medium bg-[#1E293B] hover:bg-sky-950/40 hover:text-sky-400 text-slate-300 border border-slate-700 rounded-full px-2.5 py-1 transition-all"
            >
              Metformin vs Glipizide
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Aligned Comparison Matrix */}
      {(drugA || drugB) && (
        <div className="bg-[#111827] rounded-xl border border-slate-800 shadow-md overflow-hidden p-4">
          <div className="bg-[#1E293B] p-3 rounded-lg grid grid-cols-12 gap-4 items-center mb-4">
            <div className="col-span-2 text-[10px] uppercase font-bold text-slate-500">Parameter</div>
            <div className="col-span-5 text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full shrink-0" />
              {drugA ? drugA.genericName : <span className="text-slate-500 italic">Medicine A</span>}
            </div>
            <div className="col-span-5 text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full shrink-0" />
              {drugB ? drugB.genericName : <span className="text-slate-500 italic">Medicine B</span>}
            </div>
          </div>

          <div className="space-y-1">
            {renderComparisonRow("Class", <Layers className="w-3.5 h-3.5" />, drugA?.drugClass, drugB?.drugClass, loadingA, loadingB)}
            {renderComparisonRow("Mechanism", <Dna className="w-3.5 h-3.5" />, drugA?.mechanismOfAction, drugB?.mechanismOfAction, loadingA, loadingB)}
            {renderComparisonRow("Indications", <FileText className="w-3.5 h-3.5" />, drugA?.indications, drugB?.indications, loadingA, loadingB)}
            {renderComparisonRow("Common side effects", <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />, drugA?.commonSideEffects, drugB?.commonSideEffects, loadingA, loadingB)}
            {renderComparisonRow("Serious risks", <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />, drugA?.seriousAdverseEffects, drugB?.seriousAdverseEffects, loadingA, loadingB)}
            {renderComparisonRow("Contraindications", <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />, drugA?.contraindications, drugB?.contraindications, loadingA, loadingB)}
            {renderComparisonRow("Monitoring", <ClipboardCheck className="w-3.5 h-3.5 text-sky-450" />, drugA?.monitoringParameters, drugB?.monitoringParameters, loadingA, loadingB)}
            {renderComparisonRow("Patient factors", <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />, drugA?.patientFactorDependency, drugB?.patientFactorDependency, loadingA, loadingB)}
            {renderComparisonRow("Study Focus", <FileText className="w-3.5 h-3.5 text-amber-400" />, drugA?.pharmacyStudentTip, drugB?.pharmacyStudentTip, loadingA, loadingB)}
          </div>

          {/* Combined Educational Footer Disclaimer */}
          <div className="text-center text-[10px] text-slate-500 italic mt-6 border-t border-slate-800 pt-3">
            Educational information only. Clinical decisions should be made by qualified healthcare professionals.
          </div>
        </div>
      )}
    </div>
  );
}
