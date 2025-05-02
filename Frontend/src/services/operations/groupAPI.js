import { apiConnector } from "../apiConnector";
import { groupEndPoints } from "../apis";
import { setLoading } from "../../slices/authSlice";
import { setProject, setProjectInProgres, setStep } from "../../slices/projectSlice";
import { toast } from "react-toastify";

const { CREATE_GROUP_API ,GET_PROJECT_MEMBERS_API} = groupEndPoints;

const customToastStyle = {
  background: "#F8F7FC",
  color: "#6F6C90",
  borderLeft: "5px solid #7E56DA",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  fontFamily: "Poppins, sans-serif",
  fontSize: "14px",
  padding: "12px",
  borderRadius: "10px",
};


export function creatGroup(mentorName, projectType, semester, academicYear, studentIds, department, token, navigate ) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            console.log('inside creaate group');
            
            const response = await apiConnector(
              "POST",
              CREATE_GROUP_API,
              {
                mentorName,
                semester,
                academicYear,
                studentIds,
                department,
                projectType
              },
              {
                Authorization: `Bearer ${token}`,
              }
            );

            console.log('-------------------> group creation response:', response);

            if(!response.data.success){
                throw new Error(response.data.message || "Failed to create group")
            }

            toast.info("Step 1 Complete")

            const projectData = {
                type: projectType,
                mentorId: response.data.mentorId,
                groupId : response.data.groupId,
            }
            dispatch(setProject(projectData))
            dispatch(setStep(2));
            dispatch(setProjectInProgres())
        } catch (error) {
            console.log(error);
            
            toast(error.response.data.message, {
              style: customToastStyle,
            });
            navigate('/student/add-project');
        } finally{
            dispatch(setLoading(false))
        }
    }
}

export const fetchGroupMembers = async (projectId, token) =>{
    try {
        const response = await apiConnector('GET',`${GET_PROJECT_MEMBERS_API}/${projectId}`,{},{
            Authorization : `Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message || "Error while fetching group members");
        }
        return response.data.data;
    } catch (error) {
        toast.error(error.response.data.message); 
    }
}