import Group from '../model/Group.js';
import Student from '../model/Student.js';
import Faculty from '../model/Faculty.js';
import { groupInvitation } from '../templates/InvitationTemplate.js';
// import { mailSender } from '../../util/mailSender.js'; 

export const validateGroupCreation = async (groupInfo) => {
  const {
    mentorName,
    studentIds,
    semester,
    academicYear,
    department,
    leaderId,
  } = groupInfo;

  const errors = [];

  // Basic field validation
  if (!mentorName) errors.push("Mentor name is required");
  if (!semester) errors.push("Semester is required");
  if (!academicYear) errors.push("Academic year is required");
  if (!department) errors.push("Department is required");
  if (!leaderId) errors.push("Leader ID is required");
  // if (!projectType) errors.push("Project type is required");
  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    errors.push("Student IDs must be a non-empty array");
  }
  // If there are basic validation errors, return early
  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  // Project type validation
  // if (!["SGP", "Open Project"].includes(projectType)) {
  //   throw new Error("Invalid project type. Must be either 'SGP' or 'Open Project'");
  // }

  const academicYearRegex = /^20\d{2}-\d{2}$/;
  if (!academicYearRegex.test(academicYear)) {
    throw new Error(
      "Invalid academic year format. Should be YYYY-YY (e.g., 2024-25)"
    );
  }

  const validDepartments = ["CS", "IT", "CE", "AI-ML", "MultiDisciplinary"];
  if (!validDepartments.includes(department)) {
    throw new Error("Invalid department");
  }

  // Check for duplicate student IDs
  const allStudentIds = [...studentIds, leaderId];
  const uniqueStudentIds = new Set(allStudentIds);
  if (uniqueStudentIds.size !== allStudentIds.length) {
    throw new Error("Duplicate student IDs found");
  }

  // Verify all students exist and are from the same semester (for SGP)
  const students = await Student.find({ studentId: { $in: allStudentIds } });

  if (students.length !== allStudentIds.length) {
    const missingIds = allStudentIds.filter(
      (id) => !students.some((s) => s.studentId === id)
    );
    throw new Error(
      `The following student IDs are invalid: ${missingIds.join(", ")}`
    );
  }

  return true;
};

export const createGroup = async (req, res) => {
  try {
    const { mentorName,projectType,studentIds, semester, academicYear, department } = req.body;

    console.log(req.body);
    const leaderId = req.user.studentID;
    await validateGroupCreation({ ...req.body, leaderId });
    // mentorName,projectType,studentIds, semester, academicYear, department
    // Fetch students and verify their existence
    const allStudentIds = [...studentIds, leaderId];
    const students = await Student.find({
      studentId: { $in: allStudentIds },
    }).select("_id studentId");

    if (students.length !== allStudentIds.length) {
      const missingIds = allStudentIds.filter(
        (id) => !students.some((s) => s.studentId === id) // filter return entry if condition is true
        // we are use some becaue we want to find missing id like in datbase 22cs001 is not present so !(it will return) true =>not present
        // so in our case  this is (!students.some((s) => s.studentId === id) condition of filter method
      );
      return res.status(404).json({
        success: false,
        message: `The following student IDs were not found: ${missingIds.join(", ")}`
      })
    }
    console.log("Verified students:", students);

    // Verify mentor exists
    const mentor = await Faculty.findOne({ "profile.name": mentorName });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'mentor not found'
      })
    }

    // Check for conflicting groups if project type is 'SGP'
    if (projectType === "SGP") {
      const conflictingGroups = await Group.find({
        semester,
        academicYear,
        "members.studentId": { $in: students.map((s) => s._id) },
      }).populate({
        path: "projectId",
        match: { type: "SGP" }, // Only check SGP projects
        select: "type", // Fetch only the type field
      });
      // console.log(conflictingGroups);
      // Filter out non-SGP groups
      const sgpConflicts = conflictingGroups.filter((group) => group.projectId);

      if (sgpConflicts.length > 0) {
        const conflictingMembers = sgpConflicts.flatMap((group) =>
          group.members
            .filter((member) =>
              students.some((s) => s._id.equals(member.studentId))
            )
            .map(
              (member) =>
                students.find((s) => s._id.equals(member.studentId)).studentId
            )
        );

        return res.status(501).json({
          success: false,
          message:`Members ${conflictingMembers.join(", ")} are already in SGP group for semester ${semester} of ${academicYear}`
        })
      }
    }

    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    console.log("projectType - ",projectType)
    const cusGroupId =
    projectType === "SGP"
        ? `SGP_${department}_${mentor.profile.bio}_${academicYear}_${semester}_${uniqueNumber}`
        : `OTHER_${mentor.profile.bio}_${academicYear}_${uniqueNumber}`;


    
    // Create the group
    const group = await Group.create({
      groupId:cusGroupId,
      department,
      semester,
      academicYear,
      mentor: mentor._id,
      members: [
        {
          studentId: students.find((s) => s.studentId === leaderId)._id,
          isLeader: true,
          joinedAt: new Date(),
        },
        ...studentIds.map((id) => ({
          studentId: students.find((s) => s.studentId === id)._id,
          isLeader: false,
          joinedAt: new Date(),
        })),
      ],
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      groupId: group._id,
      mentorName: mentorName,
      mentorId: mentor._id,
      studentIds: allStudentIds,
    });

  } catch (error) {

    console.error("Error creating group:", error.message);
    // throw new Error(error.message || "Error creating group");
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log(projectId);
    

    const group = await Group.findOne({ projectId }).populate({
      path: "members.studentId",
      model: "Student",
      select: "studentId",
    });

    console.log(group);
    

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found for this project",
      });
    }

    const studentIds = group.members.map((member) => member.studentId.studentId);

      console.log(studentIds);
      

    return res.status(200).json({
      success: true,
      data: {
        studentIds,
        count: studentIds.length,
      },
    });
  } catch (error) {
    console.error("Error in getProjectMembers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


