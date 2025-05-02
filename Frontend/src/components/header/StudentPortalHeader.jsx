import React from 'react'
import { useSelector } from "react-redux";
import ProfileDropDown from "../comman/ProfileDropDown";

const StudentPortalHeader = () => {

    const { user } = useSelector((state) => state.profile);

  return (
    <div className='flex justify-center items-center bg-white h-20 border-b shadow-md z-20'>
        <div className="w-11/12 flex max-w-maxContent items-center justify-between">
          <div className="font-poppins text-2xl font-bold text-[#170F49] tracking-wide flex ">
            ProjX
          </div>
          <div className="flex gap-x-2">
            <div className="flex flex-col font-poppins">
              <div className="text-[#0D062D] font-normal">
                {user?.profile?.name}
              </div>
              <div className="text-sm text-[#787486] text-right">
                {user?.studentId}
              </div>
            </div>
            <ProfileDropDown />
          </div>
        </div> 
    </div>
  );
}

export default StudentPortalHeader
