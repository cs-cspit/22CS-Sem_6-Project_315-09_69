import React from 'react'
import {
  AlertCircle,
  Calendar,
  User,
  Award,
  PieChart,
} from "lucide-react";

const EvaluatedWeeklyReport = ({reportDetails}) => {
    
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const roundoff = (val)=>{
    // console.log(val); 
    const roundedVal = Math.round(val * 100) / 100; // Round to two decimal places
    return roundedVal;
}
  // Score display component
  const ScoreDisplay = ({ score, total }) => {
    const percentage = Math.round((score / total) * 100);
    let colorConfig = {
      fill: "#ef4444",
      bg: "bg-red-100",
      text: "text-red-700",
    };

    if (percentage >= 90) {
      colorConfig = {
        fill: "#22c55e",
        bg: "bg-green-100",
        text: "text-green-700",
      };
    } else if (percentage >= 70) {
      colorConfig = {
        fill: "#16a34a",
        bg: "bg-green-100",
        text: "text-green-700",
      };
    } else if (percentage >= 60) {
      colorConfig = {
        fill: "#eab308",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      };
    } else if (percentage >= 50) {
      colorConfig = {
        fill: "#f97316",
        bg: "bg-orange-100",
        text: "text-orange-700",
      };
    }

    return (
      <div
        className={`flex flex-col items-center p-6 rounded-lg ${colorConfig.bg}`}
      >
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e6e6e6"
              strokeWidth="3"
              strokeDasharray="100, 100"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={colorConfig.fill}
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold text-gray-800">
              {percentage}%
            </span>
            <span className={`text-sm font-medium mt-1 ${colorConfig.text}`}>
              {roundoff(score)}/{total}
            </span>
          </div>
        </div>
        <div
          className={`text-lg font-bold mt-4 ${colorConfig.text} flex items-center`}
        >
          <Award className="h-5 w-5 mr-2" />
          Overall Score
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {reportDetails?.evaluation ? (
        <div className="space-y-8">
          <div className="bg-white p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-indigo-900 mb-4 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-indigo-600" />
                  Overall Evaluation
                </h3>
                <div className="text-sm bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
                  <div className="flex items-center mb-2">
                    <User className="h-4 w-4 mr-2 text-indigo-600" />
                    <span className="font-medium font-poppins text-indigo-700">
                      Evaluated by:
                    </span>
                    <span className="ml-2 text-gray-700 font-poppins">
                      {reportDetails.evaluation?.evaluatedBy?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                    <span className="font-medium font-poppins text-indigo-700">Date:</span>
                    <span className="ml-2 text-gray-700 font-poppins">
                      {formatDate(reportDetails.evaluation?.evaluatedAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-medium text-gray-700 mb-3 pb-2 border-b flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-indigo-600" />
                    Instructor Comments
                  </h4>
                  <div className="text-gray-700 italic border-l-4 border-indigo-300 pl-4 py-2">
                    "
                    {
                      reportDetails.evaluation?.overallComment ||
                      "No feedback provided."}
                    "
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 mt-7">
                <ScoreDisplay
                  score={reportDetails.evaluation?.overallMarks || 0}
                  total={reportDetails.evaluation?.rubric?.totalMarks || 100}
                />
              </div>
            </div>
          </div>

          {reportDetails.evaluation?.studentMarks &&
            reportDetails.evaluation?.studentMarks.length > 0 && (
              <div className="bg-white p-4 rounded-xl">
                <h3 className="text-xl font-semibold text-indigo-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-600" />
                  Individual Performance Assessment
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reportDetails.evaluation.studentMarks.map(
                    (student, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                              {student.student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-indigo-900 line-clamp-1 text-md">
                                {student.student.name}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {student.student.studentId}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center font-bold text-white bg-indigo-600 px-3 py-2 rounded-lg">
                            <PieChart className="h-4 w-4 mr-1" />
                            <span>{student.total} marks</span>
                          </div>
                        </div>

                        {student.comments && (
                          <div className="mt-4 text-gray-700 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="font-medium text-indigo-700 mb-1">
                              Instructor Comments:
                            </div>
                            <div className="text-gray-600 italic">
                              {student.comments}
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <div className="font-medium text-indigo-700 mb-3">
                            Performance by Criteria:
                          </div>
                          {student.marks &&
                            student.marks.map((mark, idx) => {
                              // Find the max marks for this criteria
                              const criteria =
                                reportDetails.evaluation?.rubric?.criteria.find(
                                  (c) => c.title === mark.criteriaTitle
                                );
                              const maxMarks = criteria?.maxMarks || 5;
                              const percentage = Math.round(
                                (mark.score / maxMarks) * 100
                              );

                              let progressColor = "bg-red-500";
                              if (percentage >= 90)
                                progressColor = "bg-green-500";
                              else if (percentage >= 70)
                                progressColor = "bg-green-400";
                              else if (percentage >= 60)
                                progressColor = "bg-yellow-500";
                              else if (percentage >= 50)
                                progressColor = "bg-orange-500";

                              return (
                                <div
                                  key={idx}
                                  className="mb-3 bg-white p-4 rounded-lg border border-gray-200"
                                >
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 font-poppins">
                                      {mark.criteriaTitle}
                                    </span>
                                    <span className="font-medium">
                                      {mark.score} / {maxMarks}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                      className={`h-2 rounded-full ${progressColor}`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-500">
            <AlertCircle className="h-12 w-12" />
          </div>
          <p className="text-2xl font-semibold text-indigo-900">
            Evaluation Not Available
          </p>
          <p className="mt-3 text-gray-600 max-w-md text-center">
            This report has not been evaluated yet. Please check back later for
            the evaluation results.
          </p>
        </div>
      )}
    </div>
  );
}

export default EvaluatedWeeklyReport
