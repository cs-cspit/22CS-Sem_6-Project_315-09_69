import Student from "../model/Student.js";
import Group from "../model/Group.js";
import Project from "../model/Project.js";
import Technology from "../model/Technology.js";

export const getAllStudents = async (req, res) => {
  try {
    const allStudents = await Student.find().select(
      "profile.name email department"
    );
    res.status(200).json({ success: true, allStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.studentID;
    console.log(userId);
    const { name, contact, bio, batch, semester } = req.body;

    const avatar = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/studentImages/${
          req.file.filename
        }`
      : undefined;
    console.log(avatar);
    const student = await Student.findOne({ studentId: userId });

    if (!student) return res.status(404).json({ success:true, message: "Student not found" });

    student.profile.name = name || student.profile.name;
    student.profile.contact = contact || student.profile.contact;
    student.profile.bio = bio || student.profile.bio;
    student.semester = semester || student.semester;
    student.batch = batch || student.batch;
    if (avatar) student.profile.avatar = avatar;

    await student.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Profile updated successfully",
        student,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

export const getAllRemaining = async (req, res) => {
  try {
    const { batch, department, academicYear, semester } = req.body
    const loggedInStudentID = req.user.studentID; // Extract studentID from middleware
    console.log(req.body);
    

    if (!batch || !department || !academicYear || !semester) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required query parameters.",
        });
    }

    const semesterInt = parseInt(semester);

    // Step 1: Fetch all students in the given batch, department, and semester
    const students = await Student.find({
      batch,
      department,
      semester: semesterInt,
    }).select("studentId projectList department batch").sort({studentId:1});

    const remainingStudents = [];

    for (const student of students) {
      if (student.studentId === loggedInStudentID) {
        continue; // Skip the logged-in student
      }

      if (!student.projectList || student.projectList.length === 0) {
        //  If student has no project → Allow
        remainingStudents.push({
          studentId: student.studentId,
          department: student.department,
          batch: student.batch,
        });
        continue;
      }

      let allowStudent = true; // Assume student is allowed

      for (const entry of student.projectList) {
        const group = await Group.findById(entry.groupId).select(
          "semester projectId"
        );

        if (group && group.semester === semesterInt) {
          // Step 2: If group is from **current semester**, check project type
          const project = await Project.findById(group.projectId).select(
            "type"
          );

          if (project && project.type === "SGP") {
            // If it's an SGP project in the current semester, student is NOT allowed
            allowStudent = false;
            break;
          }
        }
      }

      if (allowStudent) {
        remainingStudents.push({
          studentId: student.studentId,
          department: student.department,
          batch: student.batch,
        });
      }
    }

    res.status(200).json({ success: true, remainingStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateRejectedProject = async (req, res) => {
  try {
    const leaderId = req.user.studentID;
    const projectId = req.params.projectId;

    const {
      title,
      domain,
      technologies,
      description,
      githubRepoLink,
      startDate,
      endDate,
    } = req.body;

    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Validate domain if provided
    let domainId = existingProject.domain;
    if (domain) {
      const domainDoc = await Technology.findOne({ domain });
      if (!domainDoc) {
        return res
          .status(400)
          .json({ success: false, message: `Domain ${domain} not found` });
      }
      domainId = domainDoc._id;
    }

    // Prepare selected technologies with validation if provided
    let selectedTechnologies = existingProject.technologies;
    if (technologies) {
      selectedTechnologies = await Promise.all(
        technologies.map(async (techName) => {
          const techDoc = await Technology.findOne({
            domain: domainId,
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
          return { name: techName, isCustom: true, customInput: techName };
        })
      );
    }

    // Update the project with provided fields
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title: title || existingProject.title,
        domain: domainId,
        technologies: selectedTechnologies,
        // researchArea: researchArea || existingProject.researchArea,
        description: description || existingProject.description,
        githubRepoLink: githubRepoLink || existingProject.githubRepoLink,
        startDate: startDate || existingProject.startDate,
        endDate: endDate || existingProject.endDate,
        approvalStatus: "Pending", // Reset status to pending after update
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

export const updateRevisionalProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, domain, description, githubRepoLink, technologies } =
      req.body;

    console.log(req.body);

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update simple fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.githubRepoLink = githubRepoLink || project.githubRepoLink;
    project.isRevisionalResubmitted = true;

    // Handle domain - find the Technology document with this domain name
    if (domain) {
      const domainDoc = await Technology.findOne({ domain });
      if (!domainDoc) {
        return res.status(400).json({
          success: false,
          message: `Domain ${domain} not found`,
        });
      }
      project.domain = domainDoc._id; // Set the ObjectId, not the string
    }

    // Handle technologies - convert string array to required object structure
    if (technologies && technologies.length > 0) {
      // If technologies is an array of strings
      if (typeof technologies[0] === "string") {
        const techObjects = await Promise.all(
          technologies.map(async (techName) => {
            // Find the technology in the database
            const techDoc = await Technology.findOne({
              "technologies.name": techName,
            });

            if (techDoc) {
              // Find the specific technology details in the found document
              const techDetails = techDoc.technologies.find(
                (t) => t.name === techName
              );

              return {
                technologyId: techDoc._id,
                name: techName,
                category: techDetails.category,
                isCustom: false,
              };
            } else {
              // If not found, create as custom technology
              return {
                name: techName,
                isCustom: true,
                customInput: techName,
              };
            }
          })
        );

        project.technologies = techObjects;
      }
      // If technologies is already in the correct format
      else if (typeof technologies[0] === "object") {
        project.technologies = technologies;
      }
    }

    // Save the updated project
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    console.log("Middleware extracted studentID:", req.user.studentID);
    const studentId = req.user.studentID; // Ensure middleware is passing this correctly

    const data = await Student.findOne({ studentId })
      .select("-groupInvitations -createdAt -updatedAt")
      .populate({
        path: "projectList.projectId",
        select: "approvalStatus status type",
      });

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const approvedProjectsByType = (data.projectList || []).reduce(
      (counts, project) => {
        if (project.projectId?.approvalStatus === "Approved") {
          const type = project.projectId.type || "Other";
          counts[type] = (counts[type] || 0) + 1;
        }
        return counts;
      },
      {}
    );

    res.status(200).json({
      success: true,
      data: {
        profile: {
          ...data.profile,
          projectCounts: approvedProjectsByType,
        },
        studentId: data.studentId,
        email: data.email,
        department: data.department,
        semester: data.semester,
        batch: data.batch,
        batchYear: data.batchYear,
        skills: data.skills,
      },
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};