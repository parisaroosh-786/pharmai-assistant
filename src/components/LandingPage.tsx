import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Activity, 
  BrainCircuit, 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle,
  BookOpen,
  ArrowLeftRight,
  Plus
} from "lucide-react";
import { SuggestedDrug } from "../types";

interface LandingPageProps {
  onSearch: (drugName: string) => void;
  onEnterApp: () => void;
  suggestedDrugs: SuggestedDrug[];
}

export default function LandingPage({ onSearch, onEnterApp, suggestedDrugs }: LandingPageProps) {
  const [searchVal, setSearchVal] = useState("");
  const [showTips, setShowTips] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearch(searchVal);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Pre-configured popular drugs for instant selection on landing page
  const popularDrafts = [
    { name: "Metformin", class: "Biguanide Antidiabetic" },
    { name: "Lisinopril", class: "ACE Inhibitor" },
    { name: "Warfarin", class: "Vitamin K Antagonist" },
    { name: "Apixaban", class: "Direct Factor Xa Inhibitor" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-150 selection:text-blue-900">
      {/* SaaS Style Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-150 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/10">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                  PharmAI
                </span>
                <span className="text-slate-900 font-light text-lg">Assistant</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block -mt-1">
                Clinical Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => scrollToSection("features")} 
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("how-it-works")} 
              className="hover:text-blue-600 transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection("benefits")} 
              className="hover:text-blue-600 transition-colors"
            >
              Benefits
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-4 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
            >
              Explore Dashboard
            </button>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-lg flex items-center gap-1.5"
            >
              Launch Suite <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen Clinical Pharmacy Intelligence</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Your AI-Powered <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Clinical Pharmacy
              </span>{" "}
              Assistant
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Get instant drug information, clinical insights, and patient counseling support with the power of artificial intelligence. Designed for pharmacy students, clinical educators, and healthcare professionals.
            </p>

            {/* Interactive Quick Search Box */}
            <form onSubmit={handleSearchSubmit} className="max-w-lg mt-8">
              <div className="relative p-1.5 bg-white border border-slate-250 rounded-2xl shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 flex items-center transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter a generic or brand name (e.g. Metformin)..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-2 pr-4 py-2.5 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  Analyze Medicine
                </button>
              </div>
              
              {/* Hot suggestion tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Try directly:</span>
                {popularDrafts.map((drug) => (
                  <button
                    key={drug.name}
                    type="button"
                    onClick={() => onSearch(drug.name)}
                    className="text-[11px] font-bold bg-white text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg px-2.5 py-1 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-emerald-500" />
                    {drug.name}
                  </button>
                ))}
              </div>
            </form>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => onEnterApp()}
                className="px-6 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md shadow-slate-900/10 flex items-center gap-2"
              >
                Launch Studio Companion
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Hero Visual Block */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-emerald-400/20 rounded-3xl filter blur-2xl opacity-70 -z-10"></div>
            <div className="relative bg-white border border-slate-200/80 p-3 rounded-3xl shadow-2xl">
              <img
                src="/src/assets/images/pharma_hero_1784959767435.jpg"
                alt="PharmAI Assistant Hologram Platform"
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-2xl object-cover shadow-inner"
              />
              
              {/* Decorative floating stats overlay */}
              <div className="absolute -bottom-5 -left-5 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: '6s' }}>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Check</p>
                  <p className="text-sm font-black text-slate-900">100% Verified MOAs</p>
                </div>
              </div>

              <div className="absolute -top-5 -right-5 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Query Speed</p>
                  <p className="text-sm font-black text-slate-900">&lt; 1.5s Execution</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-12 bg-white border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
            Designed for pharmacy students and healthcare professionals
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1.5 shadow-xs">
              <span className="block text-3xl sm:text-4xl font-black text-slate-900 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                50,000+
              </span>
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Drug Information Queries
              </span>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Powering high-yield therapeutic reference materials and fast pharmacy exam prep.
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1.5 shadow-xs">
              <span className="block text-3xl sm:text-4xl font-black text-emerald-600">
                Instant
              </span>
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                AI-Powered Responses
              </span>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                No slow searches or heavy textbook paging. Synthesizes complex pharmacokinetics dynamically.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1.5 shadow-xs">
              <div className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  100%
                </span>
              </div>
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Clinical Pharmacy Focused
              </span>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Includes all 15 key therapeutic sections like Patient Counselling and Side Effects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block">
              Feature-Rich Clinical Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              State-of-the-Art Pharmacy Tools
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Equipped with deep structured datasets, automated search summaries, and advanced interactive panels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shadow-inner group-hover:scale-110 transition-transform">
                💊
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">AI Drug Information</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Get detailed information about medicines including mechanism, uses, dosage, side effects, and counseling points.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Smart Medicine Search</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Search any medicine and receive structured clinical information instantly from the offline or LLM clinical library.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Drug Interaction Support</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Identify potential drug-drug and drug-food interactions and understand key clinical significance for exams.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Patient Counseling Assistant</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generate pharmacist-style counseling points for better patient education, side effect containment, and storage.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Pharmacy Learning Tool</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Support pharmacy students with quick clinical explanations, high-yield study tags, and comparative side-by-side matrices.
                </p>
              </div>
            </div>

            {/* Feature 6 - Interactive Sandbox preview */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-sm hover:shadow-md text-white transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                  Companion Suite
                </div>
                <h3 className="text-base font-bold">Try Compare Mode</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Compare drug profiles (like Warfarin vs. Apixaban) in real-time to observe differences in monitoring, excretion, and adverse effects.
                </p>
              </div>
              <button
                onClick={onEnterApp}
                className="w-full bg-white text-blue-700 font-bold text-xs py-2 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
              >
                Go to Compare Panel <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white border-y border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block">
              SaaS Execution Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Three Steps to Pharmacy Mastery
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              How PharmAI retrieves and structures complex pharmacological profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Visual dashed connector lines for wide screens */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-slate-200 -z-10"></div>

            {/* Step 1 */}
            <div className="text-center space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto shadow-md absolute -top-5 left-1/2 -translate-x-1/2">
                1
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto shadow-inner text-lg font-bold mt-2">
                📝
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Enter Medicine Name</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Input any brand or generic (e.g., Amlodipine) or click our pre-mapped high-yield quick list.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto shadow-md absolute -top-5 left-1/2 -translate-x-1/2">
                2
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto shadow-inner text-lg font-bold mt-2">
                ⚙️
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">AI Analyzes Drug Information</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our system consults peer-reviewed frameworks to structure mechanism, dosage, and side effects.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center mx-auto shadow-md absolute -top-5 left-1/2 -translate-x-1/2">
                3
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-500 flex items-center justify-center mx-auto shadow-inner text-lg font-bold mt-2">
                📊
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Receive Clinical Insights</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Browse the comprehensive 15-section clinical report, counseling guides, and interact via pharmacist chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Benefits Copy */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block">
                  Why Choose PharmAI
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Supercharge Your Pharmacy Performance
                </h2>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                  Stay ahead of complex drug profiles and exam criteria with curated, responsive intelligence.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Saves Research Time</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Saves hours spent looking up different texts. Condenses mechanisms and interactions into a single, clean visual dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Improves Pharmacy Learning</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Structured specifically for students with clinical exam tips, drug-class benchmarks, and safety indicators.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Provides Organized Drug Information</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Maintains rigid compliance across all 15 FDA-structured drug reference checkpoints, ensuring systematic memorization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Supports Evidence-Based Practice</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Allows instant comparison of therapeutic choices and highlights vital monitoring parameters like renal or hepatic functions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Interactive Interactive List View visual preview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 uppercase bg-blue-50 px-2.5 py-0.5 rounded-full tracking-wider">
                  Live Preview Mode
                </span>
              </div>

              {/* Sample Profile mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Metformin Hydrochloride</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Biguanide Antidiabetic</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold uppercase">
                    Active
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600">
                      <span>4. Mechanism of Action</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Activates AMP-activated protein kinase (AMPK), leading to reduced hepatic glucose production and increased insulin sensitivity in peripheral tissues.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600">
                      <span>9. Serious Adverse Effects</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Lactic acidosis (rare but severe, heightened risk with eGFR &lt; 30 mL/min/1.73m²), Vitamin B12 deficiency during long-term therapy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-emerald-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Exploring Medicines Smarter
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Equip yourself with verified clinical details, pharmacist-style counseling points, and powerful comparative learning suites instantly.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterApp}
              className="bg-white text-blue-700 hover:bg-slate-50 font-black text-xs sm:text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
            >
              Try PharmAI Assistant Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-base tracking-tight text-white">PharmAI</span>
              </div>
              <p className="text-xs leading-relaxed">
                Smart, clinical-grade pharmacology reference tools built for the modern pharmacist.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">About</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={onEnterApp} className="hover:text-white transition-colors">Our Database</button></li>
                <li><button onClick={onEnterApp} className="hover:text-white transition-colors">Clinical Sources</button></li>
                <li><button onClick={onEnterApp} className="hover:text-white transition-colors">Syllabus Mapping</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Features</h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">AI Search</button></li>
                <li><button onClick={onEnterApp} className="hover:text-white transition-colors">Compare Mode</button></li>
                <li><button onClick={onEnterApp} className="hover:text-white transition-colors">Pharmacist Chat</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Contact</h4>
              <p className="text-xs leading-relaxed">
                Support: <span className="text-slate-300">support@pharmai.edu</span><br />
                Privacy Policy | Terms of Service
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center space-y-4">
            <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl text-left max-w-3xl mx-auto flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-rose-200 leading-relaxed">
                <span className="font-bold">Educational Disclaimer:</span> This AI tool provides educational information only and does not replace professional medical judgment. Always seek the advice of a physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </div>
            
            <p className="text-[11px] text-slate-500">
              © 2026 PharmAI Assistant. Designed with care for pharmacy students and medical educators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
