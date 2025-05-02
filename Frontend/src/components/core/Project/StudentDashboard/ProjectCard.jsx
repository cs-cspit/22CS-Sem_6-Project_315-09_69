import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Tooltip} from 'react-tooltip';
import {
  RefreshCw,
  User,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  X,
  Github,
  Eye,
  Clock,
  Calendar as CalendarIcon,
  Info,
  BookOpenCheck,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setStep, setUpdateMode } from "../../../../slices/projectSlice";
import ProjectDetailsModal from "./ProjectDetailsModal";
import UpdateProjectModal from "./UpdateProjectModal";

const ProjectCard = ({ project, onProjectUpdate }) => {
  const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] =
    useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [localProject, setLocalProject] = useState(project);
  const { user } = useSelector((state) => state.profile);
  const {
    approvalStatus,
    title,
    domain,
    description,
    projectId,
    firstComment,
    isRevisionalResubmitted,
  } = localProject.projectDetails;
  console.log(project);
  
  const isRejected = approvalStatus === "Rejected";
  const needsRevision = approvalStatus === "Revision";
  const isPending = approvalStatus === "Pending";
  const hasComments = firstComment?.comment;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onTryAgain = () => {
    dispatch(setStep(2));
    dispatch(setUpdateMode({ isUpdateMode: true, projectId }));
    navigate("/student/add-project", {
      state: {
        projectData: {
          title,
          domain,
          description,
          isRetry: true,
          projectId,
        },
      },
    });
  };

  const openModal = () => {
    setIsProjectDetailsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsProjectDetailsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleUpdateSuccess = (updatedProject) => {
    
    // Update the local state with updated project
    const updatedLocalProject = {
      ...localProject,
      projectDetails: {
        ...localProject.projectDetails,
        ...updatedProject,
        isRevisionalResubmitted: true,
      },
    };

    setLocalProject(updatedLocalProject);

    // Notify parent component if callback exists
    if (onProjectUpdate) {
      onProjectUpdate(updatedLocalProject);
    }
  };

  return (
    <>
      <div className="w-[28rem] bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-5">
          <div className="flex justify-between items-center">
  <h5
    data-tooltip-id="status-tooltip"
    data-tooltip-content={title}
    data-tooltip-place="bottom-start" // Aligns tooltip towards the left and downward
    className={`text-xl font-bold font-poppins truncate tracking-tight w-full cursor-pointer${
      approvalStatus === "Approved"
        ? "text-[#1F7B4D]"
        : approvalStatus === "Pending"
        ? "text-[#413005]"
        : approvalStatus === "Revision"
        ? "text-[#FF9800]"
        : "text-[#D92D20]"
    }`}
  >
    {title}
  </h5>

  {/* Tooltip Component */}
  <Tooltip
    id="status-tooltip"
    effect="solid"
    className="small-light-tooltip"
  />

  {/* Custom Tooltip Styling */}
  <style>
    {`
      .small-light-tooltip {
        background-color: rgba(255, 255, 255, 0.4) !important; /* Light Background */
        color: #333 !important; /* Soft Dark Text */
        font-size: 10px !important; /* Very Small Font */
        padding: 4px 8px !important; /* Small Padding */
        border-radius: 5px !important; /* Rounded Edges */
        border: 1px solid rgba(0, 0, 0, 0.1) !important; /* Subtle Border */
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15) !important; /* Light Shadow */
      }

      /* Ensuring Left-Down Position */
      .small-light-tooltip[data-popper-placement^="left"] {
        transform: translate(-10px, 10px) !important; /* Moves tooltip slightly down */
      }
    `}
  </style>

    
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  approvalStatus === "Approved"
                    ? "bg-[#E7F5EF] text-[#1F7B4D] ring-1 ring-[#1F7B4D]/20"
                    : approvalStatus === "Pending"
                    ? "bg-[#FFF8E7] text-[#946B00] ring-1 ring-[#946B00]/20"
                    : approvalStatus === "Revision"
                    ? "bg-[#FFF3E0] text-[#FF9800] ring-1 ring-[#FF9800]/20"
                    : "bg-[#FFEBEB] text-[#D92D20] ring-1 ring-[#D92D20]/20"
                }`}
              >
                {approvalStatus}
              </div>

              {isRejected && (
                <button
                  onClick={onTryAgain}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D92D20] text-white hover:bg-[#C01E1E] transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Try Again</span>
                </button>
              )}

              {/* Modified section for revision status */}
              {needsRevision &&
                (isRevisionalResubmitted ? (
                  <button
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F7B4D] text-white cursor-default"
                    disabled
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Submitted</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openUpdateModal()}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF9800] text-white hover:bg-[#F57C00] transition-all duration-200 active:scale-95 whitespace-nowrap"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">Resubmit</span>
                  </button>
                ))}

              {isPending && (
                <button
                  onClick={openModal}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6B4EFF] text-white hover:bg-[#5A3FE0] transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Details</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F3FF] rounded-lg">
                <BookOpen className="w-5 h-5 text-[#6B4EFF]" />
              </div>
              <div>
                <p className="text-sm text-[#6F6C90]">Domain</p>
                <p className="text-sm text-[#170F49] font-semibold">{domain}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F3FF] rounded-lg">
                <User className="w-5 h-5 text-[#6B4EFF]" />
              </div>
              <div>
              <p className="text-sm text-[#6F6C90]">Guide</p>
              <p
                className="text-sm text-[#170F49] font-semibold line-clamp-1 cursor-pointer"
              >
                {localProject.groupDetails.mentor}
              </p>
            </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F3FF] rounded-lg">
                <GraduationCap className="w-5 h-5 text-[#6B4EFF]" />
              </div>
              <div>
                <p className="text-sm text-[#6F6C90]">Semester</p>
                <p className="text-sm text-[#170F49] font-semibold">
                  {localProject.groupDetails.semester}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F3FF] rounded-lg">
                <Calendar className="w-5 h-5 text-[#6B4EFF]" />
              </div>
              <div>
                <p className="text-sm text-[#6F6C90]">Academic Year</p>
                <p className="text-sm text-[#170F49] font-semibold">
                  {localProject.groupDetails.academicYear}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F3FF] rounded-lg">
                <Users className="w-5 h-5 text-[#6B4EFF]" />
              </div>
              <div>
                <p className="text-sm text-[#6F6C90]">Team Members</p>
                <p className="text-sm text-[#170F49] font-semibold">
                  {localProject.groupDetails.members.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F4F3FF] rounded-lg">
                <User className="w-5 h-5 text-[#6B4EFF]" />
              </div>
              <div>
                <p className="text-sm text-[#6F6C90]">Your Role</p>
                <p className="text-sm text-[#170F49] font-semibold">
                  {localProject.groupDetails.members.find(
                    (member) => member.studentId === user.studentId
                  )?.isLeader
                    ? "Leader"
                    : "Member"}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback section with conditional resubmitted message */}
          {needsRevision && isRevisionalResubmitted && (
            <div className="mt-4 p-3 bg-[#F4F9F6] border border-[#1F7B4D]/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#1F7B4D]" />
                <span className="text-sm font-medium text-[#1F7B4D]">
                  Project Resubmitted
                </span>
              </div>
              <p className="text-sm mt-1 text-[#1F7B4D]/80">
                Your revised project has been submitted. Please wait for mentor
                review.
              </p>
            </div>
          )}

          {hasComments &&
            (isRejected || (needsRevision && !isRevisionalResubmitted)) && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#6B4EFF]" />
                  <span className="text-sm font-medium">Feedback</span>
                </div>
                <p className="text-sm mt-2 text-[#170F49]">
                  {firstComment.comment}
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Detailed Modal */}
      {isProjectDetailsModalOpen && (
        <ProjectDetailsModal project={localProject} onClose={closeModal} />
      )}

      {isUpdateModalOpen && (
        <UpdateProjectModal
          project={localProject}
          onClose={closeUpdateModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default ProjectCard;
