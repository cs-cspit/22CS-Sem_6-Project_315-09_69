import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudentData,
  updateStudentProfile,
} from "../../services/operations/studentAPI";
import { setUser } from "../../slices/profileSlice";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  // FaCheck,
  FaLightbulb,
  FaUniversity,
  FaCalendarAlt,
  FaTrash,
  // FaTimes,
  // FaLock,
  // FaEye,
  // FaEyeSlash,
  FaGraduationCap,
  FaBookOpen,
  FaIdCard,
} from "react-icons/fa";
import PasswordChangeCard from "../../components/core/Profile/PasswordChange";
import { MdCancel } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoIosSave } from "react-icons/io";
import { toast } from "react-toastify";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.profile.user); // Get user from Redux
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState(null); // which section currently update
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  

  // Profile Data State
  const [profileData, setProfileData] = useState({
    studentId: "",
    name: "",
    email: "",
    contact: "",
    department: "",
    semester: "",
    batchYear: "",
    batch: "",
    bio: "",
    avatar: "",
    openProjects: 0,
    sgpProjects: 0,
    skills: [],
  });

  // Fetch User Data
  useEffect(() => {
    const getStudentDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchStudentData(token);

        setProfileData({
          studentId: data.studentId || "",
          name: data.profile?.name || "",
          email: data.email || "",
          contact: data.profile?.contact || "",
          department: data.department || "",
          semester: data.semester || "",
          batchYear: data.batchYear || "",
          batch: data.batch || "",
          bio: data.profile?.bio || "",
          avatar: data.profile?.avatar || "",
          otherProjects: data.profile?.projectCounts?.["Other Project"] || 0,
          sgpProjects: data.profile?.projectCounts?.["SGP"] || 0,
          skills: data.skills || [],
        });
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    getStudentDetails();
  }, [token]);

  // Handle Profile Picture Change
const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Show preview before upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Manually append required fields
      if (profileData.name) formData.append("name", profileData.name);
      if (profileData.contact) formData.append("contact", profileData.contact);
      if (profileData.semester) formData.append("semester", profileData.semester);
      if (profileData.bio) formData.append("bio", profileData.bio);

      // Append avatar if selected
      if (selectedFile) formData.append("avatar", selectedFile);
      
      // Send update request
      const res = await updateStudentProfile(formData, token);

      // console.log("Response from API:", res);

      if (res && res.profile.avatar) {
        // Update Redux state and localStorage with new avatar URL
        // console.log('user in slice',user);
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            avatar: res.profile.avatar,
          },
        };
        // console.log("updated",updatedUser);
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // console.log('updated user',user);
        // Update Profile Data
        setProfileData((prev) => ({ ...prev, avatar: res.profile.avatar }));
        toast.success("Profile updated successfully!");
      } 
    }catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to update profile!");
    } finally {
      setLoading(false);
      setActiveSection(null);
    }
  };

  const toggleSectionEdit = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-indigo-600 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-auto w-9/12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-screen mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-lg border-l-4 border-indigo-600">
          <button
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 font-medium"
            onClick={() => window.history.back()}
          >
            <span className="mr-2 text-lg">←</span> Back
          </button>
          <h1 className="text-2xl md:text-2xl font-bold ml-4 ">My Profile</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full md:w-1/3 space-y-6">
            {/* Profile Picture Card */}
            <div className="bg-white rounded-xl p-5 shadow-lg border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Profile Picture</h2>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-200 to-purple-200 border-3 border-indigo-300 shadow-lg mb-4 flex items-center justify-center">
                  {previewUrl || profileData.avatar ? (
                    <img
                      src={previewUrl || profileData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-indigo-400 text-5xl" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  accept="image/*"
                />

                {activeSection === "edit" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-gradient-to-r from-green-600 to-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:from-green-700 hover:to-green-700"
                    >
                      <AiOutlineCloudUpload className="mr-2 inline" size={18} />
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setProfileData((prev) => ({ ...prev, avatar: "" }));
                      }}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600"
                    >
                      <FaTrash className="mr-2 inline" size={14} />
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-indigo-800">
                  {profileData.name || "N/A"}
                </h3>
                <p className="text-purple-600">
                  {profileData.department || "N/A"} Department
                </p>
                <div className="mt-2 flex items-center justify-center text-gray-600">
                  <FaIdCard className="mr-2 text-indigo-500" />
                  <span className="text-sm font-semibold">
                    {profileData.studentId || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <PasswordChangeCard />
          </div>

          {/* Right Column - Personal Information */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl p-5 shadow-lg border border-indigo-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                      <FaUser className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold">
                      Personal Information
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(activeSection === "edit" ? null : "edit")
                    }
                    className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200"
                  >
                    <FaEdit size={14} className="inline mr-1" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaUser className="inline-block mr-2 text-indigo-600" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      readOnly={activeSection !== "edit"}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        activeSection === "edit"
                          ? "border-indigo-300 bg-white"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="inline-block mr-2 text-indigo-600" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="inline-block mr-2 text-indigo-600" />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={profileData.contact}
                      onChange={handleInputChange}
                      readOnly={activeSection !== "edit"}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        activeSection === "edit"
                          ? "border-indigo-300 bg-white"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaUniversity className="inline-block mr-2 text-indigo-600" />
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaGraduationCap className="inline-block mr-2 text-indigo-600" />
                      Semester
                    </label>
                    <input
                      type="number"
                      name="semester"
                      value={profileData.semester}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    
                    />
                  </div>

                  {/* Batch Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="inline-block mr-2 text-indigo-600" />
                      Batch Year
                    </label>
                    <input
                      type="text"
                      name="batchYear"
                      value={profileData.batchYear}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Batch */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaBookOpen className="inline-block mr-2 text-indigo-600" />
                      Batch
                    </label>
                    <input
                      type="text"
                      name="batch"
                      value={profileData.batch}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Other Projects */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaLightbulb className="inline-block mr-2 text-indigo-600" />
                      SGP Projects
                    </label>
                    <input
                      type="text"
                      value={profileData.sgpProjects}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaLightbulb className="inline-block mr-2 text-indigo-600" />
                      Other Projects
                    </label>
                    <input
                      type="text"
                      value={profileData.otherProjects}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaLightbulb className="inline-block mr-2 text-indigo-600" />
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      readOnly={activeSection !== "edit"}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        activeSection === "edit"
                          ? "border-indigo-300 bg-white"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      rows="3"
                    />
                  </div>

                  {activeSection === "edit" && (
                    <div className="flex justify-end mt-6 space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleSectionEdit(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      >
                        <MdCancel className="inline mr-1" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
                      >
                        <IoIosSave className="inline mr-1" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
