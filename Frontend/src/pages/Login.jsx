import React, { useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import loginImg from "../assets/loginPage/image.png";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../services/operations/authAPI";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Show loader
      try {
        await dispatch(login(email.toLowerCase(), password, navigate));
      } finally {
        setLoading(false); // Hide loader after request
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#170F49] overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="loader"></div>
          </div>
        </div>
      )}

      {/* Left Section (Animated) */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full lg:w-5/12 p-4 sm:p-8 lg:p-12 flex flex-col justify-center"
      >
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-poppins tracking-wide h-10 mb-4 lg:mb-0">
            <TypeAnimation
              sequence={[
                "Start managing your project.",
                2000,
                "Track and submit your work.",
                2000,
                "Collaborate with your team.",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h2>
          <div className="relative w-full flex justify-center items-center mt-4 lg:mt-0">
            <img
              src={loginImg}
              alt="Project Management Illustration"
              className="w-full h-auto max-w-lg mx-auto opacity-90"
            />
          </div>
        </div>
      </motion.div>

      {/* Right Section (Animated) */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full lg:flex-1 bg-white rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-l-[2.5rem] p-6 sm:p-8 lg:p-12 flex flex-col justify-center"
      >
        <div className="max-w-xl w-full mx-auto">
          <h2 className="text-black text-xl sm:text-2xl font-semibold mb-6 lg:mb-12 text-center font-poppins tracking-wider">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your ID
              </label>
              <input
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 lg:py-5 rounded-md bg-[#e4e2ff] border-0 focus:ring-2 focus:ring-[#329bec]"
                placeholder="Enter your ID"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleChange}
                className="w-full px-4 py-3 lg:py-5 rounded-md bg-[#e4e2ff] border-0 focus:ring-2 focus:ring-[#329bec]"
                placeholder="Enter your Password"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[38px] lg:top-[46px] z-[5] bg-transparent cursor-pointer"
              >
                {showPassword ? (
                  <IoMdEye
                    fontSize={24}
                    className="sm:text-[28px]"
                    color="#AFB2BF"
                  />
                ) : (
                  <IoMdEyeOff
                    fontSize={24}
                    className="sm:text-[28px]"
                    color="#AFB2BF"
                  />
                )}
              </span>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full font-poppins font-semibold bg-[#4318FF] text-white tracking-widest py-3 lg:py-5 px-4 rounded-md hover:bg-[#3311CC] transition-colors duration-200 mt-6 lg:mt-8"
            >
              LOGIN
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
