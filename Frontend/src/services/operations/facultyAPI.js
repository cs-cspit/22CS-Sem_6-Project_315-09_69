import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { facultyEndPoints } from "../apis";

const {
  ALL_FACULTY_API,
  GET_ACADEMIC_YEARS_API,
  GET_SGP_PROJECT_REQUESTS,
  GET_PROJECT_DETAILS_API,
  PROJECT_APPROVAL_API,
  GET_OTHER_PROJECT_REQUESTS,
  GET_WEEKLYREPORTS_SUBMISSIONS_API,
  GET_FACULTY_PROFILE_API,
  UPDATE_FACULTY_PROFILE_API,
  CREATE_RUBRICS_API,
  CHECK_RUBRIC_EXIST
} = facultyEndPoints;

export const fetchAllFaculties = async () => {
    let result = []
    try {
        const response = await apiConnector('GET', ALL_FACULTY_API);

        if(!response.data.success){
            throw new Error(response.data.message || "Error while fetching all the faculty");
        }
        console.log(response.data);
        
        result = response.data.allFaculties;
    } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);   
    }
    return result
}

export const fetchAcademicYears = async () => {
  try {
    const response = await apiConnector('GET',GET_ACADEMIC_YEARS_API);

    if(!response.data.success){
      throw new Error(response.data.message);
    }
    console.log(response);
    
    return response.data.academicYears;
  } catch (error) {
    toast.error(error.response.data.message)
  }
}

export const fetchSGPProjects = async (semester, academicYear, token) => {
  try {
    const response = await apiConnector('GET',`${GET_SGP_PROJECT_REQUESTS}semester=${semester}&academicYear=${academicYear}`,null,{
          Authorization: `Bearer ${token}`,
      })

      if(!response.data.success){
        throw new Error(response.data.error);
      }
      console.log(response);
      return response.data
  } catch (error) {
    toast.error(error.response.data.message)
  }
}

export const fetchOTHERProjects = async (token) => {
  try {
    const response = await apiConnector("GET",`${GET_OTHER_PROJECT_REQUESTS}`,{},{
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    console.log(response);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const fetchProjectDetails = async (projectId,token) => { 
  try {
    const response = await apiConnector('GET',`${GET_PROJECT_DETAILS_API}/${projectId}`,{},{
      Authorization : `Bearer ${token}`
    })

    if(!response.data.success){
      throw new Error(response.data.message);     
    }

    return response.data.project
    
  } catch (error) {
    console.log(error.message);
    toast.error(error.response.data.message)
  }
}

export const projectApproval = async (status, projectId, navData, comment, token, navigate) => {

  try {
    const response = await apiConnector('PATCH',`${PROJECT_APPROVAL_API}/${projectId}`,{status,comment},{
      Authorization : `Bearer ${token}`
    })

    if(!response.data.success){
      throw new Error(response.data.message);
    }
    
    toast.success(response.data.message);
    navigate(`/faculty/${navData.projectType}/approval-requests/${navData.semester}/${navData.academicYear}`);
    return response.data.success;
  } catch (error) {
    toast.error(error.response.data.message);
  }
}

export const fetchWeeklyReportSubmissions = async (token,semester,academicYear) => {

  console.log(token, academicYear, semester);
  
  try {
    const response = await apiConnector('GET',`${GET_WEEKLYREPORTS_SUBMISSIONS_API}?semester=${semester}&academicYear=${academicYear}`,{},{
      Authorization : `Bearer ${token}`
    })

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    console.log(response);
    return response.data.submissions;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
  }
}

export const fetchFacultyProfile = async (token) => {
  try {
    const response = await apiConnector('GET',GET_FACULTY_PROFILE_API,{},{
      Authorization : `Bearer ${token}`
    })

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    console.log(response);
    return response.data.faculty;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
  }
}

export const updateFacultyProfile = async (formDataToSend, token) => {
  try {
    const response = await apiConnector('PATCH',UPDATE_FACULTY_PROFILE_API,formDataToSend,{
      Authorization : `Bearer ${token}`
    })

    if(!response.data.success){
      throw new Error(response.data.message);
    }
    console.log(response.data.faculty);
    
    toast.success("Profile Updated Successfully")
    return response.data.faculty;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message); 
  }
}

export const createRubics = async (rubricsdata, token) =>  {
  try {
    const response = await apiConnector('POST',CREATE_RUBRICS_API, rubricsdata, {

      Authorization: `Bearer ${token}`
    });

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    console.log(response.data.rubric);
    toast.success("Rubrics Created Successful");
    return response.data.rubric
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
  }
}

export const checkRubricsExist = async (semester, academicYear, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${CHECK_RUBRIC_EXIST}?semester=${semester}&academicYear=${academicYear}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {
    console.log("CHECK_EXISTING_RUBRICS_API_ERROR", error);
    throw error;
  }
};