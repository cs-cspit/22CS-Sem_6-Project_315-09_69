import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VscAccount, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/operations/authAPI";
import useOnClickOutSide from "../../hook/useOnClickOutSide";
import avatar from "../../assets/defaultAvatar/defaultAvatar.jpg";

const ProfileDropDown = () => {
  const { user } = useSelector((state) => state.profile);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useOnClickOutSide(ref, () => setOpen(false));

  return (
    <button className="relative" onClick={() => setOpen((prev) => !prev)}>
      <img
        src={user?.profile?.avatar || avatar}
        alt="avatar"
        className="aspect-square w-[40px] rounded-full object-cover bg-[#c9c4ff]"
      />
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[140%] -right-2 z-50 divide-y divide-gray-300 rounded-md border bg-white w-28"
          ref={ref}
        >
          {user?.userType === "faculty" ? (
            <Link to="/faculty/profile" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-800 hover:bg-gray-200">
                <VscAccount className="text-lg" />
                Profile
              </div>
            </Link>
          ) : (
            <Link to="/student/profile" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-800 hover:bg-gray-200">
                <VscAccount className="text-lg" />
                Profile
              </div>
            </Link>
          )}
          <div
            onClick={() => {
              dispatch(logout(navigate));
              setOpen(false);
            }}
            className="flex items-center gap-x-3 py-2 px-3 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
};

export default ProfileDropDown;
