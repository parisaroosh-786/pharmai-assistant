import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Sparkles, MessageSquare, Trash2, HelpCircle } from "lucide-react";
import { ChatMessage, DrugProfile } from "../types";
import { parseApiResponse } from "../utils/http";

interface DrugChatProps {
  activeDrugName: string | null;
  activeDrugProfile: DrugProfile | null;
}

export default function DrugChat({ activeDrugName, activeDrugProfile }: DrugChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested questions based on active drug
  const getSuggestedQuestions = () => {
    if (!activeDrugName) {
      return [
        "What is the difference between an ACE inhibitor and an ARB?",
        "Explain the mechanism of loop diuretics vs thiazides.",
        "How are drugs cleared in renal impairment?"
      ];
    }
    return [
      `What are the CYP450 interactions for ${activeDrugName}?`,
      `How does ${activeDrugName} need to be adjusted in renal impairment?`,
      `Explain the specific physiological mechanism behind the side effects of ${activeDrugName}.`,
      `What is the onset and duration of action for ${activeDrugName}?`
    ];
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/drug-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugName: activeDrugName,
          currentInfo: activeDrugProfile,
          message: textToSend.trim()
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to pharmacist AI.");
      }

      const data = await parseApiResponse<{ answer?: string; isQuotaExhausted?: boolean }>(response, "The chat service returned an invalid response.");
      if (data.isQuotaExhausted) {
        setIsQuotaExhausted(true);
      } else {
        setIsQuotaExhausted(false);
      }
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.answer || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `Error: ${err.message || "Failed to process question. Please verify your internet connection and API configuration."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[550px] bg-[#111827] rounded-xl border border-slate-800 overflow-hidden shadow-md">
      {/* Chat header */}
      <div className="bg-[#1E293B] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-sky-950/50 text-sky-400 rounded-lg">
            <MessageSquare className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Pharmacist Study Console</h4>
            <p className="text-[10px] text-slate-400">
              {activeDrugName ? `Interactive Q&A for ${activeDrugName}` : "Ask general clinical pharmacy questions"}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="text-slate-500 hover:text-rose-450 p-1.5 rounded-lg hover:bg-[#1E293B] transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main chat log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0F172A]">
        {isQuotaExhausted && (
          <div className="bg-sky-950/20 border border-sky-850 p-3 rounded-lg text-[11px] text-slate-300 flex items-start gap-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <span className="font-bold text-sky-400">Offline Fallback Engaged:</span> Free-tier limits hit. Responses are powered by our detailed offline pharmacology database. To use live unlimited AI, ask the Agent in the chat to <strong>"Unlock Premium Flow"</strong>!
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 max-w-sm mx-auto space-y-4">
            <div className="p-3 bg-sky-950/50 text-sky-400 rounded-full">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-300">Clinical Chat Companion</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {activeDrugName 
                  ? `Ask specific follow-up questions about ${activeDrugName}'s pharmacokinetics, receptor affinities, metabolic pathway, or clinical dosing.`
                  : "Type any drug name or ask a pharmacology mechanism question to start. The AI pharmacist will assist you in detail."}
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="w-full space-y-1.5 text-left pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 mb-1">
                Suggested Prompts
              </span>
              {getSuggestedQuestions().map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2 bg-[#1E293B] hover:bg-sky-950/40 text-slate-300 hover:text-sky-400 border border-slate-750 hover:border-sky-500 rounded-lg text-xs transition-all shadow-sm flex items-start gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-sm leading-relaxed font-sans ${
                    m.sender === "user"
                      ? "bg-sky-600 text-white rounded-tr-none"
                      : "bg-[#1E293B] text-slate-200 border border-slate-750 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex flex-col items-start">
                <div className="bg-[#1E293B] text-slate-400 border border-slate-750 rounded-2xl rounded-tl-none p-3.5 text-xs shadow-sm flex items-center gap-1.5">
                  <span className="animate-bounce h-1.5 w-1.5 bg-sky-400 rounded-full" />
                  <span className="animate-bounce h-1.5 w-1.5 bg-sky-400 rounded-full delay-75" />
                  <span className="animate-bounce h-1.5 w-1.5 bg-sky-400 rounded-full delay-150" />
                  <span className="text-slate-400 text-[10px] ml-1">Pharmacist is typing...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Suggested Follow-ups (Small row, visible only when chat has messages and a drug is active) */}
      {messages.length > 0 && activeDrugName && (
        <div className="px-3 py-2 bg-[#1E293B] border-t border-slate-800 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth print:hidden">
          {getSuggestedQuestions().slice(0, 2).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="inline-block bg-[#0F172A] hover:bg-sky-950/40 text-slate-300 hover:text-sky-400 border border-slate-750 text-[10px] font-medium px-2.5 py-1 rounded-full transition-all shrink-0 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-[#111827] border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            activeDrugName 
              ? `Ask a clinical question about ${activeDrugName}...`
              : "Type a pharmacy question..."
          }
          className="flex-1 px-3 py-2 text-xs bg-[#1E293B] text-slate-100 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-[#1E293B] shadow-inner"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
