import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import { projectEndPoints } from "../apis";
import { setLoading } from "../../slices/authSlice";
import { resetProjectState } from "../../slices/projectSlice";
const {
  CREATE_PROJECT_API,
  GET_ALL_DOMAINS_API,
  GET_ALL_TECHENOLOGY_API,
  GET_PRJECT_DETAILS_API,
  GET_ALL_PROJECTS_API,
  UPDATE_REJECTED_PROJECT_API,
  UPDATE_REVISIONAL_PROJECT_API,
} = projectEndPoints;


export const fetchAllDomains = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ALL_DOMAINS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success || !Array.isArray(response.data.data)) {
      throw new Error(response.data.message || "Error while fetching domains");
    }

    console.log(response);

    return response.data.data; // Ensure only the data array is returned
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const fetchAllTechnology = async (domain, token) => {
  try {
    const formattedDomain = encodeURIComponent(domain);

    const response = await apiConnector(
      "GET",
      GET_ALL_TECHENOLOGY_API + `${formattedDomain}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error while fetching technology");
    }

    return response.data.data.technologies;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export function createProject(data, token, navitage) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", CREATE_PROJECT_API, data, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Error while creating the project");
      }

      console.log(response);

      dispatch(resetProjectState());
      toast.success("Project Created Successfully");
      navitage("/student/projects");

    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export const fetchAllProjects = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_PROJECTS_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error while fetching all project");
    }

    console.log(response.data.projectList);
    return response.data.projectList;
  } catch (error) {
    console.log(error);
    
      toast.error(error.response.data.message);
  }
};

export const fetchProjectDetails = async (projectId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_PRJECT_DETAILS_API}/${projectId}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error while creating the project");
    }

    return response.data.projectData;
  } catch (error) {
    toast.error(error.response.data.message)
  }
};

export const updateRejectedProject = async (
  projectId,
  data,
  token,
  navigate
) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${UPDATE_REJECTED_PROJECT_API}/${projectId}`,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    toast.success("Project updated successfully");
    navigate("/student/projects");
    return response.data;
  } catch (error) {
    console.log("UPDATE_REJECTED_PROJECT_API ERROR............", error);
    toast.error(error.message);
    throw error;
  }
};

export const updateRevisionalProject = async (projectId, formData, token) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${UPDATE_REVISIONAL_PROJECT_API}/${projectId}`, formData, {
        Authorization : `Bearer ${token}`
      }
    );

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
}
