import React from "react";
import { processCommites } from "../../../../../services/operations/githubAPI";
import { Download, ExternalLink, GitCommit } from "lucide-react";

const RecentCommits = ({ commits, startDate, endDate, generateReport }) => {
  const stats = processCommites(commits, startDate, endDate);
  const recentAuthorCommits = Object.values(stats.authorDetails)
    .map((author) => author.latestCommit)
    .sort(
      (a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date)
    );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Commits
          </h3>
          <p className="text-sm text-gray-500">
            Latest activity by contributors
          </p>
        </div>
        <button
          onClick={generateReport}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>

      <div className="space-y-4">
        {recentAuthorCommits.map((commit, index) => (
          <div
            key={index}
            className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              {commit.author?.avatar_url ? (
                <img
                  src={commit.author.avatar_url}
                  alt={commit.commit.author.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <GitCommit className="w-5 h-5 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {commit.commit.message.split("\n")[0]}
              </p>
              <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                <span>{commit.commit.author.name}</span>
                <span>•</span>
                <span>
                  {new Date(commit.commit.author.date).toLocaleString()}
                </span>
              </div>
            </div>
            <a
              href={commit.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCommits;
