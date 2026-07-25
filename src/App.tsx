import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  BookOpen, 
  ArrowLeftRight, 
  MessageSquare, 
  FileText, 
  GraduationCap, 
  History, 
  Bookmark, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  X, 
  Briefcase,
  Home,
  ArrowLeft,
  BrainCircuit
} from "lucide-react";

import { DrugProfile, SearchHistoryItem, SuggestedDrug } from "./types";
import DrugReport from "./components/DrugReport";
import ComparePanel from "./components/ComparePanel";
import DrugChat from "./components/DrugChat";
import LandingPage from "./components/LandingPage";
import { parseApiResponse } from "./utils/http";

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState<"report" | "compare" | "chat">("report");
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedDrug[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedDrugsDb, setSuggestedDrugsDb] = useState<SuggestedDrug[]>([]);
  
  // Drug States
  const [drugProfile, setDrugProfile] = useState<DrugProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Comparison states
  const [drugCompareA, setDrugCompareA] = useState<DrugProfile | null>(null);
  const [drugCompareB, setDrugCompareB] = useState<DrugProfile | null>(null);
  const [loadingCompareA, setLoadingCompareA] = useState(false);
  const [loadingCompareB, setLoadingCompareB] = useState(false);

  // Search History State
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Refs for closing suggestion list on outside click
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Fetch baseline suggestions on mount
  useEffect(() => {
    fetch("/api/suggested-drugs")
      .then((res) => parseApiResponse<SuggestedDrug[]>(res, "The suggestion service returned an invalid response."))
      .then((data) => setSuggestedDrugsDb(data))
      .catch((err) => console.error("Error loading suggestion db:", err));

    // Load search history from localstorage
    const saved = localStorage.getItem("clinical_pharmacist_search_history");
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Handle outside clicks for autocomplete dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter autocomplete based on input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = suggestedDrugsDb.filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.class.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered);
  }, [searchQuery, suggestedDrugsDb]);

  // Load a drug info profile from backend
  const handleLoadDrug = async (drugNameStr: string) => {
    if (!drugNameStr.trim()) return;
    setLoading(true);
    setError(null);
    setShowSuggestions(false);
    setSearchQuery(drugNameStr);
    setViewMode("app");

    try {
      const response = await fetch("/api/drug-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugName: drugNameStr }),
      });

      if (!response.ok) {
        const errData = await parseApiResponse<{ error?: string }>(response, "Failed to load clinical drug profile.");
        throw new Error(errData.error || "Failed to load clinical drug profile.");
      }

      const data: DrugProfile = await parseApiResponse<DrugProfile>(response, "The server returned an invalid profile response.");
      setDrugProfile(data);
      if (data.isQuotaExhausted) {
        setIsQuotaExhausted(true);
      } else {
        setIsQuotaExhausted(false);
      }

      // Save to recent search history
      const newHistoryItem: SearchHistoryItem = {
        drugName: drugNameStr,
        genericName: data.genericName,
        drugClass: data.drugClass,
        timestamp: new Date().toLocaleDateString(),
      };

      // De-duplicate history
      const updatedHistory = [
        newHistoryItem,
        ...searchHistory.filter((item) => item.genericName.toLowerCase() !== data.genericName.toLowerCase()),
      ].slice(0, 8); // keep latest 8 items

      setSearchHistory(updatedHistory);
      localStorage.setItem("clinical_pharmacist_search_history", JSON.stringify(updatedHistory));
      
      // Auto-focus report tab on successful search
      setActiveTab("report");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading clinical drug information.");
    } finally {
      setLoading(false);
    }
  };

  // Compare drugs searching
  const handleCompareSearch = async (drugNameStr: string, target: "A" | "B") => {
    if (!drugNameStr.trim()) return;
    if (target === "A") {
      setLoadingCompareA(true);
    } else {
      setLoadingCompareB(true);
    }

    try {
      const response = await fetch("/api/drug-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugName: drugNameStr }),
      });

      if (!response.ok) {
        const errData = await parseApiResponse<{ error?: string }>(response, "Failed to fetch compare drug profile.");
        throw new Error(errData.error || "Failed to fetch compare drug profile.");
      }

      const data: DrugProfile = await parseApiResponse<DrugProfile>(response, "The server returned an invalid comparison profile response.");
      if (target === "A") {
        setDrugCompareA(data);
      } else {
        setDrugCompareB(data);
      }
      if (data.isQuotaExhausted) {
        setIsQuotaExhausted(true);
      }
    } catch (err) {
      console.error("Comparison search failure:", err);
      alert(`Could not load comparison drug details for: "${drugNameStr}". Please try again.`);
    } finally {
      if (target === "A") {
        setLoadingCompareA(false);
      } else {
        setLoadingCompareB(false);
      }
    }
  };

  // Quick categories definitions
  const CATEGORIES = [
    {
      title: "Cardiovascular",
      drugs: ["Lisinopril", "Amlodipine", "Metoprolol", "Warfarin", "Apixaban", "Atorvastatin"],
    },
    {
      title: "Endocrine & Metabolic",
      drugs: ["Metformin", "Levothyroxine"],
    },
    {
      title: "Infectious Disease",
      drugs: ["Amoxicillin"],
    },
    {
      title: "Respiratory & Gastrointestinal",
      drugs: ["Albuterol", "Omeprazole"],
    },
    {
      title: "Neurology & Mental Health",
      drugs: ["Gabapentin", "Sertraline"],
    },
  ];

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("clinical_pharmacist_search_history");
  };

  if (viewMode === "landing") {
    return (
      <LandingPage
        onSearch={handleLoadDrug}
        onEnterApp={() => setViewMode("app")}
        suggestedDrugs={suggestedDrugsDb}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Primary Navigation Header */}
      <header className="bg-[#1E293B] border-b border-slate-700 sticky top-0 z-40 shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("landing")}
              className="p-2 bg-[#111827] hover:bg-[#0F172A] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold mr-1"
              title="Back to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-emerald-500 text-white rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <span className="text-sky-400">PharmAI</span>
                <span className="text-white font-light">Assistant</span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full">
                  Clinical Suite
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                High-yield drug information and comparative studies powered by AI
              </p>
            </div>
          </div>

          {/* Tab Selection Navigation */}
          <div className="flex bg-[#111827] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("report")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "report"
                  ? "bg-[#1E293B] text-sky-400 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Drug Reference
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "compare"
                  ? "bg-[#1E293B] text-sky-400 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Compare Mode
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "chat"
                  ? "bg-[#1E293B] text-sky-400 shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Pharmacist Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Active Warning Disclaimer Banner (Mandatory Medical warning) */}
        <div className="bg-amber-950/20 border-l-4 border-amber-500 p-3.5 rounded-r-xl border border-amber-500/30 shadow-xs flex items-start gap-3 print:hidden">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 leading-relaxed font-medium">
            <span className="font-bold text-amber-400">Clinical Student Notice:</span> This educational assistant provides structured clinical drug profiles. Information is tailored to assist pharmacy coursework and memorization. <span className="underline font-semibold text-amber-300">Do not diagnose patients</span> or replace professional human medical judgment.
          </div>
        </div>

        {isQuotaExhausted && (
          <div className="bg-sky-950/20 border-l-4 border-sky-500 p-4 rounded-r-xl border border-sky-500/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-sky-400 block sm:inline">Offline Mode Activated:</span> Upstream free-tier API limits have been reached. PharmAI has seamlessly transitioned to our <span className="underline font-semibold text-sky-300">High-Yield Offline Medical Database</span>. Popular syllabus drugs remain 100% accessible with offline interactive study profiles and offline chat fallbacks!
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => {
                  alert("To lift all free-tier limits, please ask the AI Coding Agent in the chat: 'Launch the paid model flow' or 'Upgrade my API limits'. The agent will immediately activate the AI Studio Premium model configuration for you!");
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                Unlock Unlimited Premium AI
              </button>
            </div>
          </div>
        )}

        {/* Global Drug Search & Reference Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start print:hidden">
          
          {/* LEFT COLUMN: Search & Study Reference Links */}
          <div className="space-y-6 lg:col-span-1">
            {/* Search Box Card */}
            <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Search className="w-4 h-4 text-sky-400" />
                Drug Lookup
              </h3>

              <div className="relative" ref={autocompleteRef}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLoadDrug(searchQuery);
                      }
                    }}
                    placeholder="Enter generic or brand (e.g. Metformin)..."
                    className="w-full pl-3 pr-9 py-2 text-xs bg-[#0F172A] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-100 transition-all placeholder:text-slate-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-7 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleLoadDrug(searchQuery)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Autocomplete Suggestions Panel */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-1 bg-[#1E293B] border border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto divide-y divide-slate-800"
                    >
                      {suggestions.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            handleLoadDrug(item.name);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-[#0F172A]/80 flex flex-col gap-0.5 transition-colors text-slate-200"
                        >
                          <span className="font-bold text-slate-100">{item.name}</span>
                          <span className="text-[10px] text-sky-400 font-medium uppercase">{item.class}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Loader feedback */}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-300 justify-center py-2 bg-[#0F172A] rounded-lg border border-slate-700">
                  <span className="animate-spin h-3.5 w-3.5 rounded-full border-2 border-sky-500 border-t-transparent" />
                  <span>Synthesizing profile...</span>
                </div>
              )}
            </div>

            {/* Quick Study List Categories */}
            <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-700 pb-2">
                <Bookmark className="w-4 h-4 text-sky-400" />
                Syllabus Quick References
              </h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => (
                  <div key={cat.title} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {cat.title}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.drugs.map((drug) => (
                        <button
                          key={drug}
                          onClick={() => handleLoadDrug(drug)}
                          className="text-[10px] font-medium bg-[#111827] hover:bg-sky-950 hover:text-sky-300 text-slate-300 border border-slate-700 hover:border-sky-800 rounded-md px-2 py-1 transition-all"
                        >
                          {drug}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Searches (History) */}
            {searchHistory.length > 0 && (
              <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-700 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <History className="w-4 h-4 text-sky-400" />
                    Study History
                  </h3>
                  <button
                    onClick={clearHistory}
                    className="text-[10px] font-bold text-slate-500 hover:text-rose-400"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                  {searchHistory.map((item) => (
                    <button
                      key={item.genericName}
                      onClick={() => handleLoadDrug(item.drugName)}
                      className="w-full text-left p-1.5 hover:bg-[#111827] rounded transition-all text-xs flex justify-between items-center group"
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold text-slate-200 group-hover:text-sky-400">
                          {item.genericName}
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate uppercase">
                          {item.drugClass}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Output display based on Active Tab */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Error Notification banner */}
            {error && (
              <div className="bg-rose-950/20 border border-rose-800 p-4 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Error Loading Profile:</span> {error}
                  <button 
                    onClick={() => setError(null)}
                    className="block font-semibold underline mt-1 hover:text-rose-250"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Active Content Body */}
            <div>
              {activeTab === "report" && (
                <div>
                  {drugProfile ? (
                    <DrugReport profile={drugProfile} />
                  ) : (
                    <div className="bg-[#1E293B] rounded-xl border border-slate-700 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4 mt-6">
                      <div className="p-4 bg-sky-950 text-sky-400 border border-sky-850 rounded-full w-14 h-14 flex items-center justify-center mx-auto shadow-inner">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-bold text-slate-100">No Medicine Loaded</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Search for a therapeutic drug (such as <strong className="font-semibold text-slate-300">Metformin</strong>, <strong className="font-semibold text-slate-300">Lisinopril</strong>, or <strong className="font-semibold text-slate-300">Warfarin</strong>) or choose a syllabus quick reference in the sidebar to load the complete 15-section clinical pharmacy study sheet.
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => handleLoadDrug("Metformin")}
                          className="bg-sky-950 text-sky-300 hover:bg-sky-900 text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all border border-sky-800"
                        >
                          Try "Metformin"
                        </button>
                        <button
                          onClick={() => handleLoadDrug("Lisinopril")}
                          className="bg-sky-950 text-sky-300 hover:bg-sky-900 text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all border border-sky-800"
                        >
                          Try "Lisinopril"
                        </button>
                        <button
                          onClick={() => handleLoadDrug("Warfarin")}
                          className="bg-sky-950 text-sky-300 hover:bg-sky-900 text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all border border-sky-800"
                        >
                          Try "Warfarin"
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "compare" && (
                <ComparePanel
                  drugA={drugCompareA}
                  drugB={drugCompareB}
                  loadingA={loadingCompareA}
                  loadingB={loadingCompareB}
                  onSearchDrug={handleCompareSearch}
                  suggestedDrugs={suggestedDrugsDb}
                />
              )}

              {activeTab === "chat" && (
                <DrugChat
                  activeDrugName={drugProfile?.genericName || null}
                  activeDrugProfile={drugProfile}
                />
              )}
            </div>

          </div>

        </div>

        {/* PRINT ONLY LAYOUT VIEW */}
        <div className="hidden print:block space-y-6 text-slate-900">
          <div className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-3xl font-bold">{drugProfile?.genericName || "Drug Info Report"}</h1>
            <p className="text-sm font-semibold uppercase text-slate-500 mt-1">{drugProfile?.drugClass}</p>
          </div>
          {drugProfile && (
            <div className="space-y-4 text-xs font-serif leading-relaxed">
              <p><strong>1. Generic Name:</strong> {drugProfile.genericName}</p>
              <p><strong>2. Brand Names:</strong> {drugProfile.brandNames.join(", ")}</p>
              <p><strong>3. Drug Class:</strong> {drugProfile.drugClass}</p>
              <p><strong>4. Mechanism of Action:</strong> {drugProfile.mechanismOfAction}</p>
              <p><strong>5. Pharmacological Effects:</strong> {drugProfile.pharmacologicalEffects}</p>
              <p><strong>6. Indications / Uses:</strong></p>
              <ul className="list-disc pl-4">
                {drugProfile.indications.map((ind, i) => (
                  <li key={i}>{ind}</li>
                ))}
              </ul>
              <p><strong>7. Dosage & Administration:</strong> {drugProfile.dosageAndAdministration}</p>
              <p><strong>8. Common Side Effects:</strong> {drugProfile.commonSideEffects.join(", ")}</p>
              <p><strong>9. Serious Adverse Effects:</strong> {drugProfile.seriousAdverseEffects.join(", ")}</p>
              <p><strong>10. Contraindications:</strong> {drugProfile.contraindications.join(", ")}</p>
              <p><strong>11. Drug-Drug Interactions:</strong> {drugProfile.drugDrugInteractions.join(", ")}</p>
              <p><strong>12. Drug-Food Interactions:</strong> {drugProfile.drugFoodInteractions.join(", ")}</p>
              <p><strong>13. Monitoring Parameters:</strong> {drugProfile.monitoringParameters.join(", ")}</p>
              <p><strong>14. Patient Counseling Points:</strong> {drugProfile.patientCounseling.join(", ")}</p>
              <p><strong>15. Storage Information:</strong> {drugProfile.storageInformation}</p>
              
              <div className="border-t border-slate-300 pt-3 mt-4">
                <p><strong>Patient Factor Dependencies:</strong> {drugProfile.patientFactorDependency}</p>
                <p className="mt-2"><strong>High-Yield Pharmacy Study Focus:</strong> {drugProfile.pharmacyStudentTip}</p>
              </div>
            </div>
          )}
          <div className="text-center pt-8 border-t border-slate-400 mt-8">
            <p className="text-xs italic">
              Educational information only. Clinical decisions should be made by qualified healthcare professionals.
            </p>
          </div>
        </div>

      </main>

      {/* Persistent Page Footer */}
      <footer className="bg-[#111827] border-t border-slate-800 py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-400">Clinical Pharmacist Assistant</span> © 2026. Made for pharmacy study.
          </div>
          <div className="text-center md:text-right max-w-md italic text-[11px] text-slate-400">
            "Educational information only. Clinical decisions should be made by qualified healthcare professionals."
          </div>
        </div>
      </footer>
    </div>
  );
}
