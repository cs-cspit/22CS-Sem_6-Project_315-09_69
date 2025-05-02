import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generatePDF } from "../../services/operations/generateReports";
import { fetchEvaluatedReportDetails } from "../../services/operations/weeklyReportAPI";
import { useSelector } from "react-redux";
import WeeklyReportInfo from "../../components/core/WeeklyReports/WeeklyReportInfo"
import EvaluatedWeeklyReport from "../../components/core/WeeklyReports/EvaluatedWeeklyReport";
import {
  CheckCircle,
  Clock,
  Calendar,
  User,
  FileText,
  Award,
  CheckSquare,
} from "lucide-react";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const formatNameProperCase = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const WeeklyReportDetails = () => {
  const { weeklyReportId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("details");
  const [reportDetails, setReportDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvaluatedReportDetails = async () => {
      setLoading(true);
      try {
        const reportDetails = await fetchEvaluatedReportDetails(
          weeklyReportId,
          token
        );
        setReportDetails(reportDetails);
        console.log(reportDetails);
        
      } catch (error) {
        console.error("Error fetching report details:", error);
      } finally {
        setLoading(false);
      }
    };
    getEvaluatedReportDetails();
  }, [weeklyReportId, token]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-indigo-600 font-medium">
            Loading report details...
          </p>
        </div>
      </div>
    );
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Evaluated: {
        color: "bg-green-500",
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      },
      Pending: {
        color: "bg-yellow-500",
        icon: <Clock className="h-4 w-4 mr-1" />,
      },
      Draft: {
        color: "bg-gray-500",
        icon: <FileText className="h-4 w-4 mr-1" />,
      },
      Submitted: {
        color: "bg-blue-500",
        icon: <CheckSquare className="h-4 w-4 mr-1" />,
      },
    };

    const config = statusConfig[status] || { color: "bg-gray-500", icon: null };

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm text-white flex items-center font-medium shadow-sm ${config.color}`}
      >
        {config.icon}
        {status || "Unknown"}
      </span>
    );
  };


  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto bg-gradient-to-b bg-white rounded-xl shadow-xl overflow-hidden mb-12 border border-gray-200">
      {/* Header */}
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-700 text-white p-7">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-lg mr-4">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">
              Weekly Report - {reportDetails.reportMetadata?.weekNumber || "5"}
            </h1>
          </div>
          <StatusBadge
            status={reportDetails.reportMetadata?.status || "Evaluated"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 p-4 rounded-xl">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-indigo-200 mr-2" />
              <span className="text-indigo-200 text-sm font-medium">
                Report Period
              </span>
            </div>
            <span className="font-medium text-lg block mt-1">
              {formatDate(
                reportDetails?.reportMetadata?.reportPeriod?.startDate
              )}{" "}
              to{" "}
              {formatDate(reportDetails?.reportMetadata?.reportPeriod?.endDate)}
            </span>
          </div>

          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 text-indigo-200 mr-2" />
              <span className="text-indigo-200 text-sm font-medium">
                Submitted On
              </span>
            </div>
            <span className="font-medium text-lg block mt-1">
              {formatDate(reportDetails.reportMetadata?.submissionDate)}
            </span>
          </div>

          <div className="bg-white/25 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <User className="h-5 w-5 text-indigo-200 mr-2" />
              <span className="text-indigo-200 text-sm font-medium">
                Submitted By
              </span>
            </div>
            <span className="font-medium text-lg block mt-1">
              {formatNameProperCase(reportDetails.reportMetadata?.submittedBy?.name) || "N/A"}
            </span>
            <span className=" block text-indigo-200">
              {reportDetails.reportMetadata?.submittedBy?.studentId || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky flex justify-between items-center top-0 z-10 bg-white border-b border-gray-300 shadow-sm">
        <div className="flex p-2">
          <button
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors flex items-center ${
              activeTab === "details"
                ? "bg-indigo-50 text-indigo-800 shadow-sm border-t border-l border-r border-indigo-200"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("details")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Report Details
          </button>
          <button
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors flex items-center ${
              activeTab === "evaluation"
                ? "bg-indigo-50 text-indigo-800 shadow-sm border-t border-l border-r border-indigo-200"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            } ${!reportDetails.evaluation && "opacity-50 cursor-not-allowed"}`}
            onClick={() =>
              reportDetails.evaluation && setActiveTab("evaluation")
            }
            disabled={!reportDetails.evaluation}
          >
            <Award className="h-4 w-4 mr-2" />
            Evaluation Results
          </button>
        </div>
        <div className="sticky flex justify-between items-center top-0 z-10 bg-white border-b border-gray-300 shadow-sm">
          <div className="flex p-2">
            <button
              className={`px-6 py-3 rounded-t-lg font-medium transition-colors flex items-center bg-indigo-50 text-indigo-800 shadow-sm border-t border-l border-r border-indigo-200 ${
                !reportDetails.evaluation && "opacity-50 cursor-not-allowed"
              } `}
              onClick={() => generatePDF(reportDetails)}
              disabled={!reportDetails.evaluation}
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Weekly Report
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8">
        {activeTab === "details" ? (
          <WeeklyReportInfo reportDetails={reportDetails} />
        ) : (
          <EvaluatedWeeklyReport reportDetails={reportDetails} />
        )}
      </div>
    </div>
  );
};

export default WeeklyReportDetails;
