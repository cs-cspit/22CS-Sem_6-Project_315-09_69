import express from "express";
import { isFaculty, isCoordinator } from "../middleware/isFaculty.js";
import {
  getAllFaculties,
  updateProfile,
  getSGPProjects,
  getOtherProjects,
  getProjectDetails,
  createRubrics,
  getRubrics,
  getAcademicYear,
  getFacultyProfile,
  checkRubricsExistence,
} from "../controller/facultyContoller.js";

import { projectApproval } from "../controller/projectController.js";

import {
  getWeeklyReportDetails,
  getWeeklyReportsByMentor,
  evaluateWeeklyReport,
} from "../controller/weeklyReportController.js";

import uploadMiddleware from "../middleware/multerMiddlewear.js";
const router = express.Router();

router.get("/showAllFaculty", getAllFaculties); // Faculty names

router.get("/sgpProjects", isFaculty, getSGPProjects); // projects under member (query) - card formate
router.get("/openProjects/", isFaculty, getOtherProjects); // projects under member (query)

router.get("/showProjectDetails/:projectId", isFaculty, getProjectDetails); // entire ProjectDetail
router.get("/project/weeklyReport/:reportId", isFaculty, getWeeklyReportDetails); // get entire weeklyReport Details
router.get("/weeklyReportsSubmissions", isFaculty, getWeeklyReportsByMentor);

router.post("/evaluateWeeklyReport/:weeklyReportId", isFaculty, evaluateWeeklyReport); // evaluate weekly report

router.patch("/projectApproval/:projectId", isFaculty, projectApproval); //project approval

router.post("/create/rubrics", isCoordinator, createRubrics); // create rubrics
router.get("/project/weeklyReport/rubrics/:weeklyReportId", getRubrics); // get rubrics (that we are display on weekly report)
router.get("/check-rubrics", isFaculty, checkRubricsExistence);

router.get("/getAcademicYears", getAcademicYear);


router.get("/getProfile", isFaculty, getFacultyProfile); //get faculty profile
router.patch("/updateProfile", isFaculty, uploadMiddleware, updateProfile); //update faculty profile

export default router;
