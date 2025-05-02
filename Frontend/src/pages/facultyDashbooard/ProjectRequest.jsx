import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/comman/Loader';
import ProjectSection from '../../components/core/Project/FacultyDashboard/ProjectSection';
import {
  fetchSGPProjects,
  fetchOTHERProjects,
} from "../../services/operations/facultyAPI";


const ProjectsRequest = () => {

  const {semester, academicYear} = useParams();
  const {token} = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [approvedProjects, setApprovedProjects] = useState([])
  const [pendingProjects, setPendingProjects] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);
  const [revisionalProjects, setRevisionalProjects] = useState([]);
  const [showAllApproved, setShowAllApproved] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);
  const [showAllRejected, setShowAllRejected] = useState(false);
  const [showAllRevisional, setShowAllRevisional] = useState([]);
  const {projectType}  = useParams();


    {/**fetch the projects based on the proect type */}
    useEffect(() => {

      if(projectType === 'sgp'){

        const getSGPProjects = async () => {
          setLoading(true);
          try {
            const sgpProjects = await fetchSGPProjects(
              semester,
              academicYear,
              token
            );

            console.log(sgpProjects);
            

            if (!sgpProjects.success) {
              throw new Error("faild to fetch sgpProjects");
            }
            setApprovedProjects(sgpProjects.approved || []);
            setPendingProjects(sgpProjects.pending || []);
            setRejectedProjects(sgpProjects.rejected || []);
            setRevisionalProjects(sgpProjects.revision || []);
          } catch (error) {
            toast.error(error.message);
          }
          setLoading(false);
        };
        getSGPProjects();

      } else if(projectType === 'open-project'){

        const getOTHERProjects = async () => {
          setLoading(true);
          try {
            const Projects = await fetchOTHERProjects(token);

            if (!Projects.success) {
              throw new Error("faild to fetch sgpProjects");
            }
            setApprovedProjects(Projects.approved || []);
            setPendingProjects(Projects.pending || []);
            setRejectedProjects(Projects.rejected || []);
          } catch (error) {
            toast.error(error.message);
          }
          setLoading(false);
        };

        getOTHERProjects();
      }
      
    }, [semester, academicYear, token]);



  
  
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6 bg-[#F7F7FD] mt-4">
          <ProjectSection
            title="Revisional Request"
            projects={revisionalProjects}
            showAll={showAllRevisional}
            setShowAll={setShowAllRevisional}
            bgColor="bg-[#f7f6ba]"
          />

          <ProjectSection
            title="Pending Requests"
            projects={pendingProjects}
            showAll={showAllPending}
            setShowAll={setShowAllPending}
            bgColor="bg-[#f7f6ba]"
          />
          
          <ProjectSection
            title="Approved Requests"
            projects={approvedProjects}
            showAll={showAllApproved}
            setShowAll={setShowAllApproved}
            bgColor="bg-[#c9c4ff]"
          />

          <ProjectSection
            title="Rejected Requests"
            projects={rejectedProjects}
            showAll={showAllRejected}
            setShowAll={setShowAllRejected}
            bgColor="bg-[#e4bcbc]"
          />
        </div>
      )}
    </>
  );
}

export default ProjectsRequest;
