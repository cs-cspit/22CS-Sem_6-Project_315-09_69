import { toast } from "react-toastify"
import { apiConnector } from "../apiConnector"
import { studentEndPoints } from "../apis"

const {
  GET_REMAINING_STUDENTS_API,
  STUDENT_PROFILE,
  PATCH_STUDENT_PROFILE_API,
} = studentEndPoints;

export const fetchRemaningStudent = async (data, token) =>{
    try {
        console.log('inside fetch',data);
        
        const response = await apiConnector('POST',GET_REMAINING_STUDENTS_API,data,{
            Authorization : `Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        console.log(response);
        return response.data.remainingStudents;
        
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
}

export const updateStudentProfile = async (data, token) => {
  console.log(data, token);
  try {
    const response = await apiConnector(
      "PATCH",
      PATCH_STUDENT_PROFILE_API,
      data,
      { Authorization: `Bearer ${token}` } // Ensure headers are correctly passed
    );

    console.log("Response:", response.data.student);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unknown error occurred");
    }

    return response.data.student;
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error(error.response?.data?.message || "Failed to update profile");
  }
};

export const fetchStudentData = async (token) => {
  try {
    const response = await apiConnector("GET", STUDENT_PROFILE, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Unknown error");
    }

    return response?.data?.data; // This contains profile, studentId, etc.
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};


