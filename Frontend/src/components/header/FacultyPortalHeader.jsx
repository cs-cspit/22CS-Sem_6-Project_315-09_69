import { useSelector, useDispatch } from "react-redux";
import ProfileDropDown from "../comman/ProfileDropDown";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { setProjectType, setActiveNavItem } from "../../slices/navSlice";
import { useEffect } from "react";
const FacultyPortalHeader = () => {
  const { user } = useSelector((state) => state.profile);
  const { projectType, activeNavItem, semester, academicYear } = useSelector(
    (state) => state.faculty
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {projectId, weeklyReportId} = useParams();
 

  useEffect(()=>{
    if(projectId || weeklyReportId){
      return;
    }
    else if (location.pathname.includes("/faculty/profile")) {
      return;
    } else if (projectType === "open-project") {
      navigate(`/faculty/${projectType}/approval-requests`);
    } else if (projectType && activeNavItem && semester && academicYear) {
      navigate(
        `/faculty/${projectType}/${activeNavItem}/${semester}/${academicYear}`
      );
    } else {
      navigate(`/faculty`);
    }
    console.log(projectType, activeNavItem, semester, academicYear);
    
    
    
  },[projectType,activeNavItem,semester,academicYear,navigate])

  return (
    <div className="flex flex-col shadow-lg z-20">
      {/* Top Header */}
      <div className="w-full bg-[#170f49] py-4">
        <div className="w-11/12 mx-auto flex items-center justify-between">
          {/* Project Name */}
          <div className="font-poppins text-2xl font-bold text-white tracking-wide">
            ProjX
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-x-12">
            {/* Project Type Selection */}
            <div className="flex gap-x-4">
              <button
                onClick={() => {
                  dispatch(setProjectType("sgp"));
                }}
                className="relative px-1 py-2"
              >
                <span
                  className={`text-white font-poppins ${
                    projectType === "sgp" ? "font-medium" : "font-normal"
                  }`}
                >
                  Software Group Project
                </span>
                {projectType === "sgp" && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white" />
                )}
              </button>

              <button
                onClick={() => {
                  dispatch(setProjectType("open-project"));
                }}
                className="relative px-1 py-2"
              >
                <span
                  className={`text-white font-poppins ${
                    projectType === "open-project"
                      ? "font-medium"
                      : "font-normal"
                  }`}
                >
                  Open Project
                </span>
                {projectType === "open-project" && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white" />
                )}
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-x-3">
              <div className="flex flex-col items-end font-poppins">
                <div className="text-white font-normal">
                  {user?.profile?.name || "Faculty Name"}
                </div>
                <div className="text-sm text-white">
                  {user?.facultyId || "XYZ124"}
                </div>
              </div>
              <ProfileDropDown />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full bg-white border-b shadow-md">
        <div className="w-7/12 mx-auto px-4 flex gap-x-8 ">
          <button
            onClick={() => dispatch(setActiveNavItem("approval-requests"))}
            className="relative px-1 py-2"
          >
            <span
              className={`font-poppins ${
                activeNavItem === "approval-requests"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Project Request
            </span>
            {activeNavItem === "approval-requests" && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
            )}
          </button>

          <button
            onClick={() => dispatch(setActiveNavItem("submissions"))}
            className="relative px-1 py-2"
          >
            <span
              className={`font-poppins ${
                activeNavItem === "submissions"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              Project Submissions
            </span>
            {activeNavItem === "submissions" && (
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyPortalHeader;
