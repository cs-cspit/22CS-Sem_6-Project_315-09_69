import React from 'react'

const Loader = () => {
  return (
      <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          {/* <div className="w-16 h-16 border-4 border-[#4318FF] border-t-transparent rounded-full animate-spin"></div> */}
          <div className="loader"></div>
        </div>
      </div>
  );
}

export default Loader
