import React from 'react'

const WeeklyReportCardSkeleton = () => {
  return (
    <div className="w-[30rem] h-[18rem] bg-white rounded-2xl shadow-xl p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-full h-[1px] bg-gray-200" />
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[120px,1fr] gap-2 items-start"
            >
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeeklyReportCardSkeleton

