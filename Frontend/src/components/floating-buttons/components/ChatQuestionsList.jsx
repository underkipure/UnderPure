import React from "react";
import { MessageCircle } from "lucide-react";

export default function ChatQuestionsList({
  searchQuery,
  setSearchQuery,
  searchPlaceholder,
  questions = [],
  onSelectQuestion,
  handleWhatsApp,
}) {
  const filtered = questions.filter(
    (q) =>
      (q.question &&
        q.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.answer && q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Search Bar */}
      <div className="px-6 pb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder || "Search for answers"}
            aria-label="Search support questions"
            className="w-full pl-11 pr-4 py-3 border border-gray-800 rounded-[20px] text-[13px] font-sans focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="px-6 pb-6 space-y-3 max-h-[300px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-6 px-4 space-y-2.5 bg-gray-50/80 rounded-lg border border-gray-100 animate-in fade-in duration-200">
            <p className="text-[13px] font-medium text-gray-800">
              No answer found matching your search.
            </p>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Please contact us on WhatsApp for more details.
            </p>
            <button
              onClick={handleWhatsApp}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-[4px] hover:bg-gray-800 transition-colors shadow-sm"
            >
              <MessageCircle size={13} /> Contact Support
            </button>
          </div>
        ) : (
          filtered.map((q, idx) => (
            <button
              key={q.id || idx}
              onClick={() => onSelectQuestion(q)}
              className="w-full text-left px-5 py-[14px] border border-gray-300 rounded-[6px] text-[13px] font-medium text-black flex justify-between items-center hover:border-black transition-colors"
            >
              <span className="pr-2 leading-tight">{q.question}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 text-black"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ))
        )}
      </div>
    </>
  );
}
