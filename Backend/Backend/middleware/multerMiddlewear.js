import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directories
const studentUploadDir = path.join(__dirname, "..", "uploads", "studentImages");
const facultyUploadDir = path.join(__dirname, "..", "uploads", "facultyImages");

// Create directories if they don't exist
if (!fs.existsSync(studentUploadDir))
  fs.mkdirSync(studentUploadDir, { recursive: true });
if (!fs.existsSync(facultyUploadDir))
  fs.mkdirSync(facultyUploadDir, { recursive: true });

// Define Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log('🔹 Uploading file for user:', req.user); // Debugging log
    const uploadPath =
      req.user.type === "faculty" ? facultyUploadDir : studentUploadDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // console.log('📂 Storing file:', file.originalname);
    const userId =
      req.user.type === "faculty" ? req.user.facultyId : req.user.studentID;
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    console.log(userId);
    cb(null, `${userId}-${timestamp}${fileExtension}`);
  },
});

// Multer configuration
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // console.log('🔍 Checking file type:', file.mimetype); // Debugging log
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(
        new Error(
          JSON.stringify({
            success: false,
            message: "Only JPEG, JPG, or PNG images are allowed",
          })
        )
      );
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).single("avatar"); // Ensure field name is 'avatar'

// Middleware to handle Multer errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // console.error('❌ Multer Error:', err); // Debugging log
      let errorMessage = "File upload failed";
      try {
        errorMessage = JSON.parse(err.message);
      } catch (e) {
        errorMessage = { success: false, message: err.message };
      }
      console.log("in uploadMiddleware ",errorMessage);
      return res.status(400).json(errorMessage);
    }
    console.log('✅ File uploaded successfully'); // Debugging log
    next();
  });
};

export default uploadMiddleware;
