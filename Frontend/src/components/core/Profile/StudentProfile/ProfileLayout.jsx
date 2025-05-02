import React from "react";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="min-h-screen flex justify-center items-center max-auto bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      {/* <div className="min-h-screen flex justify-center items-center max-auto from-indigo-50 via-purple-50 to-pink-50"> */}
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
