import express from "express";

import { createGroup, getGroupMembers } from "../controller/groupController.js";
import { isStudent } from "../middleware/isStudent.js";
const router = express.Router();

router.post("/create", isStudent, createGroup);
// router.patch('/invitation',isStudent, groupInvitation);
// router.post('/:groupId/invite',isStudent,sendInvitation);
router.get("/groupMembers/:projectId", isStudent, getGroupMembers);

export default router;
