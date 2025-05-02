import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../components/comman/IconBtn";
import ProjectSection from "../../components/core/Project/StudentDashboard/ProjectSection";
import { fetchAllProjects } from "../../services/operations/projectAPI";
import { FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";
import Loader from "../../components/comman/Loader";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState("SGP");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState({
    approvedProjects: [],
    pendingProjects: [],
    rejectedProjects: [],
    revisedProjects: []
  });
  const [showAllStates, setShowAllStates] = useState({
    approved: false,
    pending: false,
    rejected: false,
    revisional: false
  });
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { projectInProgress } = useSelector((state) => state.project);

  // Fetch all projects on component mount
  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        const projectList = await fetchAllProjects(token);
        console.log("Fetched Projects:", projectList);
        
        const {
          approvedProjects = [],
          rejectedProjects = [],
          pendingProjects = [],
          revisionalProjects = [],
        } = projectList;

        const allProjects = [
          ...approvedProjects,
          ...rejectedProjects,
          ...pendingProjects,
          ...revisionalProjects,
        ];

        setProjects(allProjects);
        
        // Automatically filter SGP projects on initial load
        filterProjectsByType(allProjects, "SGP");
      } catch (error) {
        console.error(error);
        setProjects([]);
      }
      setLoading(false);
    };

    getProjects();
  }, [token]);

  // Filter function with improved type checking
  const filterProjectsByType = (projectsList, type) => {
    const filtered = projectsList.filter(
      (project) => project.projectDetails?.type === type
    );

    setFilteredProjects({
      approvedProjects: filtered.filter(
        (project) => project.projectDetails.approvalStatus === "Approved"
      ),
      pendingProjects: filtered.filter(
        (project) => project.projectDetails.approvalStatus === "Pending"
      ),
      rejectedProjects: filtered.filter(
        (project) => project.projectDetails.approvalStatus === "Rejected"
      ),
      revisedProjects: filtered.filter(
        (project) => project.projectDetails.approvalStatus === "Revision"
      )
    });
  };

  const handleFilterChange = (type) => {
    setLoading(true);
    setActiveBtn(type);
    filterProjectsByType(projects, type);
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-y-12">
      {/** Header buttons SGP, Open Project and Add Project buttons */}
      <div className="flex justify-between items-center h-19">
        <div className="flex gap-x-4">
          {/* SGP button */}
          <IconBtn
            text="SGP"
            customClasses="w-[12rem] text-center border rounded-xl transition-all duration-200 ease-in-out"
            activeBtn={activeBtn}
            onClick={() => handleFilterChange("SGP")}
          />
          {/* Open Project button */}
          <IconBtn
            text="Other Project"
            customClasses="w-[12rem] text-center border rounded-xl transition-all duration-200 ease-in-out"
            activeBtn={activeBtn}
            onClick={() => handleFilterChange("Other Project")}
          />
        </div>

        {/* Add Project */}
        <div className="relative">
          <IconBtn
            onClick={() => navigate("/student/add-project")}
            customClasses="h-12 border rounded-md px-8 bg-[#4a3aff] font-poppins"
            type="addProject"
          >
            + Add Project
          </IconBtn>
          {projectInProgress && (
            <FaExclamationTriangle
              className="absolute top-0 right-0 -translate-x-1  -translate-y-0 text-yellow-300 animate-pulse w-6 h-auto"
              title="Project creation is incomplete"
            />
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="p-2 bg-[#F7F7FD]">
          <ProjectSection
            title="Pending Projects"
            projects={filteredProjects.pendingProjects}
            showAll={showAllStates.pending}
            setShowAll={(value) => setShowAllStates(prev => ({...prev, pending: value}))}
            bgColor="bg-[#f7f6ba]"
          />
          <ProjectSection
            title="Approved Projects"
            projects={filteredProjects.approvedProjects}
            showAll={showAllStates.approved}
            setShowAll={(value) => setShowAllStates(prev => ({...prev, approved: value}))}
            bgColor="bg-[#c9c4ff]"
          />
          <ProjectSection
            title="Rejected Projects"
            projects={filteredProjects.rejectedProjects}
            showAll={showAllStates.rejected}
            setShowAll={(value) => setShowAllStates(prev => ({...prev, rejected: value}))}
            bgColor="bg-[#e4bcbc]"
          />
          <ProjectSection
            title="Revisional Projects"
            projects={filteredProjects.revisedProjects}
            showAll={showAllStates.revisional}
            setShowAll={(value) => setShowAllStates(prev => ({...prev, revisional: value}))}
            bgColor="bg-[#e4bcbc]"
          />
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;