import React from "react";
import ButtonLoader from "./ButtonLoader";

const IconBtn = ({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
  activeBtn,
  setActiveBtn,
  loading,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={` ${customClasses} flex items-center justify-center cursor-pointer gap-x-2 rounded-md py-2 px-5 font-poppins  ${
        activeBtn === text
          ? "bg-[#4a3aff] text-white"
          : "bg-[#c9c4ff] text-white"
      } `}
    >
      {loading && <ButtonLoader />}
      {children ? <>{children}</> : text}
    </button>
  );
};

export default IconBtn
