const BASE_URL = 'http://localhost:5000/api/v2';

export const authEndPoints = {
  LOGIN_API: `${BASE_URL}/auth/login`,
  SEND_OTP_API: `${BASE_URL}/auth/send-otp`,
  VERIFY_OTP_API: `${BASE_URL}/auth/verify-otp`,
  UPDATE_PASSWORD_API: `${BASE_URL}/auth/update-password`,
};

export const facultyEndPoints = {
  ALL_FACULTY_API: `${BASE_URL}/faculty/showAllFaculty`,
  GET_ACADEMIC_YEARS_API: `${BASE_URL}/faculty/getAcademicYears`,
  GET_SGP_PROJECT_REQUESTS: `${BASE_URL}/faculty/sgpProjects?`,
  GET_OTHER_PROJECT_REQUESTS: `${BASE_URL}/faculty/openProjects`,
  GET_PROJECT_DETAILS_API: `${BASE_URL}/faculty/showProjectDetails`,
  PROJECT_APPROVAL_API: `${BASE_URL}/faculty/projectApproval`,
  GET_WEEKLYREPORTS_SUBMISSIONS_API: `${BASE_URL}/faculty/weeklyReportsSubmissions`,
  GET_FACULTY_PROFILE_API: `${BASE_URL}/faculty/getProfile`,
  UPDATE_FACULTY_PROFILE_API: `${BASE_URL}/faculty/updateProfile`,
  CREATE_RUBRICS_API: `${BASE_URL}/faculty/create/rubrics`,
  CHECK_RUBRIC_EXIST: `${BASE_URL}/faculty/check-rubrics`,
};

export const studentEndPoints = {
  GET_REMAINING_STUDENTS_API: `${BASE_URL}/student/remaining`,
  PATCH_STUDENT_PROFILE_API: `${BASE_URL}/student/updateProfile`,
  STUDENT_PROFILE: `${BASE_URL}/student/profile`,
};

export const groupEndPoints = {
  CREATE_GROUP_API: `${BASE_URL}/group/create`,
  GET_PROJECT_MEMBERS_API: `${BASE_URL}/group/groupMembers`,
};

export const projectEndPoints = {
  GET_ALL_DOMAINS_API: `${BASE_URL}/project/showAlldomains`,
  GET_ALL_TECHENOLOGY_API: `${BASE_URL}/project/showAlltechnologies?domain=`,
  GET_ALL_PROJECTS_API: `${BASE_URL}/project/showAllProjects`,
  GET_PRJECT_DETAILS_API: `${BASE_URL}/project/details`,
  CREATE_PROJECT_API: `${BASE_URL}/project/create`,
  UPDATE_REJECTED_PROJECT_API: `${BASE_URL}/student/update/rejectedProject`,
  UPDATE_REVISIONAL_PROJECT_API: `${BASE_URL}/student/update/revisionalProject`,
};

export const weeklyReportEndPoints = {
  GET_WEEKLY_REPORTS_API: `${BASE_URL}/student/weeklyReport`,
  CREATE_WEEKLY_REPORT_API: `${BASE_URL}/student/create/weeklyReport`,
  GET_DETAILED_REPORT_API: `${BASE_URL}/faculty/project/weeklyReport`,
  GET_RUBRICS_API: `${BASE_URL}/faculty/project/weeklyReport/rubrics`,
  SUBMIT_WEEKLYREPORT_EVALUATION_API: `${BASE_URL}/faculty/evaluateWeeklyReport`,
  GET_EVLUATED_REPORT_DETAILS_API: `${BASE_URL}/student/evluateWeeklyReportDetails`,
};


export const githubEndPoints = {
  GET_ALL_COMMMITS: `https://api.github.com/repos`,
};
