import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchProjectDetails } from "../../services/operations/projectAPI";
import { useParams } from "react-router-dom";
import {
  User,
  GraduationCap,
  Calendar,
  Github,
  Code,
  CheckCircle,
  Briefcase,
  Clock,
  FileText,
  Users,
} from "lucide-react";

const ProjectDetails = () => {
  const [projectData, setProjectData] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { projectId } = useParams();

  useEffect(() => {
    const getProjectDetails = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchProjectDetails(projectId, token);
        console.log("Fetched Project Data:", fetchedData);
        setProjectData(fetchedData);
      } catch (error) {
        console.log("Error fetching project details:", error);
      }
      setLoading(false);
    };

    getProjectDetails();
  }, [token, projectId]);

  console.log(projectData);
  const StatusBadge = ({ status = "Pending" }) => {
    const getStatusStyles = () => {
      switch (status.toLowerCase()) {
        case "completed":
          return "bg-green-50 text-green-700 border-green-200";
        case "in progress":
          return "bg-blue-50 text-blue-700 border-blue-200";
        case "pending":
        default:
          return "bg-amber-50 text-amber-700 border-amber-200";
      }
    };

    return (
      <div
        className={`px-4 py-1.5 rounded-full font-medium text-sm border ${getStatusStyles()}`}
      >
        {status}
      </div>
    );
  };

  const InfoCard = ({
    icon: Icon,
    label,
    value,
    bgColor = "bg-indigo-50",
    iconColor = "text-indigo-600",
  }) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`${iconColor} w-5 h-5`} />
        </div>
        <h3 className="font-medium text-gray-700">{label}</h3>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-300">
        <p className="text-lg font-semibold  text-gray-800">{value}</p>
      </div>
    </div>
  );

  // Display loader if data is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        {/* Header Section with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {projectData?.projectDetails?.title ||
                  "Project Management System"}
              </h1>
              <p className="text-indigo-100">
                {`Group ID : ${
                  projectData?.groupDetails?.groupId || "PMS-2024-001"
                }`}
              </p>
            </div>
            <StatusBadge
              status={projectData?.projectDetails?.status || "Pending"}
            />
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard
            icon={Briefcase}
            label="Domain"
            value={projectData?.projectDetails?.domain || "Web Development"}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <InfoCard
            icon={User}
            label="Guide"
            value={projectData?.groupDetails?.mentor || "Harshul Yagnik"}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <InfoCard
            icon={GraduationCap}
            label="Semester"
            value={projectData?.groupDetails?.semester}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
          />
        </div>

        {/* Project Description */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FileText className="text-indigo-600 w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Project Description
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {projectData?.projectDetails?.description ||
              "Project that manages SGP project of CHARUSAT University"}
          </p>
        </div>

        {/* Technologies */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Code className="text-indigo-600 w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Technologies
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {(
              projectData?.projectDetails?.technologies || [
                "MongoDB",
                "React",
                "Node.js",
                "Express",
              ]
            ).map((tech, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-100 transition-colors duration-300"
              >
                <Code className="w-4 h-4" />
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Group Members */}
        {(projectData?.groupDetails?.members?.length > 0 || true) && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Users className="text-indigo-600 w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Group Members
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(
                projectData?.groupDetails?.members || [
                  {
                    studentId: "22CS070",
                    name: "Member 1",
                    department: "CS",
                  },
                  {
                    studentId: "22CS069",
                    name: "Member 2",
                    department: "CS",
                  },
                ]
              ).map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 hover:border-indigo-200 hover:shadow transition-all duration-300"
                >
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <User className="text-indigo-600 w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {member.name || `Member ${index + 1}`}
                    </p>
                    <p className="text-gray-600 text-sm">{member.studentId}</p>
                    <p className="text-gray-500 text-xs">{member.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoCard
            icon={Calendar}
            label="Start Date"
            value={
              projectData?.projectDetails?.startDate?.split("T")[0] ||
              "2024-02-01"
            }
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <InfoCard
            icon={Clock}
            label="End Date"
            value={
              projectData?.projectDetails?.endDate?.split("T")[0] ||
              "2024-07-31"
            }
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
        </div>

        {/* Github Link */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Github className="text-indigo-600 w-5 h-5" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Repository</h2>
          </div>
          <a
            href={projectData?.projectDetails?.githubRepoLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-100 transition-colors duration-300"
          >
            <Github className="text-gray-700 w-5 h-5" />
            <span className="text-indigo-600 font-medium">
              {projectData?.projectDetails?.githubRepoLink ||
                "Repository link not available"}
            </span>
          </a>
        </div>

        {/* Project Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <CheckCircle className="text-indigo-600 w-5 h-5" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Project Status
              </h3>
            </div>
            <StatusBadge status="In Progress" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="mt-3 flex justify-between text-sm text-gray-600">
            <span>In Progress</span>
            <span>45% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
