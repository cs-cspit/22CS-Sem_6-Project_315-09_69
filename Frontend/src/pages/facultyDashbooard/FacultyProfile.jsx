import React, { useState, useEffect, useRef } from "react";
import { fetchFacultyProfile,updateFacultyProfile, createRubics, checkRubricsExist } from "../../services/operations/facultyAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CreateRubricsModal from "../../components/core/Profile/FacultyProfile/CreateRubricsModal";
import ViewRubricsModal from "../../components/core/Profile/FacultyProfile/ViewRubricsModal";
import PasswordChangeCard from "../../components/core/Profile/PasswordChange";

const FacultyProfile = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [showViewRubricsModal, setShowViewRubricsModal] = useState(false);
  const [existingRubricsData, setExistingRubricsData] = useState(null);
  const [rubricsError, setRubricsError] = useState(null);
  const [rubricsSuccess, setRubricsSuccess] = useState(null);
  const [rubricsExist, setRubricsExist] = useState(false);

  const [rubricsFormData, setRubricsFormData] = useState({
    semester: "",
    academicYear: "",
    criteria: [
      { title: "", maxMarks: 0, weightage: 0 },
      { title: "", maxMarks: 0, weightage: 0 },
      { title: "", maxMarks: 0, weightage: 0 },
      { title: "", maxMarks: 0, weightage: 0 },
      { title: "", maxMarks: 0, weightage: 0 },
    ], // Initialize with exactly 5 criteria
  });

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    bio: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { token } = useSelector((state) => state.auth);

  // Fetch faculty profile data
  useEffect(() => {
    const getFacultyProfile = async () => {
      console.log("insdie getFacultyProfile");

      try {
        setLoading(true);

        const response = await fetchFacultyProfile(token);
        console.log(response);
        setFaculty(response);
        setFormData({
          name: response.faculty?.profile.name || "",
          contact: response.faculty?.profile.contact || "",
          bio: response.faculty?.profile.bio || "",
        });
      } catch (error) {
        console.log(error);

        setError("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    getFacultyProfile();
  }, [token]);

  useEffect(() => {
    const checkIfRubricsExist = async () => {
      if (faculty?.isCoordinator && faculty.coordinatorHistory.length > 0) {
        const currentCoordinatorInfo =
          faculty.coordinatorHistory[faculty.coordinatorHistory.length - 1];
        try {
          const response = await checkRubricsExist(
            currentCoordinatorInfo.semester,
            currentCoordinatorInfo.academicYear,
            token
          );

          console.log(response);
          if (response.exists) {
            setRubricsExist(response.exists);
            setExistingRubricsData(response.rubrics);
          }
        } catch (error) {
          console.error("Error checking if rubrics exist:", error);
        }
      }
    };

    if (faculty) {
      checkIfRubricsExist();
    }
  }, [faculty, token]);

  const handleEditMode = (setEditMode) => {
    setEditMode(true);
    setFormData({
      name: faculty?.profile.name,
      contact: faculty?.profile.contact,
      bio: faculty?.profile.bio,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...rubricsFormData.criteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]:
        field === "maxMarks" || field === "weightage" ? Number(value) : value,
    };
    setRubricsFormData((prev) => ({
      ...prev,
      criteria: updatedCriteria,
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("bio", formData.bio);

      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }

      const response = await updateFacultyProfile(formDataToSend, token);

      if (response) {
        setFaculty(response);
        setEditMode(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    }
    setLoading(false);
  };

  const handleRubricSubmit = async (e) => {
    e.preventDefault();
    setRubricsError(null);
    setRubricsSuccess(null);

    // Validation: Ensure all fields are filled

    const currentCoordinatorInfo =
      faculty.coordinatorHistory[faculty.coordinatorHistory.length - 1];

    const rubricsDataToSubmit = {
      ...rubricsFormData,
      semester: currentCoordinatorInfo.semester,
      academicYear: currentCoordinatorInfo.academicYear,
      department: faculty.department,
    };
    setLoading(true);
    try {
      const response = await createRubics(rubricsDataToSubmit, token);
      if (response) {
        setRubricsSuccess("Rubric created successfully!");
        setShowRubricModal(false);
        setRubricsExist(true);
        setRubricsFormData({
          semester: "",
          academicYear: "",
          criteria: [
            { title: "", maxMarks: 0, weightage: 0 },
            { title: "", maxMarks: 0, weightage: 0 },
            { title: "", maxMarks: 0, weightage: 0 },
            { title: "", maxMarks: 0, weightage: 0 },
            { title: "", maxMarks: 0, weightage: 0 },
          ],
        });
      }
    } catch (error) {
      setRubricsError(error.message || "Error creating rubric");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: faculty?.profile?.name || "",
      contact: faculty?.profile?.contact || "",
      bio: faculty?.profile?.bio || "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleOpenRubricModal = () => {
    if (faculty?.coordinatorHistory?.length > 0) {
      const currentInfo =
        faculty.coordinatorHistory[faculty.coordinatorHistory.length - 1];
      setRubricsFormData({
        ...rubricsFormData,
        semester: currentInfo.semester,
        academicYear: currentInfo.academicYear,
      });
    }
    setShowRubricModal(true);
  };

  const handleOpenViewRubricsModal = () => {
    setShowViewRubricsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 inline-block mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-indigo-600 rounded-t-2xl p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          {!editMode ? (
            <button
              onClick={() => handleEditMode(setEditMode)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors flex items-center"
            >
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="bg-white text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
              >
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-b-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {!editMode ? (
                  <h2 className="text-2xl font-bold text-gray-800">
                    {faculty?.profile?.name || "No name provided"}
                  </h2>
                ) : (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-200 focus:border-indigo-600 outline-none px-2 py-1 w-full md:w-64"
                  />
                )}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex items-center text-indigo-600">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{faculty?.email}</span>
                  </div>
                  <div className="flex items-center text-indigo-600">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{faculty?.department} Department</span>
                  </div>
                  <div className="flex items-center text-indigo-600">
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
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{faculty?.designation || "Faculty"}</span>
                  </div>
                </div>

                {faculty?.isCoordinator && (
                  <div className="mt-5">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Current SGP Coordinator for
                      {faculty.coordinatorHistory.length > 0 &&
                        ` Semester ${
                          faculty.coordinatorHistory[
                            faculty.coordinatorHistory.length - 1
                          ].semester
                        }, 
         Academic Year ${
           faculty.coordinatorHistory[faculty.coordinatorHistory.length - 1]
             .academicYear
         }`}
                    </span>
                  </div>
                )}

                {faculty?.isCoordinator && (
                  <button
                    onClick={
                      rubricsExist
                        ? handleOpenViewRubricsModal
                        : handleOpenRubricModal
                    }
                    className={`mt-4 px-4 py-2 rounded-md transition-colors flex items-center ${
                      rubricsExist
                        ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    {rubricsExist ? "View Rubrics" : "Create Rubrics"}
                  </button>
                )}
              </div>

              {/* Profile Image */}
              <div className="relative">
                <div className="h-40 w-40 rounded-full overflow-hidden bg-gray-100 border-4 border-indigo-100 flex items-center justify-center">
                  {previewUrl || faculty?.profile?.avatar ? (
                    <img
                      src={previewUrl || faculty?.profile?.avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-indigo-600 text-white text-4xl h-full w-full flex items-center justify-center">
                      {faculty?.profile?.name
                        ? faculty.profile.name.charAt(0).toUpperCase()
                        : "F"}
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/jpeg, image/jpg, image/png"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          <PasswordChangeCard />

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Contact Information
            </h3>

            <div className="bg-gray-50 rounded-lg p-4">
              {!editMode ? (
                <p className="text-gray-700">
                  {faculty?.profile?.contact ||
                    "No contact information provided"}
                </p>
              ) : (
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Number
                  </label>
                  <input
                    id="contact"
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Your contact number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Bio
            </h3>

            <div className="bg-gray-50 rounded-lg p-4">
              {!editMode ? (
                <p className="text-gray-700 whitespace-pre-line">
                  {faculty?.profile?.bio || "No bio information provided"}
                </p>
              ) : (
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    About You
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself, your expertise, research interests, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              )}
            </div>
          </div>

          {/* Specialization */}
          {faculty?.specialization && faculty.specialization.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Specialization
              </h3>

              <div className="flex flex-wrap gap-2">
                {faculty.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Coordinator History */}
          {faculty?.coordinatorHistory &&
            faculty.coordinatorHistory.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Coordinator History
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Academic Year
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Semester
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {faculty.coordinatorHistory.map((history, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {history.academicYear}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            Semester {history.semester}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>

        {showRubricModal && (
          <CreateRubricsModal
            rubricsFormData={rubricsFormData}
            handleCriteriaChange={handleCriteriaChange}
            handleRubricSubmit={handleRubricSubmit}
            setShowRubricModal={setShowRubricModal}
            rubricsError={rubricsError}
            rubricsSuccess={rubricsSuccess}
          />
        )}

        {showViewRubricsModal && (
          <ViewRubricsModal
            rubricsData={existingRubricsData}
            setShowViewRubricsModal={setShowViewRubricsModal}
          />
        )}
      </div>
    </div>
  );
};

export default FacultyProfile;
