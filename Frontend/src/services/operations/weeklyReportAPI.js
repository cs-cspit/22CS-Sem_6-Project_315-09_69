import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";

import { weeklyReportEndPoints } from "../apis";
const {GET_WEEKLY_REPORTS_API, CREATE_WEEKLY_REPORT_API, GET_DETAILED_REPORT_API, GET_RUBRICS_API, SUBMIT_WEEKLYREPORT_EVALUATION_API, GET_EVLUATED_REPORT_DETAILS_API} = weeklyReportEndPoints

export const fetchProjectWeeklyReports = async (projectId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_WEEKLY_REPORTS_API}/${projectId}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error while fetching weekly report");
    }

    console.log(response);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const addWeeklyReport = async (projectId,data,token,navitage) =>  {
    try {
       const response = await apiConnector('POST',`${CREATE_WEEKLY_REPORT_API}/${projectId}`,data, {
        Authorization: `Bearer ${token}`,
      }) 
        
        if(!response.data.success){
            throw new Error(response.data.message || "Error while creating weekly report");
        }
        
        toast.success('Report Added Successfully');
        navitage(`/student/weekly-reports/${projectId}`);
    } catch (error) {
      toast.error(error.response.data.message); 
    }
}

export const fetchDetailedWeeklyReport = async (reportId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_DETAILED_REPORT_API}/${reportId}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Error while fetching weekly report");
    }

    console.log(response);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const fetchRubrics = async (weeklyReportId, token) => {
  try {
    const response = await apiConnector('GET',`${GET_RUBRICS_API}/${weeklyReportId}`)
    if(!response.data.success){
      throw new Error(response.data.message);
    }

    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error); 
    toast.error(error.response.data.message)
  }
}

export const submitEvaluation = async (weeklyReportId, evaluationData, token, projectType, semester, academicYear, navitage) => {
  try {
    const response = await apiConnector(
      "POST",
      `${SUBMIT_WEEKLYREPORT_EVALUATION_API}/${weeklyReportId}`,
      evaluationData,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    toast.success("Evaluation Completed successfully!");
    navitage(`/faculty/${projectType}/submissions/${semester}/${academicYear}`);
  } catch (error) {
    console.log("SUBMIT_EVALUATION_API ERROR", error);
    toast.error(error.response.data.message);
  }
};

export const fetchEvaluatedReportDetails = async (weeklyReportId, token) => {
  try{
    const response = await apiConnector('GET',`${GET_EVLUATED_REPORT_DETAILS_API}/${weeklyReportId}`,{},{
      Authorization: `Bearer ${token}`
    });

    if(!response.data.success){
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch(error){
    console.log(error);
    toast.error(error.response.data.message);
  }
}
