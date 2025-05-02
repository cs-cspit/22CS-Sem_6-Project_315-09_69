import React from 'react'
import { matchPath, useLocation, useNavigate, useParams } from 'react-router-dom'

const SideBarLink = ({link}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const {projectId} = useParams();


    const path = location.pathname;
    const basePath = path.split("/").slice(0, 3).join("/");  

    const matchRoute = (path)=>{
        return matchPath(path, basePath);
    }


  return (
    <button
      key={link.id}
      onClick={() => navigate(`${link.path}/${projectId}`)}
      className={`w-full px-4 py-2 text-left text-black font-poppins text-sm border-none rounded-xl 
            transition-all duration-200 ease-in-out
          ${
              matchRoute(link.path)
              ? "bg-white shadow-md transform scale-105"
              : " hover:bg-[#f8f8f8] hover:shadow-lg hover:scale-105"
          }`}
    >
      {link.title}
    </button>
  );
}

export default SideBarLink
