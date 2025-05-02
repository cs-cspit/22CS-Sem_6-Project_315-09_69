import { useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import emptyFolder from "../../../../assets/NoDataFound/empty-folder.png";
import { useState } from "react";

const CARDS_PER_ROW = 2;
const INITIAL_ROWS = 1;

const ProjectSection = ({
  title,
  projects: initialProjects,
  showAll,
  setShowAll,
  bgColor,
}) => {
  const [projects, setProjects] = useState(initialProjects);
  const navigate = useNavigate();
  const visibleProjects = showAll
    ? projects
    : projects.slice(0, CARDS_PER_ROW * INITIAL_ROWS);
  const hasMore = projects.length > CARDS_PER_ROW * INITIAL_ROWS;

  const handleProjectClick = (project) => {
    if (
      project.projectDetails.approvalStatus === "Approved" &&
      project.projectDetails.type === "SGP"
    ) {
      navigate(`/student/weekly-reports/${project.projectDetails.projectId}`);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    // Update the projects array with the updated project
    const updatedProjects = projects.map((project) =>
      project.projectDetails.projectId ===
      updatedProject.projectDetails.projectId
        ? updatedProject
        : project
    );
    setProjects(updatedProjects);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#2e1a4d]">{title}</h2>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-[#170F49] hover:text-[#6F6C99]"
          >
            {showAll ? "Show Less" : "View All"}
            {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-4">
        {visibleProjects.length > 0 ? (
          visibleProjects.map((project) => (
            <div
              key={project.projectDetails.projectId}
              className="cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <ProjectCard
                project={project}
                onProjectUpdate={handleProjectUpdate}
              />
            </div>
          ))
        ) : (
          <img
            src={emptyFolder}
            alt="No Data Found"
            className="mx-auto w-20 h-auto"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectSection;
