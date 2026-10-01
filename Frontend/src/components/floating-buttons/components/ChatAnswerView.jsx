import React from "react";

export default function ChatAnswerView({
  selectedQuestion,
  onBack,
}) {
  if (!selectedQuestion) return null;

  return (
    <div className="px-6 pb-6 space-y-4 max-h-[300px] overflow-y-auto animate-in fade-in duration-200">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-black transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to all questions
      </button>
      <div>
        <h4 className="font-serif text-[15px] font-bold text-black mb-2.5 leading-snug">
          {selectedQuestion.question}
        </h4>
        <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50/80 p-3.5 rounded-lg border border-gray-100 whitespace-pre-wrap">
          {selectedQuestion.answer}
        </p>
      </div>
    </div>
  );
}
