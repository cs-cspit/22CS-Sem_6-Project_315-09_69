import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const mailSender = async (email, title, body) => {
  // console.log('email', email);
  // console.log('title', title);
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);

  // console.log('body', body);
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error in mailSender:', error);
    throw error;
  }
};
