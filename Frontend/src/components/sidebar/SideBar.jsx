import { useSelector } from "react-redux";
import StudentSideBar from "./StudentSideBar/StudentSideBar";
import FacultySideBar from "./FacultySideBar/FacultySideBar";

const SideBar = () => {
  const { user } = useSelector((state) => state.profile);
  

  return (
    <div className="bg-white text-[#170F49]  w-[18rem] min-w-[220px] p-5 border-b-[0px] shadow-lg z-10 min-h-[calc(100vh-5rem)]">
      {/* student portal sidebar */}
      {user?.userType === "student" ? <StudentSideBar /> : <FacultySideBar />}
    </div>
  );
};

export default SideBar;
