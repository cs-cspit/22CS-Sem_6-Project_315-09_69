import React from "react";
import { User } from "lucide-react";

const ContributorsOverview = ({ stats, commits }) => {
  return (
    <div className=" p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Contributors</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {Object.entries(stats.authorDetails).map(([author, details], index) => (
          <div
            key={author}
            className="group relative flex flex-col items-center p-4 w-40 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative mb-3">
              {details.avatarUrl ? (
                <img
                  src={details.avatarUrl}
                  alt={author}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-white shadow-md">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.authorCommits[author] || 0}
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-900 text-center line-clamp-1">
              {author}
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              {(
                ((stats.authorCommits[author] || 0) / commits.length) *
                100
              ).toFixed(1)}
              % contribution
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributorsOverview;
