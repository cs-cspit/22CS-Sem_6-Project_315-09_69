import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setStep, setUpdateMode } from "../../../../slices/projectSlice";
import ProjectDetailsModal from "./ProjectDetailsModal";
import UpdateProjectModal from "./UpdateProjectModal";

const ProjectCard = ({ project }) => {

  const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const {
    approvalStatus,
    title,
    domain,
    description,
    projectId,
    firstComment,
  } = project.projectDetails;
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
    setIsUpdateModalOpen(true)
  }

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    document.body.style.overflow = "auto";
  }

  // const handleUpdateSuccess = (updatedProject) => {
  //   window.location.reload(); 
  // };

  return (
    <>
      <div className="w-[28rem] bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="p-5">
          <div className="flex justify-between items-center">
            <h5
              className={`text-xl font-bold font-poppins truncate tracking-tight w-full ${
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
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  approvalStatus === "Approved"
                    ? "bg-[#E7F5EF] text-[#1F7B4D] ring-1 ring-[#1F7B4D]/20"
                    : approvalStatus === "Pending"
                    ? "bg-[#FFF8E7] text-[#946B00] ring-1 ring-[#946B00]/20"
                    : approvalStatus === "Revisional"
                    ? "bg-[#FFF3E0] text-[#FF9800] ring-1 ring-[#FF9800]/20"
                    : "bg-[#FFEBEB] text-[#D92D20] ring-1 ring-[#D92D20]/20"
                }`}
              >
                {approvalStatus}
              </div>

              {isRejected && (
                <button
                  onClick={onTryAgain}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 active:scale-95 whitespace-nowrap ${
                    isRejected
                      ? "bg-[#D92D20] text-white hover:bg-[#C01E1E]"
                      : "bg-[#FF9800] text-white hover:bg-[#F57C00]"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Try Again</span>
                </button>
              )}
              {(needsRevision && !project.isRevisionalResubmitted) && (
                <button
                  onClick={() => openUpdateModal()}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF9800] text-white hover:bg-[#F57C00] transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Resubmit</span>
                </button>
              )}
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
                <p className="text-sm text-[#170F49] font-semibold">
                  {project.groupDetails.mentor}
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
                  {project.groupDetails.semester}
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
                  {project.groupDetails.academicYear}
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
                  {project.groupDetails.members.length}
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
                  {project.groupDetails.members.find(
                    (member) => member.studentId === user.studentId
                  )?.isLeader
                    ? "Leader"
                    : "Member"}
                </p>
              </div>
            </div>
          </div>

          {hasComments && (isRejected || needsRevision) && (
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
        <ProjectDetailsModal project={project} onClose={closeModal} />
      )}

      {isUpdateModalOpen && (
        <UpdateProjectModal
          project={project}
          onClose={closeUpdateModal}
          // onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default ProjectCard;
