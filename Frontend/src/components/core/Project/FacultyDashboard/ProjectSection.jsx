import {  useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import NoDataAvailable from "../../../../assets/NoDataFound/empty-folder.png"

const CARDS_PER_ROW = 2;
const INITIAL_ROWS = 1;

const ProjectSection = ({ title, projects, showAll, setShowAll, bgColor }) => {

  const navigate = useNavigate()

  
  const visibleProjects = showAll ? projects : projects.slice(0, CARDS_PER_ROW * INITIAL_ROWS);

  const hasMore = projects.length > CARDS_PER_ROW * INITIAL_ROWS;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#170F49]">{title}</h2>
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

      {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 */}
      <div className="flex flex-wrap gap-x-4 gap-y-4">
        {visibleProjects.length > 0 ? (
          title === "Pending Requests" || "Revisional Request" ? (
            visibleProjects.map((project, index) => (
              <div
                key={project.projectId}
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/faculty/project-details/${project.projectId}`)
                }
              >
                <ProjectCard project={project} />
              </div>
            ))
          ) : (
            visibleProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))
          )
        ) : (
          <img
            src={NoDataAvailable}
            alt="No Pending Requestes"
            width={80}
            className=" mx-auto"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectSection;
