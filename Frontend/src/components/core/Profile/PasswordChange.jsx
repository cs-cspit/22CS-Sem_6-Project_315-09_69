import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaLock,
  FaEdit,
  FaEye,
  FaEyeSlash,
  // FaCheck,
  // FaTimes,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { MdCancel, MdVerifiedUser } from "react-icons/md";
import OtpInput from "react-otp-input";
import {
  sendOtpForPasswordReset,
  verifyOtpForPasswordReset,
  updatePassword,
} from "../../../services/operations/authAPI";

const PasswordChangeCard = () => {
  // const { token } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.profile.user);

  // States for OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // JWT token for OTP verification and password reset
  const [resetTokens, setResetTokens] = useState({
    otpToken: "",
    resetToken: "",
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Password data state
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Loading states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // User email for OTP
  const [userEmail, setUserEmail] = useState("");
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);

  // Timer effect for OTP expiration
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            if (otpSent && !otpVerified) {
              toast.error("OTP expired! Please request a new one.");
              setOtpSent(false);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [otpTimer, otpSent, otpVerified]);

  // Timer effect for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTime) => {
          if (prevTime <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  // Set email from user object when component mounts
  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  // Handle email input change
  // const handleEmailChange = (e) => {
  //   setUserEmail(e.target.value);
  // };

  // Start password change flow
  const startPasswordChange = () => {
    setShowEmailConfirm(true);
  };

  // Send OTP to email
  const sendOTPEmail = async () => {
    // Check if email exists
    if (!userEmail) {
      toast.error("Please enter your email address");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);

    try {
      // Call the API function to send OTP with improved error logging
      console.log("Sending OTP request with:", {
        email: userEmail,
        userType: user?.userType || "student",
      });

      const response = await sendOtpForPasswordReset({
        email: userEmail,
        userType: user?.userType || "student", // Use accountType instead of userType
      });

      console.log("OTP response:", response);

      // Store the JWT token returned from the server
      setResetTokens((prev) => ({
        ...prev,
        otpToken: response.token,
      }));

      // Start OTP timer (10 minutes = 600 seconds)
      setOtpTimer(600);
      setOtpSent(true);
      setShowEmailConfirm(false);

      // Disable resend button for 60 seconds
      setIsResendDisabled(true);
      setResendTimer(60);

      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Detailed OTP error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      console.log("Verifying OTP with:", {
        token: resetTokens.otpToken,
        otp: enteredOtp,
      });

      // Call the API function to verify OTP
      const response = await verifyOtpForPasswordReset({
        token: resetTokens.otpToken,
        otp: enteredOtp,
      });

      console.log("OTP verification response:", response);

      // Store the reset token returned from the server
      setResetTokens((prev) => ({
        ...prev,
        resetToken: response.resetToken,
      }));

      // If OTP verification is successful
      setOtpVerified(true);
      toast.success("OTP verified successfully!");
    } catch (error) {
      console.error("Detailed verification error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password update
  const handlePasswordSubmit = async () => {
    // Validate passwords
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please enter both password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      console.log("Updating password with token:", resetTokens.resetToken);

      // Call the API function to update password
      await updatePassword({
        resetToken: resetTokens.resetToken,
        newPassword: passwordData.newPassword,
      });

      // Reset all states
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
      setOtpVerified(false);
      setOtpSent(false);
      setEnteredOtp("");
      setResetTokens({
        otpToken: "",
        resetToken: "",
      });

      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Detailed password update error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Reset the entire process
  const handleCancel = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setEnteredOtp("");
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
    setOtpTimer(0);
    setResendTimer(0);
    setIsResendDisabled(false);
    setResetTokens({
      otpToken: "",
      resetToken: "",
    });
    setShowEmailConfirm(false);
  };

  // Render timer in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border-b-0 border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-indigo-800">Password</h2>
        {!otpSent && !otpVerified && !showEmailConfirm && (
          <button
            type="button"
            onClick={startPasswordChange}
            className="text-indigo-600 hover:text-indigo-800"
            disabled={isSendingOtp}
          >
            <FaEdit size={18} />
          </button>
        )}
      </div>

      {!otpSent && !otpVerified && !showEmailConfirm ? (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <FaLock className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Password Protected</h3>
            <p className="text-sm text-gray-500">
              Click edit to change password
            </p>
          </div>
        </div>
      ) : showEmailConfirm ? (
        <div className="space-y-4">
          <div className="text-center mb-2">
            <h3 className="font-medium text-indigo-800">Confirm Your Email</h3>
            <p className="text-sm text-gray-600">
              We'll send a 6-digit OTP to this email
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={userEmail}
              // onChange={handleEmailChange}
              readOnly
              className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-gray-800 rounded-lg hover:bg-red-400"
              disabled={isSendingOtp}
            >
              <MdCancel className="inline mr-1" />
              Cancel
            </button>
            <button
              type="button"
              onClick={sendOTPEmail}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70"
              disabled={isSendingOtp || !userEmail}
            >
              {isSendingOtp ? (
                "Sending..."
              ) : (
                <>
                  <FiSend className="inline mr-1" />
                  Send OTP
                </>
              )}
            </button>
          </div>
        </div>
      ) : otpSent && !otpVerified ? (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-medium text-indigo-800">Verify Your Email</h3>
            <p className="text-sm text-gray-600 mt-1">
              We've sent a 6-digit OTP to {userEmail}
            </p>
          </div>

          <div className="flex justify-center my-6">
            <OtpInput
              value={enteredOtp}
              onChange={setEnteredOtp}
              numInputs={6}
              separator={<span className="mx-2"></span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-12 h-12 text-center text-lg font-medium border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              )}
              containerStyle="flex items-center justify-center gap-2"
              inputStyle={{
                width: "3rem",
                height: "3rem",
              }}
            />
          </div>

          <div className="text-center text-sm mt-4">
            <p className="text-indigo-800 font-medium">
              Time remaining: {formatTime(otpTimer)}
            </p>
            <button
              className={`text-indigo-600 mt-2 text-sm hover:underline ${
                isResendDisabled || isSendingOtp
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={sendOTPEmail}
              disabled={isResendDisabled || isSendingOtp}
            >
              {isSendingOtp
                ? "Sending..."
                : isResendDisabled
                ? `Resend OTP in ${formatTime(resendTimer)}`
                : "Resend OTP"}
            </button>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-gray-800 rounded-lg hover:bg-red-400"
              disabled={isVerifyingOtp}
            >
              <MdCancel className="inline mr-1" />
              Cancel
            </button>
            <button
              type="button"
              onClick={verifyOTP}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70"
              disabled={isVerifyingOtp || enteredOtp.length !== 6}
            >
              {isVerifyingOtp ? (
                "Verifying..."
              ) : (
                <>
                  <MdVerifiedUser className="inline mr-1" />
                  Verify OTP
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-medium text-green-600">
              OTP Verified Successfully!
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Please set your new password
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline-block mr-2 text-indigo-600" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                // placeholder="Minimum 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline-block mr-2 text-indigo-600" />
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Re-enter your password"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-gray-800 rounded-lg hover:bg-red-400"
              disabled={isUpdatingPassword}
            >
              <MdCancel className="inline mr-1" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePasswordSubmit}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70"
              disabled={
                isUpdatingPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordChangeCard;
