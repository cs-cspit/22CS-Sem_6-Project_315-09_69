import Faculty from "../model/Faculty.js";
import Project from "../model/Project.js";
import Group from "../model/Group.js";
import Technology from "../model/Technology.js";
import Student from "../model/Student.js";
import { createGroup } from "./groupController.js";
import { projectApprovalTemp } from "../templates/projectApprovalTemplate.js";
import dotenv from "dotenv";
import { mailSender } from "../util/mailSender.js";
import Rubrics from '../model/Rubrics.js';

dotenv.config();

// Helper function to format student info
const formatStudentInfo = (students, leaderId) => {
  return students.map((student) => ({
    name: `${student.profile.name}`,
    id: student.studentId,
    isLeader: student.studentId === leaderId,
  }));
};

export const sendProjectApprovalEmail = async (mailcontent) => {
  const studentInfo = formatStudentInfo(
    mailcontent.students,
    mailcontent.leaderId
  );

  // Generate the HTML email template using the projectApproval function
  const emailTemplate = projectApproval({
    title: mailcontent.title,
    type: mailcontent.type,
    domain: mailcontent.domain,
    academicYear: mailcontent.academicYear,
    studentInfo: studentInfo,
    technologies: mailcontent.technologies,
    semester: mailcontent.semester,
  });

  try {
    // Use the modularized mailSender function to send the email
    const response = await mailSender(
      mailcontent.mentor.email,
      "Project Mentorship Request - Academic Year 2023-24",
      emailTemplate
    );
    // console.log('Project approval email sent successfully:', response);
    return true;
  } catch (error) {
    throw new Error(`Error sending project approval email: ${error.message}`);
  }
};

export const createProject = async (req, res) => {
  try {
    const leaderId = req.user.studentID;
    const {
      mentorId, // dynamically sent from frontend
      groupId, // dynamically sent from frontend
      title,
      domain,
      technologies,
      description,
      githubRepoLink,
      type,
      researchArea,
      startDate,
      endDate,
    } = req.body;

    // Validate domain
    const domainDoc = await Technology.findOne({ domain });
    if (!domainDoc) {
      return res.status(400).json({ 
        success: false,
        message: `Domain ${domain} not found `
      });
    }

    // Prepare selected technologies with validation
    const selectedTechnologies = await Promise.all(
      technologies.map(async (techName) => {
        const techDoc = await Technology.findOne({
          domain,
          "technologies.name": techName,
        });

        if (techDoc) {
          const techDetails = techDoc.technologies.find(
            (t) => t.name === techName
          );
          return {
            technologyId: techDoc._id,
            name: techName,
            category: techDetails.category,
            isCustom: false,
          };
        }

        return {
          name: techName,
          isCustom: true,
          customInput: techName,
        };
      })
    );

    const allStudentIds = await Group.findOne({ _id: groupId }).select(
      "members.studentId -_id"
    );

    // Extract studentId values from the members array
    const studentIds = allStudentIds.members.map((member) => member.studentId);
    console.log("student : -", studentIds);

    // Fetch students by studentId using $in query
    const students = await Student.find({ _id: { $in: studentIds } });

    const mentor = await Faculty.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success:false, message: "Mentor not found" });
    }

    const group = await Group.findById({ _id: groupId });

    // Destructure department, semester, and academicYear
    const { department, semester, academicYear } = group;

    const project = new Project({
      groupId,
      title,
      domain: domainDoc._id,
      technologies: selectedTechnologies,
      // researchArea,
      description,
      githubRepoLink,
      type,
      mentor: mentorId,
      startDate,
      endDate,
      isSGPProject: type === "SGP",
      isOtherProject: type === "Other Project",
    });

    await project.save();

    await Group.findByIdAndUpdate(
      groupId,
      {
        projectId: project._id,
      },
      { new: true }
    );

    // Add the project to each team member's projectList, including the leader
    await Student.updateMany(
      { _id: { $in: studentIds } },
      {
        $push: {
          projectList: {
            groupId,
            projectId: project._id,
          },
        },
      },
      { new: true }
    );

    // const mailContent = {
    //   mentor,
    //   students,
    //   leaderId, // comparing
    //   title,
    //   type,
    //   department,
    //   semester,
    //   academicYear,
    //   domain,
    //   technologies, // from input
    // };

    // await sendProjectApprovalEmail(mailContent);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.studentID;
    console.log(userId);
    

    const student = await Student.findOne({ studentId: userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.populate({
      path: "projectList.groupId",
      populate: [
        { path: "mentor", select: "profile.name" },
        {
          path: "members.studentId",
          select: "studentId department batch",
        },
      ],
    });

    await student.populate({
      path: "projectList.projectId",
      populate: [
        {
          path: "domain",
          select: "domain",
        },
        {
          path: "technologies.technologyId",
          select: "name category",
        },
        {
          path: "comments.facultyId",
          select: "profile.name",
        },
      ],
    });

    console.log(student);
    
    const approvedProjects = [];
    const rejectedProjects = [];
    const pendingProjects = [];
    const revisionalProjects = [];

    student.projectList.forEach((projectEntry) => {
      const group = projectEntry.groupId;
      const project = projectEntry.projectId;

      // Process technologies
      const technologies = project?.technologies || [];
      const uniqueTechnologies = [
        ...new Set(
          technologies.map(
            (tech) =>
              tech.technologyId?.name || tech.name || "Unknown Technology"
          )
        ),
      ];

      // Get first comment if exists
      const firstComment =
        project?.comments && project.comments.length > 0
          ? {
              comment: project.comments[project.comments.length - 1].comment,
              createdAt: project.comments[project.comments.length - 1].createdAt,
            }
          : null;

      const projectData = {
        projectDetails: {
          projectId: project.id || "null",
          title: project?.title || "Unknown Title",
          type: project?.type || "Unknown Type",
          approvalStatus: project?.approvalStatus || "Pending",
          status: project?.status || "Not Available",
          githubRepoLink: project?.githubRepoLink || "Not Provided",
          description: project?.description || "No description available",
          startDate: project?.startDate || null,
          endDate: project?.endDate || null,
          domain: project?.domain?.domain || "Unknown Domain",
          technologies: uniqueTechnologies,
          firstComment: firstComment,
          isRevisionalResubmitted: project?.isRevisionalResubmitted,
        },
        groupDetails: {
          mentor: group?.mentor?.profile?.name || "No mentor assigned",
          academicYear: group?.academicYear || "Unknown Year",
          semester: group?.semester || "Unknown Semester",
          members:
            group?.members?.map((member) => ({
              studentId: member.studentId?.studentId || "Unknown ID",
              isLeader: member.isLeader || false,
              department: member.studentId?.department || "Unknown Department",
              batch: member.studentId?.batch || "Unknown Batch",
            })) || [],
        },
      };

      // Categorize projects by approvalStatus
      switch (project?.approvalStatus) {
        case "Approved":
          approvedProjects.push(projectData);
          break;
        case "Rejected":
          rejectedProjects.push(projectData);
          break;
        case "Revision":
          revisionalProjects.push(projectData);
          break;
        default:
          pendingProjects.push(projectData);
          break;
      }
    });

    res.status(200).json({
      success: true,
      projectList: {
        approvedProjects,
        rejectedProjects,
        pendingProjects,
        revisionalProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};
//project entire details
export const getProjectById = async (req, res) => {
  try {
    const userId = req.user.studentID; // Get the student's ID 22cs009
    const projectId = req.params.projectId; // Extract the project ID from params

    // Fetch the student details along with the required project
    const student = await Student.findOne({ studentId: userId })
      .populate({
        path: "projectList.groupId",
        populate: [
          { path: "mentor", select: "profile.name" },
          {
            path: "members.studentId",
            select: "studentId department batch",
          },
        ],
      })
      .populate({
        path: "projectList.projectId",
        populate: [
          {
            path: "domain",
            select: "domain",
          },
          {
            path: "technologies.technologyId",
            select: "name category",
          },
        ],
      });

    if (!student || !student.projectList.length) {
      return res
        .status(404)
        .json({ success:false, message: "No projects found for this student." });
    }

    // Find the project with the specific ID
    const projectEntry = student.projectList.find(
      (entry) => entry.projectId._id.toString() === projectId
    );

    if (!projectEntry) {
      return res.status(404).json({ success:false, message: "Project not found." });
    }

    const group = projectEntry.groupId;
    const project = projectEntry.projectId;

    // Process technologies
    const technologies = project?.technologies || [];
    const uniqueTechnologies = [
      ...new Set(
        technologies.map(
          (tech) => tech.technologyId?.name || tech.name || "Unknown Technology"
        )
      ),
    ];

    // Prepare the response
    const projectData = {
      projectDetails: {
        title: project?.title || "Unknown Title",
        type: project?.type || "Unknown Type",
        approvalStatus: project?.approvalStatus || "Pending",
        status: project?.status || "Not Available",
        githubRepoLink: project?.githubRepoLink || "Not Provided",
        description: project?.description || "No description available",
        startDate: project?.startDate || null,
        endDate: project?.endDate || null,
        domain: project?.domain?.domain || "Unknown Domain",
        technologies: uniqueTechnologies,
      },
      groupDetails: {
        groupId: group?.groupId || "Unknown Group ID",
        mentor: group?.mentor?.profile?.name || "No mentor assigned",
        academicYear: group?.academicYear || "Unknown Year",
        semester: group?.semester || "Unknown Semester",
        members:
          group?.members?.map((member) => ({
            studentId: member.studentId?.studentId || "Unknown ID",
            isLeader: member.isLeader || false,
            department: member.studentId?.department || "Unknown Department",
            batch: member.studentId?.batch || "Unknown Batch",
          })) || [],
      },
    };

    res.status(200).json({ success: true, projectData });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching the project",
      error: error.message,
    });
  }
};

export const projectApproval = async (req, res) => {
  try {
    const userId = req.user.facultyId; // Logged-in user's facultyId
    const { projectId } = req.params; // Project ID from the URL
    const { status, comment } = req.body; // Extracting status and optional comment

    console.log("Received Data:", req.body);

    if (!["Approved", "Rejected", "Revision"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    // Find the project by ID
    const project = await Project.findById(projectId)
      .populate({ path: "mentor", select: "_id avatar.name facultyId" })
      .populate({
        path: "groupId",
        select: "semester academicYear department",
      });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    console.log(project);
    // Check if the logged-in user is the mentor for the project
    if (project.mentor.facultyId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to approve/reject this project",
      });
    }

    // Prepare the update data
    const updateData = { approvalStatus: status };

    // Handle rubric assignment for approved projects
    if (status === "Approved") {
      // Get the project's semester, academicYear, and department
      const { semester, academicYear, department } = project.groupId;

      // Find the corresponding Rubric
      const rubric = await Rubrics.findOne({
        semester,
        academicYear,
        department,
      });

      if (!rubric) {
        return res.status(400).json({
          success: false,
          message:
            "No rubric found for the given semester, academicYear, and department",
        });
      }

      updateData.rubricsId = rubric._id; // Assign the found rubric ID
    }else if(status === "Revision"){
      updateData.isRevisionalResubmitted = false;

    } else {
      // For Rejected or Needs Revision, set rubricId to null
      updateData.rubricsId = null;
    }

    // Update the project with the new status and rubric
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true }
    );

    // If comment is provided, add it to the comments array
    if (comment) {
      await Project.findByIdAndUpdate(projectId, {
        $push: {
          comments: {
            facultyId: project.mentor._id,
            comment: comment,
            createdAt: new Date(),
          },
        },
      });
    }

    // Get the updated project with populated fields
    const finalProject = await Project.findById(projectId)
      .populate({ path: "mentor", select: "facultyId name" })
      .populate({
        path: "groupId",
        select: "semester academicYear department",
      });

    // Prepare a descriptive message based on the status
    let message = "";
    switch (status) {
      case "Approved":
        message = "Project has been approved successfully";
        break;
      case "Rejected":
        message = "Project has been rejected";
        break;
      case "Revision":
        message = "Project requires revision based on faculty feedback";
        break;
    }

    res.status(200).json({
      success: true,
      message: message,
      project: finalProject,
    });
  } catch (error) {
    console.error("Error in projectApproval:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal server error",
      });
  }
};



