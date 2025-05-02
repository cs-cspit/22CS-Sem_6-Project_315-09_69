import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { otpEmailTemplate } from '../templates/otpTemplate.js';
import Student from '../model/Student.js';
import Faculty from '../model/Faculty.js';
import dotenv from 'dotenv';

dotenv.config();
// Configure nodemailer
// console.log(process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (req, res) => {
    try {
        const { email,userType} = req.body;
        console.log("email password",req.body);
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        // Check if user exists based on userType
        let user;
        if (userType === 'student') {
            user = await Student.findOne({ email });
        } else if (userType === 'faculty') {
            user = await Faculty.findOne({ email });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user type' 
            });
        }
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Generate OTP
        const otp = generateOTP();

        console.log('OTP:=',otp);
        
        // Create JWT token with OTP, user email, and userType
        const token = jwt.sign(
            { email, otp, userType },
            process.env.JWT_SECRET,
            { expiresIn: '50s' } // OTP valid for 1 minutes
        );
        console.log('Token:',token);
        
        // Send email with OTP
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            html: otpEmailTemplate(otp)
        });
        console.log("hello");
        // Send token in response (but not the OTP)
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            token // Client needs to send this token back during verification
        });
        
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { token, otp } = req.body;
        
        if (!token || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Token and OTP are required'
            });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token invalid or expired'
            });
        }
        
        // Compare OTP
        if (decoded.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }
        
        // Generate a new token for password reset (without OTP)
        const resetToken = jwt.sign(
            { email: decoded.email, userType: decoded.userType },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Give them 15 minutes to reset password
        );
        
        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            resetToken
        });
        
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message
        });
    }
};


export const updatePassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Reset token and new password are required'
            });
        }
        
        // Verify the reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Reset token invalid or expired'
            });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update the user's password based on userType
        let updateResult;
        if (decoded.userType === 'student') {
            updateResult = await Student.findOneAndUpdate(
                { email: decoded.email },
                { password: hashedPassword }
            );
        } else if (decoded.userType === 'faculty') {
            updateResult = await Faculty.findOneAndUpdate(
                { email: decoded.email },
                { password: hashedPassword }
            );
        }
        
        if (!updateResult) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
        
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update password',
            error: error.message
        });
    }
};