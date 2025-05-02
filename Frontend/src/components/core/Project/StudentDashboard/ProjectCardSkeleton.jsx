import React from "react";

const ProjectCardSkeleton = () => {
  return (
    <div className="w-[28rem] h-[15rem] bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="w-40 h-6 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index}>
                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
        </div>
        <div className="flex gap-x-[5.5rem] items-center mt-8">
          <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
