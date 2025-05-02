import React from "react";
import {
  X,
  Calendar,
  BookOpenCheck,
  User,
  GraduationCap,
  CalendarIcon,
  Github,
  Clock,
} from "lucide-react";

const ProjectDetailsModal = ({ project, onClose }) => {
  const { approvalStatus, title, domain, description } = project.projectDetails;
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative animate-fadeIn">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <h3 className="text-2xl font-bold text-[#170F49]">
              Project Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-[#6F6C90]" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-70px)] p-6 pb-0">
          {/* Project header with status */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#170F49] mr-2">{title}</h2>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
          </div>

          {/* Top info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#F9F9FC] rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-[#F4F3FF] rounded-lg mr-3">
                  <BookOpenCheck className="w-5 h-5 text-[#6B4EFF]" />
                </div>
                <h4 className="font-semibold text-[#170F49]">Domain</h4>
              </div>
              <p className="text-[#6F6C90] font-semibold">{domain}</p>
            </div>

            <div className="bg-[#F9F9FC] rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-[#F4F3FF] rounded-lg mr-3">
                  <User className="w-5 h-5 text-[#6B4EFF]" />
                </div>
                <h4 className="font-semibold text-[#170F49]">Guide</h4>
              </div>
              <p className="text-[#6F6C90] font-semibold">
                {project.groupDetails.mentor}
              </p>
            </div>

            <div className="bg-[#F9F9FC] rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-[#F4F3FF] rounded-lg mr-3">
                  <GraduationCap className="w-5 h-5 text-[#6B4EFF]" />
                </div>
                <h4 className="font-semibold text-[#170F49]">Semester</h4>
              </div>
              <p className="text-[#6F6C90] font-semibold">
                {project.groupDetails.semester}
              </p>
            </div>
          </div>

          {/* Project Description */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-[#170F49] mb-4">
              Project Description
            </h4>
            <div className="bg-[#F9F9FC] rounded-xl p-5">
              <p className="text-[#170F49] whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-[#170F49] mb-4">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.projectDetails.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#F4F3FF] text-[#6B4EFF] rounded-full text-sm font-semibold"
                >
                  {tech}
                </span>
              )) || (
                <>
                  <span className="px-4 py-2 bg-[#F4F3FF] text-[#6B4EFF] rounded-full text-sm font-semibold">
                    MongoDB
                  </span>
                  <span className="px-4 py-2 bg-[#F4F3FF] text-[#6B4EFF] rounded-full text-sm font-semibold">
                    React
                  </span>
                  <span className="px-4 py-2 bg-[#F4F3FF] text-[#6B4EFF] rounded-full text-sm font-semibold">
                    Node.js
                  </span>
                  <span className="px-4 py-2 bg-[#F4F3FF] text-[#6B4EFF] rounded-full text-sm font-semibold">
                    Express
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-[#170F49] mb-4">
              Timeline
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F9F9FC] rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="w-5 h-5 text-[#6B4EFF] mr-2" />
                  <h5 className="font-semibold text-[#170F49]">Start Date</h5>
                </div>
                <p className="text-[#6F6C90]">
                  {project.projectDetails.startDate.split("T")[0] || "N/A"}
                </p>
              </div>

              <div className="bg-[#F9F9FC] rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="w-5 h-5 text-[#6B4EFF] mr-2" />
                  <h5 className="font-semibold text-[#170F49]">End Date</h5>
                </div>
                <p className="text-[#6F6C90]">
                  {project.projectDetails.endDate.split("T")[0] || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-[#170F49] mb-4">
              Team Members
            </h4>
            <div className="bg-[#eaeaff] rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.groupDetails.members.map((member, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#6B4EFF] rounded-full flex items-center justify-center text-white font-bold">
                      {member.name ? member.name.charAt(0) : `${member.batch}`}
                    </div>
                    <div>
                      <p className="font-semibold text-[#170F49]">
                        {member.name || `Member ${index + 1}`}
                        {member.isLeader && (
                          <span className="ml-2 px-2 py-1 bg-[#FFE9E3] text-[#FF5630] rounded-full text-xs">
                            Leader
                          </span>
                        )}
                      </p>
                      <p className="text-sm font-semibold text-[#6F6C90]">
                        {member.studentId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GitHub Link */}
          {project.projectDetails.githubRepoLink && (
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-[#170F49] mb-4">
                Repository
              </h4>
              <a
                href={project.projectDetails.githubRepoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#F9F9FC] rounded-xl p-4 hover:bg-[#F4F3FF] transition-colors"
              >
                <Github className="w-5 h-5 text-[#6B4EFF]" />
                <span className="text-[#6B4EFF] font-medium truncate">
                  {project.projectDetails.githubRepoLink}
                </span>
              </a>
            </div>
          )}

          {/* Academic Details */}
          <div className="mb-10">
            <h4 className="text-xl font-semibold text-[#170F49] mb-4">
              Academic Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F9F9FC] rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-[#6B4EFF] mr-2" />
                  <h5 className="font-semibold text-[#170F49]">
                    Academic Year
                  </h5>
                </div>
                <p className="text-[#6F6C90]">
                  {project.groupDetails.academicYear}
                </p>
              </div>

              <div className="bg-[#F9F9FC] rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-[#6B4EFF] mr-2" />
                  <h5 className="font-semibold text-[#170F49]">
                    Submission Status
                  </h5>
                </div>
                <p className="text-[#6F6C90]">{approvalStatus}</p>
              </div>
            </div>
          </div>

          {/* Modal footer with actions */}
          <div className="sticky bottom-0  bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-[#6B4EFF] text-[#6B4EFF] hover:bg-[#F4F3FF] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
