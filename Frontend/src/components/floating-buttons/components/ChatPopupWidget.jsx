import React from "react";
import ChatAnswerView from "./ChatAnswerView";
import ChatQuestionsList from "./ChatQuestionsList";
import ChatFooterCta from "./ChatFooterCta";

export default function ChatPopupWidget({
  chatData,
  searchQuery,
  setSearchQuery,
  selectedQuestion,
  setSelectedQuestion,
  onClose,
  handleWhatsApp,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Support Chat"
      className="w-[320px] md:w-[360px] bg-white rounded-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex justify-between items-center bg-white">
        <h3 className="text-[17px] font-sans font-medium text-black">
          {chatData.title || "Hi there, how can we help?"}
        </h3>
        <button
          onClick={onClose}
          aria-label="Close support chat"
          className="text-black hover:opacity-70 p-1 border border-gray-200 rounded-md transition-colors"
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {selectedQuestion ? (
        <ChatAnswerView
          selectedQuestion={selectedQuestion}
          onBack={() => setSelectedQuestion(null)}
        />
      ) : (
        <ChatQuestionsList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder={chatData.searchPlaceholder}
          questions={chatData.questions}
          onSelectQuestion={setSelectedQuestion}
          handleWhatsApp={handleWhatsApp}
        />
      )}

      {/* Footer CTA */}
      <ChatFooterCta
        leaveMessageText={chatData.leaveMessageText}
        handleWhatsApp={handleWhatsApp}
      />
    </div>
  );
}
