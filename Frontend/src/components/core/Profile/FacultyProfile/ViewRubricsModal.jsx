import React from "react";

const ViewRubricsModal = ({ rubricsData, setShowViewRubricsModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with indigo background */}
        <div className="bg-indigo-600 p-5 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white font-poppins">Rubrics Details</h2>
            <button
              onClick={() => setShowViewRubricsModal(false)}
              className="text-white hover:text-indigo-200 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Metadata cards */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-sm font-semibold text-indigo-800">
                  Department
                </p>
              </div>
              <p className="text-lg font-bold text-indigo-700">
                {rubricsData.department}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-semibold text-indigo-800">
                  Academic Year
                </p>
              </div>
              <p className="text-lg font-bold text-indigo-700">
                {rubricsData.academicYear}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="text-sm font-semibold text-indigo-800">
                  Semester
                </p>
              </div>
              <p className="text-lg font-bold text-indigo-700">
                {rubricsData.semester}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-sm font-semibold text-indigo-800">
                  Total Marks
                </p>
              </div>
              <p className="text-lg font-bold text-indigo-700">
                {rubricsData.totalMarks}
              </p>
            </div>
          </div>

          {/* Criteria section */}
          <div className="bg-white rounded-lg shadow-md border border-indigo-100 overflow-hidden">
            <div className="bg-indigo-500 px-6 py-3">
              <h3 className="text-lg font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Evaluation Criteria
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Criteria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Max Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Weightage (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rubricsData.criteria.map((criterion, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-indigo-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {criterion.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className=" text-indigo-800 py-1 px-3 font-medium">
                          {criterion.maxMarks}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className=" text-indigo-800 py-1 px-3 font-medium">
                          {criterion.weightage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewRubricsModal;
