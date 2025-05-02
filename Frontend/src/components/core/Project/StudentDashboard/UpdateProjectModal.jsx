import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  X,
  Github,
  LayoutDashboard,
  Code,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  fetchAllDomains,
  fetchAllTechnology,
} from "../../../../services/operations/projectAPI";
import { updateRevisionalProject } from "../../../../services/operations/projectAPI";

const UpdateProjectModal = ({ project, onClose, onUpdateSuccess }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [formData, setFormData] = useState({
    title: project.projectDetails.title || "",
    domain: project.projectDetails.domain || "",
    description: project.projectDetails.description || "",
    githubRepoLink: project.projectDetails.githubRepoLink || "",
    technologies: project.projectDetails.technologies || [],
  });

  // Fetch domains when component mounts
  useEffect(() => {
    const loadDomains = async () => {
      try {
        const domainsData = await fetchAllDomains(token);
        setDomains(domainsData);
      } catch (error) {
        console.error("Error loading domains:", error);
        toast.error("Failed to load domains");
      }
    };
    loadDomains();
  }, [token]);

  // Fetch technologies when domain changes
  useEffect(() => {
    const loadTechnologies = async () => {
      if (!formData.domain) return;

      try {
        const techData = await fetchAllTechnology(formData.domain, token);
        setTechnologies(techData);
      } catch (error) {
        console.error("Error loading technologies:", error);
        toast.error("Failed to load technologies");
      }
    };

    if (formData.domain) {
      loadTechnologies();
    }
  }, [formData.domain, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDomainChange = async (e) => {
    const domain = e.target.value;
    setFormData({
      ...formData,
      domain,
      technologies: [], // Reset technologies when domain changes
    });
  };

  const handleTechnologyChange = (e) => {
    const { value, checked } = e.target;
    const tech = JSON.parse(value);

    if (checked) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, tech],
      });
    } else {
      setFormData({
        ...formData,
        technologies: formData.technologies.filter((t) => t.name !== tech.name),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedProject = await updateRevisionalProject(
        project.projectDetails.projectId,
        formData,
        token
      );

      toast.success("Project updated successfully");

      // Call the onUpdateSuccess callback with the updated project data
      if (onUpdateSuccess && updatedProject) {
        onUpdateSuccess(updatedProject);
      }

      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(error?.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-[#FFFFFF] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F7F7FB]">
        <div className="sticky top-0 z-10 bg-[#F7F7FB] p-6 border-b border-[#C9C4FF] flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C9C4FF] rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-[#4A3AFF]" />
            </div>
            <h2 className="text-xl font-bold text-[#170F49]">
              Update Project Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#C9C4FF] transition-all duration-200 text-[#170F49]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-[#FFFFFF]">
          {/* Quick Info Card */}
          <div className="bg-[#F7F7FB] rounded-lg p-4 border border-[#C9C4FF] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#4A3AFF] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#170F49]">
              Your project requires revision. Please update the necessary
              details and resubmit for approval.
            </p>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-[#170F49] mb-2">
              Project Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 border border-[#C9C4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent text-[#170F49] bg-[#F7F7FB]"
                placeholder="Enter project title"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LayoutDashboard className="w-5 h-5 text-[#4A3AFF]" />
              </div>
            </div>
          </div>

          {/* Domain Selection */}
          <div>
            <label className="block text-sm font-medium text-[#170F49] mb-2">
              Domain
            </label>
            <div className="relative">
              <select
                name="domain"
                value={formData.domain}
                onChange={handleDomainChange}
                className="w-full pl-10 pr-3 py-3 border border-[#C9C4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] appearance-none bg-[#F7F7FB] text-[#170F49]"
                required
              >
                <option value="">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Code className="w-5 h-5 text-[#4A3AFF]" />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-[#4A3AFF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Technologies */}
          {formData.domain && (
            <div className="bg-[#F7F7FB] p-5 rounded-lg border border-[#C9C4FF]">
              <label className="block text-sm font-medium text-[#170F49] mb-3">
                Technologies
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center space-x-2 bg-white p-3 rounded-md border border-[#C9C4FF] hover:border-[#4A3AFF] transition-colors duration-200 shadow-sm"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={tech.name}
                        value={JSON.stringify(tech.name)}
                        checked={formData.technologies.some(
                          (t) => t === tech.name
                        )}
                        onChange={handleTechnologyChange}
                        className="h-4 w-4 text-[#4A3AFF] focus:ring-[#4A3AFF] border-[#C9C4FF] rounded opacity-0 absolute"
                      />
                      <div
                        className={`w-5 h-5 border ${
                          formData.technologies.some((t) => t === tech.name)
                            ? "bg-[#4A3AFF] border-[#4A3AFF]"
                            : "border-[#A0A3BD] bg-white"
                        } rounded flex items-center justify-center transition-colors duration-200`}
                      >
                        {formData.technologies.some((t) => t === tech.name) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <label
                      htmlFor={tech.name}
                      className="text-sm text-[#170F49] cursor-pointer flex-1"
                    >
                      <span className="font-medium">{tech.name}</span>
                      <span className="text-xs text-[#A0A3BD] block">
                        {tech.category}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              {technologies.length === 0 && (
                <p className="text-sm text-[#A0A3BD] italic text-center mt-3">
                  No technologies found for this domain
                </p>
              )}
            </div>
          )}

          {/* GitHub Repository Link */}
          <div>
            <label className="block text-sm font-medium text-[#170F49] mb-2">
              GitHub Repository Link
            </label>
            <div className="relative">
              <input
                type="url"
                name="githubRepoLink"
                value={formData.githubRepoLink}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 border border-[#C9C4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent text-[#170F49] bg-[#F7F7FB]"
                placeholder="https://github.com/username/repository"
                required
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Github className="w-5 h-5 text-[#4A3AFF]" />
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-[#170F49] mb-2">
              Project Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full pl-10 pr-3 py-3 border border-[#C9C4FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent text-[#170F49] bg-[#F7F7FB]"
                placeholder="Describe your project in detail..."
                required
              />
              <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                <FileText className="w-5 h-5 text-[#4A3AFF]" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-[#F7F7FB]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-[#170F49] bg-[#F7F7FB] border border-[#C9C4FF] rounded-lg hover:bg-[#C9C4FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9C4FF] mr-3 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-white bg-[#4A3AFF] border border-transparent rounded-lg hover:bg-[#170F49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3AFF] transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectModal;