import React, { useEffect, useState } from "react";
// import Loader from '../../components/comman/Loader';
import { fetchDetailedWeeklyReport } from "../../../../services/operations/weeklyReportAPI";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import IconBtn from "../../../comman/IconBtn";
import { setStep } from "../../../../slices/weeklyReportEvaluationSlice"

function WeeklyReport() {
  const [weeklyReport, setWeeklyReport] = useState({
    startDate: "",
    endDate: "",
    title: "",
    workDone: "",
    challenges: "",
    weekNumber: "",
    individualWork: [],
    attachments: [
      {
        name: "",
        url: [],
      },
    ],
    submissionDate: "",
  });

  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { weeklyReportId } = useParams();
  const dispatch = useDispatch();
  // const currentStep = useSelector(state => state.weeklyReport.step);

  useEffect(() => {
    const getReportDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchDetailedWeeklyReport(weeklyReportId, token);
        // console.log("API Response:", response);
        if (response?.success && response?.data) {
          setWeeklyReport(response.data);
        }
      } catch (error) {
        console.error("Error fetching report details:", error);
      }
      setLoading(false);
    };
    getReportDetails();
  }, [weeklyReportId, token]);

  // Format date to local string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  const handleNextStep = () => {
    dispatch(setStep(2));
    scrollToTop();
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <div className="bg-white rounded-xl p-8">
        <div className="pb-4">
          <h2 className="text-[#4A3AFF] text-2xl font-semibold">
            Weekly Report
          </h2>
          <p className="text-[#6F6C90] text-sm mt-1">
            Weekly report details submitted by the team.
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#170F49]">
                Week
              </label>
              <div className="h-10 px-4 py-2 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
                {weeklyReport.weekNumber}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#170F49]">
                Start Date
              </label>
              <div className="h-10 px-4 py-2 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
                {formatDate(weeklyReport.startDate)}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#170F49]">
                End Date
              </label>
              <div className="h-10 px-4 py-2 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
                {formatDate(weeklyReport.endDate)}
              </div>
            </div>
          </div>

          {/* Topic Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#170F49]">
              Topic
            </label>
            <div className="min-h-[40px] px-4 py-3 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
              {weeklyReport.title}
            </div>
          </div>

          {/* Work Done Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#170F49]">
              Work Done
            </label>
            <div className="min-h-[120px] px-4 py-3 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans">
                {weeklyReport.workDone}
              </pre>
            </div>
          </div>

          {/* Challenges Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#170F49]">
              Challenges
            </label>
            <div className="min-h-[100px] px-4 py-3 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans">
                {weeklyReport.challenges}
              </pre>
            </div>
          </div>

          {/* Next Week Plan Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#170F49]">
              Next Week Plan
            </label>
            <div className="min-h-[100px] px-4 py-3 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans">
                {weeklyReport.nextWeekPlan || "None"}
              </pre>
            </div>
          </div>

          {/* Individual Work Section */}
          {weeklyReport.individualWork &&
            weeklyReport.individualWork.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#4A3AFF]">
                  Individual Contributions
                </h3>
                {weeklyReport.individualWork.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-[#170F49]">
                      Group Member {index + 1}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-[120px,1fr] gap-4">
                      <div className="h-10 px-4 py-2 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
                        {member.studentId}
                      </div>
                      <div className="min-h-[40px] px-4 py-2 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
                        {member.work}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Attachments Section */}
          {weeklyReport.attachments && weeklyReport.attachments.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#170F49]">
                Attachments
              </label>
              <div className="h-10 px-4 py-2 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
                <a
                  href={weeklyReport.attachments[0].url[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {weeklyReport.attachments[0].name}
                </a>
              </div>
            </div>
          )}

          {/* Submission Date Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#170F49]">
              Submission Date
            </label>
            <div className="h-10 px-4 py-2 text-[#6F6C90] bg-[#F8F8FA] rounded-lg shadow-md">
              {weeklyReport.submissionDate}
            </div>
          </div>

          {/* Next Step Button */}
          <div className="flex flex-row-reverse mt-6">
            <IconBtn
              type="button"
              onClick={handleNextStep}
              customClasses="bg-[#4a3aff] hover:bg-[#3929ff] shadow-lg"
            >
              Next Step
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyReport;
