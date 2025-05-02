import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
} from "../controller/projectController.js";
import {
  getAllDomian,
  getAllTechnologies,
} from "../controller/domainTechController.js";
import { isStudent } from "../middleware/isStudent.js";
const router = express.Router();

router.post("/create", isStudent, createProject); //changes

router.get("/showAllProjects", isStudent, getAllProjects); // this is for card in which we are show short information // changes
router.get("/details/:projectId", isStudent, getProjectById);
// router.put('/:projectId', projectController.updateProject);
// router.post('/:projectId/approval', projectController.submitForApproval);
// router.put('/:projectId/status', projectController.updateStatus);
// router.post('/:projectId/documents', projectController.uploadDocument);
// router.get('/:projectId/documents', projectController.getDocuments);
router.get("/showAlldomains", isStudent, getAllDomian);
router.get("/showAlltechnologies", isStudent, getAllTechnologies);


export default router;
