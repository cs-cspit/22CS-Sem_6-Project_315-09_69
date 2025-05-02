import { useState,useEffect, React } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { StudentsSidebarLinks } from "../../../data/StudentsSidebarLinks";
import { MdEditSquare } from "react-icons/md";
import SideBarLink from "./SideBarLink";
const StudentSideBar = () => {
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const basePath = path.split("/").slice(0, 3).join("/");

  useEffect(() => {
    const found = StudentsSidebarLinks.some((link) => link.path === basePath);
    if (found) {
      setShowProjectDetails(true);
    } else {
      setShowProjectDetails(false);
    }
    console.log(found);
  }, [basePath]);

  return (
    <div>
      {/** poject button */}
      <button
        className={` ${
          showProjectDetails ? "bg-[#c9c4ff]" : "bg-[#e3e4ec]"
        } text-[#170F49] px-5 py-2 rounded-lg mb-4 w-full flex items-center  gap-x-2 font-poppins font-medium text-base tracking-wide`}
        onClick={() => {
          navigate("/student/projects");
          setShowProjectDetails(false);
        }}
      >
        <MdEditSquare className=" w-5 h-auto" />
        Project
      </button>

      {showProjectDetails ? (
        <div
          className={`space-y-2 bg-[#c9c4ff] border rounded-lg px-3 py-2 transition-all duration-1000 ease-in-out transform ${
            showProjectDetails ? "opacity-100 scale-100" : "opacity-0 scale-95"} `}
        >
          {StudentsSidebarLinks.map((sideBarLink) => (
            <SideBarLink link={sideBarLink} />
          ))}
        </div>
      ) : (
        <p className="text-center text-red-400 text-xs font-medium">
          Select a project to view details
        </p>
      )}
    </div>
  );
};

export default StudentSideBar;
