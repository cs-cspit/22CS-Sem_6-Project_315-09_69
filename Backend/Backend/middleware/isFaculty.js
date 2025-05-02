import jwt from "jsonwebtoken";
import Faculty from "../model/Faculty.js";

export const isFaculty = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    const faculty = await Faculty.findById(decoded.id);
    
    req.user.facultyId = faculty.facultyId;

    if (!faculty) {
      return res.status(404).json({ success:false, message: "User not found." });
    }

    if (req.user.type !== "faculty") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. User is not a faculty." });
    }

    next();
  } catch (err) {
    // console.error(err);
    res.status(400).json({ success:false, message: "Invalid token." });
  }
};

export const isCoordinator = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const faculty = await Faculty.findById(decoded.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!faculty.isCoordinator) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a Course Coordinator for SGP.",
      });
    }

    // Get the current coordinator information from coordinatorHistory
    // We assume the latest entry is the current one
    const currentCoordinatorInfo =
      faculty.coordinatorHistory.length > 0
        ? faculty.coordinatorHistory[faculty.coordinatorHistory.length - 1]
        : null;

    if (!currentCoordinatorInfo) {
      return res.status(400).json({
        success: false,
        message: "Missing coordinator information.",
      });
    }

    req.user = {
      id: faculty._id,
      facultyId: faculty.facultyId,
      isCoordinator: faculty.isCoordinator,
      semester: currentCoordinatorInfo.semester,
      academicYear: currentCoordinatorInfo.academicYear,
    };

    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};