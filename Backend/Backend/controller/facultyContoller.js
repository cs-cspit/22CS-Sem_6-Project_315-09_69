import Project from "../model/Project.js";
import Rubrics from "../model/Rubrics.js";
import Faculty from "../model/Faculty.js";
import Group from "../model/Group.js";
import WeeklyReport from "../model/WeeklyReport.js";
import Student from "../model/Student.js"

export const createRubrics = async (req, res) => {
  try {
    const { semester, academicYear, criteria, department } = req.body;
    const createdBy = req.user.id; // Extracting faculty ID from the authenticated user

    // Validation: Check if all required fields are provided
    if (!semester || !academicYear || !criteria || criteria.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (semester, academicYear, criteria) are required, and criteria should not be empty.",
      });
    }

    // Check if user is a Course Coordinator for this semester and academic year
    if (
      !req.user.isCoordinator ||
      req.user.semester !== semester ||
      req.user.academicYear !== academicYear
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not the Course Coordinator for this semester and academic year.",
      });
    }

    // Create Rubric document
    const newRubric = new Rubrics({
      semester,
      academicYear,
      criteria,
      createdBy,
      department,
    });

    // Save rubric to the database
    await newRubric.save();

    res
      .status(201)
      .json({ success: true, message: "Rubric created successfully.", rubric: newRubric });
  } catch (error) {
    console.error("Error creating rubric:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getRubrics = async (req, res) => {
  try {
    const reportId = req.params.weeklyReportId;

    // Find the report and populate the rubricsId field directly
    const report = await WeeklyReport.findById(reportId)
      .populate({
        path: "evaluation.rubricsId",
        select: "criteria semester totalMarks",
      })
      .select("evaluation.rubricsId content.individualWork")
      .populate({
        path: "content.individualWork.studentId",
        select: "studentId profile.name",
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Weekly report not found",
      });
    }

    // Check if rubricsId was populated successfully
    if (!report.evaluation || !report.evaluation.rubricsId) {
      return res.status(404).json({
        success: false,
        message: "No rubrics associated with this report",
      });
    }

    // Prepare the members data
    const members = report.content.individualWork.map((member) => ({
      studentId: member.studentId.studentId,
      name: member.studentId.profile.name,
      _id: member.studentId._id,
    }));

    // Prepare response data
    const data = {
      rubrics: report.evaluation.rubricsId,
      members,
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Error in getRubrics:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const checkRubricsExistence = async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    const faculty = await Faculty.findById(req.user.id);
    
    // Check if rubrics already exist for this semester and academic year
    const existingRubric = await Rubrics.findOne({
      semester,
      academicYear,
      department: faculty.department,
    }).populate({ path: "createdBy" , select: "profile.name"});
    
    return res.status(200).json({
      success: true,
      exists: !!existingRubric,
      rubrics: existingRubric || null
    });
  } catch (error) {
    console.error("Error checking rubrics existence:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getAllFaculties = async (req, res) => {
  try {
    const allFaculties = await Faculty.find().select(
      "profile email department"
    );
    // console.log(allFaculties);
    res.status(200).json({ success: true, allFaculties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSGPProjects = async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    const userId = req.user.facultyId;

    // Find the faculty (mentor)
    const faculty = await Faculty.findOne({ facultyId: userId });
    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }

    // Filtering projects based on semester and academicYear
    const filter = { mentor: faculty._id };

    // Validate and parse semester
    if (semester && !isNaN(Number(semester))) {
      filter.semester = parseInt(semester);
    } else if (semester) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester value",
      });
    }

    if (academicYear) filter.academicYear = academicYear;

    // Fetching groups and populating projects
    const groups = await Group.find(filter)
      .populate({
        path: "members.studentId",
        select: "studentId batch -_id",
      })
      .populate({
        path: "projectId",
        match: { type: "SGP" }, // Filtering only 'SGP' projects
        select:
          "_id title domain technologies.name technologies.category approvalStatus isRevisionalResubmitted type status startDate endDate comments",
        populate: [
          {
            path: "domain",
            select: "domain -_id",
          },
          {
            path: "comments.facultyId",
            select: "name -_id", // Getting faculty name
          },
        ],
      })
      .select("department semester academicYear members");

    const validGroups = groups.filter((group) => group.projectId);

    if (!validGroups.length) {
      return res.status(200).json({
        success: true,
        message: "No projects found for the given filters",
        pending: [],
        approved: [],
        rejected: [],
        revision: [],
      });
    }

    // Categorizing projects
    const pending = [];
    const approved = [];
    const rejected = [];
    const revision = [];

    validGroups.forEach((group) => {
      const project = group.projectId;

      // Extracting leader and members
      let leaderId = null;
      const members = group.members.map((m) => {
        if (m.isLeader) leaderId = m.studentId.studentId;
        return {
          id: m.studentId.studentId,
          batch: m.studentId.batch,
          isLeader: m.isLeader,
        };
      });

      // Extracting first comment and its createdAt with faculty name
      const firstComment =
        project.comments && project.comments.length > 0
          ? {
              comment: project.comments[project.comments.length-1].comment,
              facultyName: project.comments[project.comments.length -1].facultyId?.name || "Unknown",
              createdAt: project.comments[project.comments.length -1].createdAt,
            }
          : null;

      const formattedProject = {
        projectId: project._id,
        title: project.title,
        domain: project.domain?.domain || "Unknown",
        batch: members[0]?.batch || "Unknown",
        technologies: project.technologies.map((tech) => tech.name),
        approvalStatus: project.approvalStatus,
        type: project.type,
        status: project.status,
        startDate: project.startDate
          ? project.startDate.toISOString().split("T")[0]
          : "N/A",
        endDate: project.endDate
          ? project.endDate.toISOString().split("T")[0]
          : "N/A",
        leaderId: leaderId,
        members: members.map((m) => ({ id: m.id, batch: m.batch })),
        department: group.department,
        semester: group.semester,
        academicYear: group.academicYear,
        firstComment: firstComment, // Added first comment with faculty name
        isRevisionalResubmitted: project.isRevisionalResubmitted,
      };

      // Categorizing based on approvalStatus
      if (project.approvalStatus === "Pending") {
        pending.push(formattedProject);
      } else if (project.approvalStatus === "Approved") {
        approved.push(formattedProject);
      } else if (project.approvalStatus === "Rejected") {
        rejected.push(formattedProject);
      } else if(project.approvalStatus === "Revision"){
        revision.push(formattedProject);
      }
    });

    // console.log("ehuifo->", pending, approved, rejected);
    
    return res.status(200).json({
      success: true,
      pending,
      approved,
      rejected,
      revision
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getFacultyProfile = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;
    
    // Find faculty by facultyId and exclude password
    const faculty = await Faculty.findOne({ facultyId }).select('-password');
    
    if (!faculty) {
      return res.status(404).json({ 
        success: false, 
        message: "Faculty not found" 
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Faculty profile retrieved successfully",
      faculty
    });
  } catch (error) {
    console.error("Error in getFacultyProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch faculty profile",
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.facultyId;
    const { name, contact, bio } = req.body;

    const avatar = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/facultyImages/${
          req.file.filename
        }`
      : undefined;

    const faculty = await Faculty.findOne({ facultyId: userId });

    if (!faculty)
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });

    // Update profile fields if provided in request
    faculty.profile.name = name || faculty.profile.name;
    faculty.profile.contact = contact || faculty.profile.contact;
    faculty.profile.bio = bio || faculty.profile.bio;

    if (avatar) faculty.profile.avatar = avatar;

    await faculty.save();

    // Return updated faculty without password
    const updatedFaculty = await Faculty.findOne({ facultyId: userId }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      faculty: updatedFaculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getOtherProjects = async (req, res) => {
  try {
    const userId = req.user.facultyId;

    // Find the faculty (mentor)
    const faculty = await Faculty.findOne({ facultyId: userId });
    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }

    // Fetching groups and populating projects
    const groups = await Group.find({ mentor: faculty._id })
      .populate({
        path: "members.studentId",
        select: "studentId batch -_id",
      })
      .populate({
        path: "projectId",
        match: { type: "Other Project" }, // Filtering only 'Open Project' projects
        select:
          "_id title domain technologies.name technologies.category approvalStatus type status startDate endDate academicYear",
        populate: [
          {
            path: "domain",
            select: "domain -_id",
          },
        ],
      })
      .select("department semester academicYear members");

    const validGroups = groups.filter((group) => group.projectId);

    if (!validGroups.length) {
      return res.status(200).json({
        success: true,
        message: "No projects found",
        pending: [],
        approved: [],
        rejected: [],
      });
    }

    // Categorizing projects
    const pending = [];
    const approved = [];
    const rejected = [];

    validGroups.forEach((group) => {
      const project = group.projectId;

      // Extracting leader and members
      let leaderId = null;
      const members = group.members.map((m) => {
        if (m.isLeader) leaderId = m.studentId.studentId;
        return {
          id: m.studentId.studentId,
          batch: m.studentId.batch,
          isLeader: m.isLeader,
        };
      });

      const formattedProject = {
        projectId: project._id,
        title: project.title,
        domain: project.domain?.domain || "Unknown",
        batch: members[0]?.batch || "Unknown",
        technologies: project.technologies.map((tech) => tech.name),
        approvalStatus: project.approvalStatus,
        type: project.type,
        status: project.status,
        startDate: project.startDate
          ? project.startDate.toISOString().split("T")[0]
          : "N/A",
        endDate: project.endDate
          ? project.endDate.toISOString().split("T")[0]
          : "N/A",
        leaderId: leaderId,
        members: members.map((m) => ({ id: m.id, batch: m.batch })),
        department: group.department,
        semester: group.semester,
        academicYear: project.academicYear, // Including the academic year when the project was created
      };

      // Categorizing based on approvalStatus
      if (project.approvalStatus === "pending") {
        pending.push(formattedProject);
      } else if (project.approvalStatus === "approved") {
        approved.push(formattedProject);
      } else if (project.approvalStatus === "rejected") {
        rejected.push(formattedProject);
      }
    });

    return res.status(200).json({
      success: true,
      pending,
      approved,
      rejected,
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const id = req.params.projectId;
    const project = await Project.findById(id)
      .populate({
        path: "domain",
        select: "domain -_id",
      })
      .populate({
        path: "groupId",
        select: "groupId department semester academicYear githubMetrics members -_id",
        populate: [
          {
            path: "mentor",
            select: "profile.name -_id",
          },
          {
            path: "members.studentId",
            select: "studentId batch department -_id",
          },
        ],
      });

    if (!project) {
      return res.status(404).json({ success:false, message: "Project not found" });
    }

    // Extracting relevant data
    const formattedProject = {
      projectId: project._id,
      groupId: project?.groupId.groupId,
      title: project.title,
      domain: project.domain.domain,
      description: project.description,
      approvalStatus: project.approvalStatus,
      technologies: project.technologies.map((tech) => tech.name),
      startDate: project.startDate.toLocaleDateString(),
      endDate: project.endDate.toLocaleDateString(),
      academicYear: project.groupId.academicYear,
      semester: project.groupId.semester,
      department: project.groupId.department,
      githubRepoLink: project.githubRepoLink,
      status: project.status,
      mentor: project.groupId.mentor.profile.name,
      members: project.groupId.members.map((m) => ({
        id: m.studentId.studentId,
        batch: m.studentId.batch,
        department: m.studentId.department,
        isLeader: m.isLeader,
      })),
      comments: project.comments,
      githubMetrics: project.groupId.githubMetrics,
      type: project.type,
      isRevisionalResubmitted: project?.isRevisionalResubmitted,
    };

    res.status(200).json({ success: true, project: formattedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAcademicYear = async (req, res) => {
  try {
    const academicYears = await Group.distinct("academicYear"); // Fetch unique academic years
    if(!academicYears){
      return res.status(404).json({
        success: false,
        message: 'Academic Years not found'
      })
    }
    academicYears.sort((a, b) => b.localeCompare(a));
    res.status(200).json({ success: true, academicYears });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};




