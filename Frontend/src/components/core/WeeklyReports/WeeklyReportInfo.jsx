import React from 'react'
import {
  CheckCircle,
  User,
  Paperclip,
  Layers,
  GitCommit,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";

const formatNameProperCase = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const WeeklyReportInfo = ({reportDetails}) => {

      const ContentSection = ({ title, content, icon }) => {
        if (!content) return null;

        return (
          <div className="mt-6 ">
            <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
              {icon}
              <span className="ml-2">{title}</span>
            </h3>
            <div className="bg-white p-5 rounded-lg text-gray-700 border border-indigo-100 shadow-md">
              {content.split("\n").map((item, index) => (
                <div key={index} className="py-1">
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      };
  return (
    <div className="space-y-6">
      <div className="bg-white p-6">
        <h2 className="text-2xl font-semibold text-indigo-800 border-b pb-3 mb-4 flex items-center">
          <Layers className="h-6 w-6 mr-2 text-indigo-600" />
          {reportDetails.content?.title || "Weekly Report"}
        </h2>

        <ContentSection
          title="Work Done"
          content={reportDetails.content?.workDone}
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        />
        <ContentSection
          title="Challenges Faced"
          content={reportDetails.content?.challenges}
          icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
        />
        <ContentSection
          title="Next Week Plan"
          content={reportDetails.content?.nextWeekPlan}
          icon={<GitCommit className="h-5 w-5 text-blue-600" />}
        />

        {reportDetails.content?.individualWork &&
          reportDetails.content?.individualWork.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <User className="h-5 w-5 text-indigo-600 mr-2" />
                Individual Contributions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportDetails.content.individualWork.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-lg border border-indigo-100 shadow-md"
                  >
                    <div className="font-medium text-indigo-700 mb-3 pb-2 border-b border-indigo-100 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {formatNameProperCase(item?.student?.name) || "Unknown"}
                      <span className="text-gray-500 text-sm ml-2">
                        ({item?.student?.studentId || "N/A"})
                      </span>
                    </div>
                    <div className="text-gray-700">
                      {item.work.split("\n").map((task, idx) => (
                        <div key={idx} className="flex items-start py-1">
                          <CheckSquare className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {reportDetails.content?.attachments &&
          reportDetails.content?.attachments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <Paperclip className="h-5 w-5 text-indigo-600 mr-2" />
                Attachments
              </h3>
              <div className="flex flex-wrap gap-3">
                {reportDetails.content.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    className="flex items-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="font-medium">{attachment.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default WeeklyReportInfo
