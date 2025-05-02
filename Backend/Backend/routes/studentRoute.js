import {
  getAllStudents,
  getAllRemaining,
  updateRejectedProject,
  updateRevisionalProject,
  getStudentProfile,
  updateProfile,
} from "../controller/studentController.js";
import { technologyAPI } from '../controller/domainTechController.js';
import uploadMiddleware from "../middleware/multerMiddlewear.js";
import { isStudent } from '../middleware/isStudent.js'; 
import { addWeeklyReport } from "../controller/weeklyReportController.js";
import { getWeeklyReportsByProjectId, getEvluatedWeeklyReportDetails, } from "../controller/weeklyReportController.js";
import express from 'express';

const  router = express.Router();

// Corrected typo in '/lout' to '/logout'
router.get('/',isStudent ,getAllStudents);
router.get("/profile", isStudent, getStudentProfile);
router.patch("/updateProfile", isStudent, uploadMiddleware, updateProfile);
router.post("/create/weeklyReport/:projectId", isStudent, addWeeklyReport);
router.post("/remaining", isStudent, getAllRemaining);
router.get("/weeklyReport/:projectId", isStudent, getWeeklyReportsByProjectId);  // to show weekly report's card's at student dashboard
router.get('/evluateWeeklyReportDetails/:weeklyReportId', isStudent, getEvluatedWeeklyReportDetails);
router.patch('/update/rejectedProject/:projectId',isStudent,updateRejectedProject)
router.patch('/update/revisionalProject/:projectId', isStudent, updateRevisionalProject)

router.get('/technologyAPI',technologyAPI);
export default router;
