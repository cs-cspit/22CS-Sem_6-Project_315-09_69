import { login, logout } from "../controller/authController.js";
import {
  sendOtp,
  verifyOtp,
  updatePassword,
} from "../controller/otpController.js";
import express from "express";

const router = express.Router();

// Corrected typo in '/lout' to '/logout'
router.post("/login", login);
router.post("/logout", logout);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/update-password", updatePassword);

export default router;
