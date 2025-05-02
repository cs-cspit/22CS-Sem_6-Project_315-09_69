import jwt from "jsonwebtoken";
import Student from "../model/Student.js";

export const isStudent = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(req.user);

    const student = await Student.findById(decoded.id);

    req.user.studentID = student.studentId;

    // console.log(req.user);
    if (!student) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.user.type !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. User is not a student." });
    }
    // console.log(req.user)
    next();
  } catch (err) {
    // console.error(err);
    res.status(400).json({ message: "Invalid token." });
  }
};
