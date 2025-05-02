import React from "react";
import Header from "../components/header/Header";
import SideBar from "../components/sidebar/SideBar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { projectType } = useSelector((state) => state.faculty);
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Header />
      </div>

      <div className="flex pt-20">
        {/* Fixed Sidebar with conditional rendering */}
        {user.userType === "student" || projectType === "sgp" ? (
          <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] z-10">
            <SideBar />
          </div>
        ) : null}

        {/* Main content with appropriate margin to account for sidebar */}
        <div
          className={`min-h-[calc(100vh-5rem)] bg-[#F7F7FB] flex-1 ${
            user.userType === "student" || projectType === "sgp" ? "ml-64" : ""
          } `}
        >
          <div className="w-[95.6%] max-w-[2000px] mx-auto p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
