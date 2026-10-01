import React from "react";
import { Mail } from "lucide-react";
import SurveyScoreBadge from "./SurveyScoreBadge";

export default function SurveysMobileCards({ surveys }) {
  return (
    <div className="md:hidden space-y-4 p-4">
      {surveys.map((survey) => (
        <div
          key={survey.id}
          className="bg-white border border-gray-200 p-4 space-y-3 rounded-xl shadow-xs"
        >
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">
                {survey.email}
              </span>
            </div>
            <SurveyScoreBadge score={survey.recommend_score} />
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[9px] block">
                Three Words
              </span>
              <p className="text-gray-700 font-medium">{survey.three_words || "-"}</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[9px] block">
                Feedback
              </span>
              <p className="text-gray-700 font-medium">
                {survey.improvement_feedback || "-"}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 text-right text-[10px] text-gray-400">
            {new Date(survey.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
