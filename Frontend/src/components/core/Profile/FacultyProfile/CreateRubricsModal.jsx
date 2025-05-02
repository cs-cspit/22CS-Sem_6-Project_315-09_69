import React from 'react'

const CreateRubricsModal = ({
  rubricsFormData,
  handleCriteriaChange,
  handleRubricSubmit,
  setShowRubricModal,
  rubricsError,
  rubricsSuccess,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            Create Assessment Rubric
          </h2>
          <p className="text-teal-100 text-sm font-poppins mt-1">
            Complete all fields to create a new assessment rubric
          </p>
        </div>

        <form onSubmit={handleRubricSubmit} className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <input
                type="number"
                name="semester"
                value={rubricsFormData.semester}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all"
                placeholder="e.g., 6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                name="academicYear"
                value={rubricsFormData.academicYear}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all"
                placeholder="e.g., 2024-2025"
                required
              />
            </div>
          </div>

          {/* Criteria Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-800">
                Assessment Criteria
              </h3>
              <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                5 Required
              </span>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-3 mb-2 px-3">
              <div className="col-span-6 text-sm font-medium text-indigo-400">
                Criterion Title
              </div>
              <div className="col-span-3 text-sm font-medium text-indigo-400 text-center">
                Max Marks
              </div>
              <div className="col-span-3 text-sm font-medium text-indigo-400 text-center">
                Weightage (%)
              </div>
            </div>

            {/* Criteria Inputs */}
            {rubricsFormData.criteria.map((criterion, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-3 mb-3 p-3 rounded-lg ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="col-span-6 relative">
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-indigo-400 text-white rounded-full flex items-center justify-center text-xs font-bold focus:outline-none
                          "
                  >
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={criterion.title}
                    onChange={(e) =>
                      handleCriteriaChange(index, "title", e.target.value)
                    }
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all"
                    placeholder="Enter criterion title"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={criterion.maxMarks}
                    onChange={(e) =>
                      handleCriteriaChange(index, "maxMarks", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all text-center"
                    placeholder="Max"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={criterion.weightage}
                    onChange={(e) =>
                      handleCriteriaChange(index, "weightage", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all text-center"
                    placeholder="%"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Error/Success Messages */}
          {rubricsError && (
            <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <svg
                  className="h-5 w-5 mr-3 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{rubricsError}</p>
              </div>
            </div>
          )}

          {rubricsSuccess && (
            <div className="p-4 mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <div className="flex">
                <svg
                  className="h-5 w-5 mr-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{rubricsSuccess}</p>
              </div>
            </div>
          )}

          {/* Footer/Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowRubricModal(false)}
              className="px-5 py-2.5 bg-white border border-indigo-700 text-indigo-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-700 text-white font-medium rounded-lg hover:bg-indigo-500 shadow-sm transition-colors"
            >
              Create Rubric
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRubricsModal
