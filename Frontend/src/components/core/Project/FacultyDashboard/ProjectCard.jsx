import React from "react";

// Faculty dashboard side project card
const ProjectCard = ({ project }) => {
  // Check if this is a resubmitted revisional project
  const isResubmitted =
    project?.approvalStatus === "Revision" && project?.isRevisionalResubmitted;

  return (
    <div className="bg-white w-[28rem] h-[10rem] rounded-2xl shadow-xl p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-2xl font-semibold font-poppins text-[#170F49] line-clamp-1">
            {project?.title}
          </h3>
          <div className="flex gap-x-1 text-xs font-poppins text-black">
            By.
            {project?.members?.map((member, index) => (
              <p key={index}>
                {member.id}
                {index < project.members.length - 1 ? "," : ""}
              </p>
            ))}
          </div>
        </div>
        <div
          className={`px-3 py-[5px] rounded-lg text-sm flex gap-x-2 items-center font-medium ${
            project?.approvalStatus === "Approved"
              ? "bg-[#c9c4ff] text-[#191515]"
              : project?.approvalStatus === "Pending"
              ? "bg-[#f7f6ba] text-[#191515]"
              : project?.approvalStatus === "Revision" && isResubmitted
              ? "bg-[#e4bcbc] text-[#191515] "
              : "bg-[#e4bcbc] text-[#191515]"
          }`}
        >
          {project?.approvalStatus}
          {isResubmitted && (
            <span className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          )}
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#a0a3bd] mt-1"></div>
      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <h3 className="text-sm font-semibold font-poppins text-[#424242]">
            Domain
          </h3>
          <p className="text-[#424242] font-poppins text-sm">
            {project.domain}
          </p>
        </div>
        <div className="grid grid-cols-[120px,1fr] items-center">
          <h3 className="text-sm font-semibold font-poppins text-[#424242]">
            Technologies:
          </h3>
          <div className="flex flex-wrap bg-white w-full max-h-8 font-poppins overflow-y-scroll">
            {project?.technologies?.map((tech, index) => (
              <div
                key={index}
                className="flex items-center rounded-2xl bg-[#c9c4ff] text-black text-xs m-1 px-2 py-1"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
