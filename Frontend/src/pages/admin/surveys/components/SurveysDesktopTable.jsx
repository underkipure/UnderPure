import React from "react";
import { Mail, Calendar } from "lucide-react";
import SurveyScoreBadge from "./SurveyScoreBadge";

export default function SurveysDesktopTable({ surveys }) {
  return (
    <div className="hidden md:block">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium text-center">Score (0-10)</th>
            <th className="px-6 py-4 font-medium">Three Words</th>
            <th className="px-6 py-4 font-medium">Feedback</th>
            <th className="px-6 py-4 font-medium text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {surveys.map((survey) => (
            <tr key={survey.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{survey.email}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    Number(survey.recommend_score) >= 8
                      ? "bg-green-100 text-green-800"
                      : Number(survey.recommend_score) >= 5
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {survey.recommend_score}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600 line-clamp-2">{survey.three_words || "-"}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-600 line-clamp-2 max-w-xs">
                  {survey.improvement_feedback || "-"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
