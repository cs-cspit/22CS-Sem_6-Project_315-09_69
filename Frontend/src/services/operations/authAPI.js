import { authEndPoints } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice"
// import defaultAvatar from "../../assets/defaultAvatar/defaultAvatar.jpg"
import { ACCOUNT_TYPE } from "../../data/constants";
const { LOGIN_API ,SEND_OTP_API,VERIFY_OTP_API,UPDATE_PASSWORD_API } = authEndPoints;

// export function login(email, password, navigate) {
//   return async (dispatch) => {

//     dispatch(setLoading(true));

//     try {
//       const response = await apiConnector("POST", LOGIN_API, {
//         email,
//         password,
//       });

//       console.log("Login Response:", response);

//       if (!response) {
//           throw new Error(response.data.message || "login failed. Please try again.")
//       }

//       toast.success("Login successful!");
//       dispatch(setToken(response.data.token));
      
//       dispatch(
//         setUser({userData: response.data.userData,})
//       );

//       localStorage.setItem("token", JSON.stringify(response.data.token));
//       localStorage.setItem("user", JSON.stringify(response.data.userData))

//       const userType = response.data.userData?.userType;
//       if (userType === ACCOUNT_TYPE.STUDENT) {
//         navigate("/student/projects");
//       } else if (userType === ACCOUNT_TYPE.FACULTY) {
//         navigate("/faculty");
//       }
      
//     } catch (error) {
//       console.error("Login Error:", error);
//       toast.error(error.message || "Login failed. Please try again.");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// }

// Modified login function in authAPI.js


export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "login failed. Please try again.")
      }

      // First dispatch both actions to update the state
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.userData));

      // Then update localStorage
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.userData));

      toast.success("Login successful!");

      // Only navigate after state is updated
      const userType = response.data.userData?.userType;

      if (userType === ACCOUNT_TYPE.STUDENT) {
          navigate("/student/projects");
      } else if (userType === ACCOUNT_TYPE.FACULTY) {
          navigate("/faculty");
      }

    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response.data.message || "Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}

export const sendOtpForPasswordReset = async (data) => {
  try {
    const response = await apiConnector("POST", SEND_OTP_API, data, null);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to send OTP");
    }

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    toast.error(error.response?.data?.message || "Failed to send OTP");
    throw error;
  }
};

export const verifyOtpForPasswordReset = async (data) => {
  try {
    const response = await apiConnector("POST", VERIFY_OTP_API, data, null);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to verify OTP");
    }

    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    toast.error(error.response?.data?.message || "Invalid OTP");
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await apiConnector(
      "POST",
      UPDATE_PASSWORD_API,
      data,
      null
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to update password");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    toast.error(error.response?.data?.message || "Failed to update password");
    throw error;
  }
};