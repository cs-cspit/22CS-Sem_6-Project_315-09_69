import React from 'react'


const ratings = ["Excellent", "Good", "Average", "Poor", "Bad"];
const formatNameProperCase = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
const WeeklyReportCard = ({reportData}) => {
  return (
    <div className="bg-white w-[30rem] h-[18rem] rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[#170f49] text-2xl font-semibold font-poppins flex items-center gap-2">
          Week {reportData.weekNumber}
        </h2>
      </div>
      <div className="w-full h-[1px] bg-[#a0a3bd] mt-2"></div>

      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <h3 className="text-sm font-semibold font-poppins text-[#424242]">
            Topic
          </h3>
          <p className="text-[#424242] font-poppins text-sm line-clamp-1">
            {reportData.title}
          </p>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <h3 className="text-sm font-semibold font-poppins  text-[#424242]">
            Submited by:
          </h3>
          <p className="text-[#424242] font-poppins text-sm">
            {formatNameProperCase(reportData.submittedBy)}
          </p>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <h3 className="text-sm font-semibold font-poppins text-[#424242]">
            Evalueted by:
          </h3>
          <p className="text-[#424242] font-poppins text-sm">
            {reportData.status === "Submitted"
              ? "-"
              : `${reportData.evaluatedBy}`}
          </p>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <h3 className="text-sm font-semibold font-poppins text-[#424242]">
            Submited at:
          </h3>
          <p className="text-[#424242] font-poppins text-sm">
            {reportData.submissionDate}
          </p>
        </div>

        <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <h3 className="text-sm font-semibold font-poppins text-[#424242]">
            Status:
          </h3>
          <div
            className={`py-1 rounded-lg text-xs font-poppins w-20 text-center ${
              reportData.status === "Evaluated"
                ? "bg-green-300 text-[#191515]"
                : "bg-red-300 text-[#191515]"
            }`}
          >
            {reportData.status}
          </div>
        </div>

        {/* <div className="grid grid-cols-[120px,1fr] gap-2 items-start">
          <h3 className="text-sm font-bold font-poppins text-[#424242]">Guide Review</h3>
          <p className="text-[#424242] line-clamp-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            doiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div> */}
      </div>

      <div className="flex gap-2 mt-5 mx-4">
        {ratings.map((rating) => (
          <button
            key={rating}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${
                      rating === reportData.feedback &&
                      reportData.status === "Evaluated"
                        ? "bg-[#4a3aff] text-white"
                        : "bg-[#c9c4ff] text-black"
                    }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}

export default WeeklyReportCard
