import React, { useState } from "react";
import { fetchAllcommites } from "../../../../services/operations/githubAPI";
import RenderCharts from "./ReportsComponents/RenderCharts";
import { Loader2 } from "lucide-react";
import IconBtn from "../../../comman/IconBtn";
import { setStep } from "../../../../slices/weeklyReportEvaluationSlice";
import { useDispatch } from "react-redux";

const GitHubProgress = () => {
  const owner = "Devarshi0107";
  const repoName = "SIH-backend";

  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAnalysis, setShowAnalysis] = useState(false);

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setShowAnalysis(false);

    if (!owner || !repoName) {
      setError("Please fill in all repository details");
      setLoading(false);
      return;
    }

    try {
      const allCommits = await fetchAllcommites(
        owner,
        repoName,
        startDate,
        endDate
      );
      setCommits(allCommits);
      setShowAnalysis(true);
    } catch (error) {
      setError(
        error.response?.status === 404
          ? "Repository not found. Please check the owner and repository name."
          : "Error fetching repository data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  };

  const handleNextStep = () => {
    dispatch(setStep(3));
    scrollToTop()
  };

  const handlePreviousStep = () => {
    dispatch(setStep(1));
    scrollToTop();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            GitHub Project Analysis
          </h1>
          <p className="text-gray-600">
            Analyze repository activity and contributor insights
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>Analyze Repository</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* {loading && (
          <div className="flex justify-center p-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        )} */}

        {showAnalysis && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Analysis Results
              </h2>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                {`${owner}/${repoName}`}
              </span>
            </div>

            <RenderCharts
              commits={commits}
              startDate={startDate}
              endDate={endDate}
              owner={owner}
              repoName={repoName}
            />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between mt-6">
        <IconBtn
          type="button"
          onClick={handlePreviousStep}
          customClasses="bg-[#4a3aff] hover:bg-[#3929ff] shadow-lg"
        >
          Previous Step
        </IconBtn>
        <IconBtn
          type="button"
          onClick={handleNextStep}
          customClasses="bg-[#4a3aff] hover:bg-[#3929ff] shadow-lg"
        >
          Next Step
        </IconBtn>
      </div>
    </div>
  );
};

export default GitHubProgress;
