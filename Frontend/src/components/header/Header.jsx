import React from "react";
import { useSelector } from "react-redux";
import StudentPortalHeader from "./StudentPortalHeader";
import FacultyPortalHeader from "./FacultyPortalHeader";

const Header = () => {
  const { user } = useSelector((state) => state.profile);

  return (
    <>
      {user?.userType === "student" ? (
        <StudentPortalHeader />
      ) : (
        <FacultyPortalHeader />
      )}
    </>
  );
};

export default Header;
