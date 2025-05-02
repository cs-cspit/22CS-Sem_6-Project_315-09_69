import React, { useEffect, useState } from 'react';
import Loader from '../../components/comman/Loader';
import { fetchProjectDetails, projectApproval } from '../../services/operations/facultyAPI';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  FaUserTie, 
  FaUsers, 
  FaLaptopCode, 
  FaCalendarAlt, 
  FaCalendarCheck, 
  FaGithub,
  FaCheck,
  FaTimes,
  FaHistory
} from 'react-icons/fa';
import {
  MdOutlineDomain,
  MdDescription,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdComment,
  MdArrowRight,
} from "react-icons/md";
import { BsArrowRightCircleFill, BsShieldLockFill } from 'react-icons/bs';

const ProjectApprovalPage = () => {
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);
  const {token} = useSelector(state => state.auth);
  const {projectType, activeNavItem, semester, academicYear} = useSelector(state => state.faculty);
  const {projectId} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = location.state || {};
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const [actionType, setActionType] = useState(""); // "reject" or "revision"

  const navData = {
    projectType,
    activeNavItem,
    semester,
    academicYear
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleOnClick = async (status) => {
    setLoading(true);
    try {
      const response = await projectApproval(status, projectId, navData, comment, token, navigate);
      if (!response) {
        throw Error(`Failed to ${status}`);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(`Failed to ${status}`);
    }
    setLoading(false);
  };

  const handleActionClick = (type) => {
    setActionType(type);
    setShowCommentModal(true);
  };

  // const handleSubmitAction = async () => {
  //   if (!comment.trim()) {
  //     toast.error("Please provide a comment");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const status = actionType === "Reject" ? "Rejected" : "Revision";
  //     const response = await projectApproval(status, projectId, navData, comment, token, navigate);
  //     if (!response) {
  //       throw Error(`Failed to ${status} project`);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     toast.error(`Failed to process request`);
  //   }
  //   setLoading(false);
  //   setShowCommentModal(false);
  // };

  const handleSubmitAction = async () => {
    if (!comment.trim()) {
      toast.error("Please provide a comment explaining the reasons.");
      return;
    }

    setLoading(true);
    try {
      const status = actionType === "Reject" ? "Rejected" : "Revision";
      const response = await projectApproval(
        status,
        projectId,
        navData,
        comment,
        token,
        navigate
      );
      if (!response) {
        throw Error(`Failed to ${status.toLowerCase()} project`);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(`Failed to process request: ${error.message}`);
    }
    setLoading(false);
    setShowCommentModal(false);
  };

  useEffect(() => {
    const getProjectDetails = async () => {
      setLoading(true);
      try {
        const projectDetails = await fetchProjectDetails(projectId, token);
        
        setProject(projectDetails);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getProjectDetails();
  }, [projectId, token]);

  console.log(project.description);
  

  return (
    <div className="flex flex-col px-6 py-6 space-y-8 bg-[#F8F9FC] min-h-screen mt-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <Loader />
          </div>
        </div>
      )}

      {/* Project Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-purple-500">
        {/* <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] h-16"></div> */}
        <div className="p-6 flex justify-between items-center">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-[#170F49] font-poppins font-bold text-2xl">
              {project?.title || "Project Name"}
            </h1>
            <p className="text-[#6F6C90] font-poppins mt-1 flex items-center">
              <BsShieldLockFill className="mr-2 text-[#8B5CF6]" />
              Group ID: {project?.groupId || "N/A"}
            </p>
          </div>

          <div className="flex gap-x-4">
            {project.approvalStatus === "Pending" ? (
              <>
                <button
                  onClick={() => handleOnClick("Approved")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaCheck className="text-white" />
                  <span className="relative font-medium">Approve</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                </button>

                <button
                  onClick={() => handleActionClick("Revision")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaHistory className="text-white" />
                  <span className="relative font-medium">Need Revision</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                </button>

                <button
                  onClick={() => handleActionClick("Reject")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaTimes className="text-white" />
                  <span className="relative font-medium">Reject</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                </button>
              </>
            ) : project.approvalStatus === "Revision" &&
              project.isRevisionalResubmitted ? (
              <>
                <button
                  onClick={() => handleOnClick("Approved")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaCheck className="text-white" />
                  <span className="relative font-medium">Approve</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                </button>

                <button
                  onClick={() => handleActionClick("Revision")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaHistory className="text-white" />
                  <span className="relative font-medium">Need Revision</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                </button>

                <button
                  onClick={() => handleActionClick("Reject")}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaTimes className="text-white" />
                  <span className="relative font-medium">Reject</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                </button>
              </>
            ) : (
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                  project.approvalStatus === "Approved"
                    ? "bg-[#ECFDF5] text-[#059669] border-2 border-[#059669]"
                    : project.approvalStatus === "Revision"
                    ? "bg-[#FFFBEB] text-[#D97706] border-2 border-[#D97706]"
                    : "bg-[#FEF2F2] text-[#DC2626] border-2 border-[#DC2626]"
                }`}
              >
                {project.approvalStatus === "Approved" && (
                  <MdCheckCircle className="w-5 h-5" />
                )}
                {project.approvalStatus === "Revision" && (
                  <MdWarning className="w-5 h-5" />
                )}
                {project.approvalStatus === "Rejected" && (
                  <MdCancel className="w-5 h-5" />
                )}
                {project.approvalStatus === "Revision" && (
                  <p>Project is not re-submitted -</p>
                )}

                {project.approvalStatus}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Project Details */}
      <div className=" space-y-8">
        {/* Description Card */}
        <div className="bg-white rounded-xl p-6 shadow-md transform transition-all duration-300 hover:shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <MdDescription className="text-purple-600 text-xl" />
            </div>
            <h2 className="text-gray-800 font-bold text-xl ml-4">
              Project Description
            </h2>
          </div>
          <div className="pl-2 border-l-2 border-gray-100">
            <textarea
              className="text-gray-600 min-h-40 w-full leading-relaxed whitespace-pre-line focus:outline-none"
              value={
                project.description ||
                "No description available for this project. Please add a detailed overview of project goals, scope, and expected outcomes."
              }
              readOnly
            />
          </div>
        </div>

        {project?.comments && (
          <div className="bg-white rounded-xl p-6 shadow-md transform transition-all duration-300 hover:shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MdComment className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-gray-800 font-bold text-xl ml-4">
                Mentor's Comments
              </h2>
            </div>
            <div className="pl-2 border-l-2 border-gray-100">
              <div className="text-gray-600 min-h-20 w-full leading-relaxed whitespace-pre-line focus:outline-none">
                {project?.comments.map((comment) => (
                  <div className="flex gap-x-1 items-center">
                    <MdArrowRight className="text-purple-600 text-xl" />
                    {comment.comment}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Domain Card */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-indigo-500">
            <div className="flex items-center mb-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <MdOutlineDomain className="text-indigo-600 text-lg" />
              </div>
              <h3 className="text-gray-800 font-semibold ml-3">
                Project Domain
              </h3>
            </div>
            <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
              {project.domain || "Not specified"}
            </p>
          </div>

          {/* Mentor Card */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-purple-500">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaUserTie className="text-purple-600 text-lg" />
              </div>
              <h3 className="text-gray-800 font-semibold ml-3">
                Project Guide
              </h3>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-white">
                {project.mentor ? project.mentor.charAt(0).toUpperCase() : "M"}
              </div>
              <div className="ml-3">
                <p className="text-gray-800 font-medium">
                  {project.mentor || "No mentor assigned"}
                </p>
                <p className="text-gray-500 text-sm">Project Mentor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technologies Section */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FaLaptopCode className="text-indigo-600 text-xl" />
            </div>
            <h2 className="text-gray-800 font-bold text-xl ml-4">
              Technologies
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {project?.technologies?.length > 0 ? (
              project.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 shadow-sm transition-transform hover:scale-105"
                >
                  {tech}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic p-3 bg-gray-50 rounded-lg w-full">
                No technologies specified yet
              </p>
            )}
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
            <h2 className="text-gray-800 font-bold text-xl ml-4">
              Project Timeline
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-purple-50 transition-colors duration-300">
              <p className="text-gray-500 mb-2 font-medium">Start Date</p>
              <p className="text-gray-800 font-bold flex items-center text-lg">
                <FaCalendarAlt className="text-purple-600 mr-2" />
                {formatDate(project.startDate)}
              </p>
            </div>
            <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-indigo-50 transition-colors duration-300">
              <p className="text-gray-500 mb-2 font-medium">End Date</p>
              <p className="text-gray-800 font-bold flex items-center text-lg">
                <FaCalendarCheck className="text-indigo-600 mr-2" />
                {formatDate(project.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Github Card */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FaGithub className="text-indigo-600 text-xl" />
            </div>
            <h2 className="text-gray-800 font-bold text-xl ml-4">
              Github Repository
            </h2>
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <input
              type="text"
              value={project?.githubRepoLink || "Not available"}
              readOnly
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-300 transition-all"
            />
            <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-l-lg">
              <FaGithub className="text-white text-xl" />
            </div>
            {project.githubRepoLink && (
              <a
                href={project?.githubRepoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-r-lg"
              >
                <BsArrowRightCircleFill className="text-indigo-600 text-xl" />
              </a>
            )}
          </div>
        </div>

        {/* Team Members Section */}

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <h2 className="text-gray-800 font-bold text-xl ml-4">
              Team Members
            </h2>
          </div>

          {project?.members?.length > 0 ? (
            <div className="space-y-4 mt-2">
              {project.members.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-center bg-white px-3 py-2 rounded-lg">
                          <div className="w-24 text-sm text-gray-500 font-medium">
                            College ID:
                          </div>
                          <div className="text-gray-800 font-medium">
                            {member.id || "-"}
                          </div>
                        </div>
                        <div className="flex items-center bg-white px-3 py-2 rounded-lg">
                          <div className="w-24 text-sm text-gray-500 font-medium">
                            Batch:
                          </div>
                          <div className="text-gray-800 font-medium">
                            {member.batch || "-"}
                          </div>
                        </div>
                        <div className="flex items-center bg-white px-3 py-2 rounded-lg">
                          <div className="w-24 text-sm text-gray-500 font-medium">
                            Department:
                          </div>
                          <div className="text-gray-800 font-medium">
                            {member.department || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 text-center">
              <p className="text-gray-500 italic mb-2">
                No team members assigned to this project
              </p>
              <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-medium hover:bg-indigo-200 transition-colors">
                + Add Team Members
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[500px] space-y-6 shadow-2xl">
            <div className="flex items-center">
              {actionType === "Reject" ? (
                <FaTimes className="text-[#EF4444] text-xl mr-3" />
              ) : (
                <FaHistory className="text-[#F59E0B] text-xl mr-3" />
              )}
              <h3 className="text-xl font-semibold text-[#170F49]">
                {actionType === "Reject"
                  ? "Reject Project"
                  : "Request Revision"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6F6C90] mb-2">
                {actionType === "Reject"
                  ? "Please provide a reason for rejection"
                  : "Please provide details for revision"}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Enter your ${
                  actionType === "Reject" ? "Rejection" : "Revision"
                } comments...`}
                className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex justify-end gap-x-4 pt-2">
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-5 py-2.5 text-[#6F6C90] hover:bg-gray-100 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAction}
                className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all ${
                  actionType === "Reject"
                    ? "bg-[#EF4444] hover:bg-[#DC2626]"
                    : "bg-[#F59E0B] hover:bg-[#D97706]"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectApprovalPage;