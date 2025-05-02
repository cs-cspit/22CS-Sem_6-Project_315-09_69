import WeeklyReport from "../model/WeeklyReport.js";
import Project from "../model/Project.js";
import Group from "../model/Group.js";
import Student from "../model/Student.js";
import Faculty from "../model/Faculty.js";

export const addWeeklyReport = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const studentId = req.user.studentID; // Extracted from middleware

    const {
      weekNumber,
      startDate,
      endDate,
      title,
      workDone,
      challenges,
      nextWeekWork,
      individualWork,
      attachments,
    } = req.body;

    console.log(req.body);
    
    // Find the student's ObjectId
    const student = await Student.findOne({ studentId }).select("_id");
    if (!student) {
      return res.status(404).json({ success:false, message: "Student not found" });
    }

    const rubricId = await Project.findOne({ _id: projectId }).select(
      "rubricsId"
    );
    // console.log(rubricId);

    // Find the group associated with the project
    const group = await Group.findOne({ projectId }).populate({
      path: "members.studentId",
      select: "studentId",
    });
    if (!group) {
      return res.status(404).json({ success:false, message: "Group not found" });
    }
    // console.log(group.members);

    const members = group.members.map((m) => ({
      _id: m.studentId._id,
      studentId: m.studentId.studentId,
    }));

    // console.log('Members:', members);

    // Check if the student is a part of the group
    const isMember = members.some((member) => member.studentId === studentId);
    if (!isMember) {
      return res
        .status(403)
        .json({ success:false, message: "Access denied.You are not a team member" });
    }

    // Check if a report for the given week already exists
    const existingReport = await WeeklyReport.findOne({
      projectId,
      weekNumber,
    });
    if (existingReport) {
      const submittedBy = members.find(
        (member) =>
          member._id.toString() === existingReport.submittedBy.toString()
      );
      return res
        .status(400)
        .json({
          success: false,
          message: `Week ${weekNumber} report is already submitted by ${submittedBy.studentId}`, 
        });
    }

    // Convert individualWork studentId to ObjectId from members
    const formattedIndividualWork = individualWork
      .map((iw) => {
        const studentObj = members.find(
          (member) => member.studentId === iw.studentId
        );
        return studentObj ? { studentId: studentObj._id, work: iw.work } : null;
      })
      .filter((iw) => iw !== null); // Filter out null values in case of unmatched studentId

    // console.log('Formatted Individual Work:', formattedIndividualWork);

    // Construct the report object
    const newReport = new WeeklyReport({
      projectId,
      weekNumber,
      reportPeriod: {
        startDate,
        endDate,
      },
      submissionDate: new Date(),
      content: {
        title,
        workDone,
        challenges,
        nextWeekPlan: nextWeekWork,
        individualWork: formattedIndividualWork,
        attachments: [
          {
            name: `Weekly-Report ${weekNumber}`,
            url: attachments,
          },
        ], // Attachments can be added later
      },
      evaluation: {
        rubricsId: rubricId.rubricsId,
      },
      status: "Submitted",
      submittedBy: student._id,
    });

    await newReport.save();
    res
      .status(201)
      .json({
        message: "Weekly report submitted successfully",
        success: true,
        report: newReport,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: "Server error" });
  }
};

export const getWeeklyReportsByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const weeklyReports = await WeeklyReport.find({ projectId })
      .select(
        "weekNumber status content.title evaluation.feedback evaluation.comment evaluation.total submissionDate"
      )
      .populate({
        path: "evaluation.evaluatedBy",
        select: "profile.name",
        options: { strictPopulate: false }, // Prevents errors if field is missing
      })
      .populate({
        path: "submittedBy",
        select: "profile.name studentId",
        options: { strictPopulate: false },
      });

    const nonEvaluatedReports = [];
    const evaluatedReports = [];

    weeklyReports.forEach((data) => {
      if (data.status === "Submitted") {
        nonEvaluatedReports.push({
          weekId: data._id,
          weekNumber: data.weekNumber,
          status: data.status,
          submittedBy: data.submittedBy?.profile?.name || "N/A",
          title: data.content.title,
          submissionDate: data.submissionDate.toLocaleDateString(),
        });
      } else if (data.status === "Evaluated") {
        evaluatedReports.push({
          weekId: data._id,
          weekNumber: data.weekNumber,
          status: data.status,
          submittedBy: data.submittedBy?.profile?.name || "N/A",
          title: data.content.title,
          submissionDate: data.submissionDate.toLocaleDateString(),
          total: data.evaluation?.total || 0,
          feedback: data.evaluation?.feedback || "No feedback",
          comment: data.evaluation?.comment || "No comments",
          evaluatedBy:
            data.evaluation?.evaluatedBy?.profile?.name || "Not evaluated",
        });
      }
    });

    evaluatedReports.sort((a, b) => a.weekNumber - b.weekNumber);
    nonEvaluatedReports.sort((a, b) => a.weekNumber - b.weekNumber);

    res
      .status(200)
      .json({ success: true, evaluatedReports, nonEvaluatedReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getWeeklyReportDetails = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = await WeeklyReport.findOne({ _id: reportId })
      .select("weekNumber reportPeriod submissionDate content status")
      .populate({
        path: "content.individualWork.studentId",
        select: "studentId -_id",
      });
    // console.log(report);
    const individualWork = report.content.individualWork.map((work) => ({
      studentId: work.studentId.studentId,
      work: work.work,
    }));

    const attachments = report.content.attachments.map((attachment) => ({
      name: attachment.name,
      url: attachment.url,
    }));
    const data = {
      startDate: report.reportPeriod.startDate,
      endDate: report.reportPeriod.endDate,
      title: report.content.title,
      workDone: report.content.workDone,
      challenges: report.content.challenges,
      nextWeekPlan: report.content.nextWeekPlan,
      weekNumber: report.weekNumber,
      individualWork,
      attachments,
      submissionDate: report.submissionDate.toLocaleDateString(),
    };
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWeeklyReportsByMentor = async (req, res) => {
  try {
    const userId = req.user.facultyId;
    const faculty = await Faculty.findOne({ facultyId: userId });
    const { semester, academicYear } = req.query;
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        error: "Faculty not found",
      });
    }

    const mentor = faculty._id;
    

    // Get all groups mentored by this faculty
    const groups = await Group.find({
      semester,
      academicYear,
      mentor,
    })
      .populate({
        path: "projectId",
        match: { approvalStatus: "Approved" },
        select: "_id title",
      })
      .select("projectId groupId -_id");

    // Format group IDs and get project IDs
    const gp = await Promise.all(
      groups.map(async (group) => {
        // Skip if projectId is null
        if (!group.projectId) {
          return null;
        }

        console.log(group);
        

        // const parts = group.groupId.split("_");
        // const formattedGroupId = `${parts[0]}_${parts[1]}_${parts[2]}_${
        //   parts[parts.length - 1]
        // }`;

        // Get weekly reports for this project
        const weeklyReports = await WeeklyReport.find({
          projectId: group.projectId,
        })
          .select("weekNumber status _id")
          .lean();

        // Only include reports that exist
        const reportsList = weeklyReports.map((report) => ({
          weeklyReportId: report._id.toString(),
          weekNo: report.weekNumber.toString(),
          status: report.status,
        }));

        if (reportsList.length === 0) return null; // Remove empty report groups

        return {
          projectTitle: group.projectId.title, //changes
          weeklyReports: reportsList,
        };
      })
    );

    // Filter out null values and empty reports
    const filteredGp = gp.filter((group) => group !== null);

    res.status(200).json({
      success: true,
      submissions: filteredGp,
    });
  } catch (error) {
    console.error("Error in getWeeklyReportsByMentor:", error.stack);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export const getEvluatedWeeklyReportDetails = async (req, res) => {
  try {
    const { weeklyReportId } = req.params;
    console.log(weeklyReportId);

    const weeklyReport = await WeeklyReport.findById(weeklyReportId)
      .populate({
        path: "evaluation.rubricsId",
        select: "title criteria totalMarks semester",
      })
      .populate({
        path: "evaluation.evaluatedBy",
        select: "profile.name",
      })
      .populate({
        path: "evaluation.studentMarks.studentId",
        select: "profile.name studentId",
      })
      .populate({
        path: "submittedBy",
        select: "profile.name studentId",
      })
      .populate({
        path: "content.individualWork.studentId",
        select: "profile.name studentId",
      });

    console.log(weeklyReport);

    if (!weeklyReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const response = {
      reportId: weeklyReport._id,
      reportMetadata: {
        weekNumber: weeklyReport.weekNumber,
        reportPeriod: weeklyReport.reportPeriod,
        submissionDate: weeklyReport.submissionDate,
        status: weeklyReport.status,
        semester: weeklyReport.evaluation.rubricsId.semester, // changes
        submittedBy: weeklyReport.submittedBy && {
          name: weeklyReport.submittedBy.profile.name,
          studentId: weeklyReport.submittedBy.studentId,
        },
      },
      content: {
        title: weeklyReport.content.title,
        workDone: weeklyReport.content.workDone,
        challenges: weeklyReport.content.challenges,
        nextWeekPlan: weeklyReport.content.nextWeekPlan,
        individualWork: weeklyReport.content.individualWork.map((work) => ({
          student: {
            name: work.studentId.profile.name,
            studentId: work.studentId.studentId,
          },
          work: work.work,
        })),
        attachments: weeklyReport.content.attachments,
      },
    };

    // Add evaluation details if the report has been evaluated
    if (weeklyReport.status === "Evaluated" && weeklyReport.evaluation) {
      response.evaluation = {
        overallMarks: weeklyReport.overallMarks,
        overallComment: weeklyReport.evaluation.overallComment, // Changed from comment to overallComment
        feedback: weeklyReport.evaluation.feedback,
        evaluatedBy: weeklyReport.evaluation.evaluatedBy && {
          studentId: weeklyReport.evaluation.evaluatedBy.studentId,
          name: weeklyReport.evaluation.evaluatedBy.profile.name,
        },
        evaluatedAt: weeklyReport.evaluation.evaluatedAt,
        rubric: weeklyReport.evaluation.rubricsId && {
          title: weeklyReport.evaluation.rubricsId.title,
          totalMarks: weeklyReport.evaluation.rubricsId.totalMarks,
          criteria: weeklyReport.evaluation.rubricsId.criteria,
        },
        studentMarks: weeklyReport.evaluation.studentMarks.map(
          (studentMark) => ({
            student: {
              name: studentMark.studentId.profile.name,
              studentId: studentMark.studentId.studentId,
            },
            marks: studentMark.marks,
            comments: studentMark.comments, // Include individual student comments
            total: studentMark.total,
          })
        ),
      };
    }

    console.log(response);

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const evaluateWeeklyReport = async (req, res) => {
  try {
    const { weeklyReportId } = req.params;
    const { marks, studentComments, overallComment, feedback } = req.body;
    const facultyId = req.user.facultyId;

    if (
      !weeklyReportId ||
      !marks ||
      Object.keys(marks).length === 0 ||
      !feedback
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required evaluation data",
      });
    }

    const mentorId = await Faculty.findOne({ facultyId }).select("_id");

    const weeklyReport = await WeeklyReport.findById(weeklyReportId).populate({
      path: "evaluation.rubricsId",
      select: "criteria totalMarks",
    });

    if (!weeklyReport) {
      return res.status(404).json({
        success: false,
        message: "Weekly report not found",
      });
    }

    const rubrics = weeklyReport.evaluation.rubricsId?.criteria || [];
    const totalRubricMarks =
      weeklyReport.evaluation.rubricsId?.totalMarks || 100;
    const studentMarksArray = [];

    for (const [studentId, criteriaMarks] of Object.entries(marks)) {
      const student = await Student.findOne({ studentId: studentId });
      if (!student) {
        return res.status(400).json({
          success: false,
          message: `Student with ID ${studentId} not found`,
        });
      }

      let totalScore = 0;
      const studentMarks = [];

      for (const [criteriaTitle, score] of Object.entries(criteriaMarks)) {
        const criteria = rubrics.find((r) => r.title === criteriaTitle);
        if (!criteria) {
          return res.status(400).json({
            success: false,
            message: `Invalid criteria: ${criteriaTitle}`,
          });
        }

        const maxMarks = criteria.maxMarks || 5;
        const weightage = criteria.weightage || 0;
        const scoreValue = parseInt(score);

        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > maxMarks) {
          return res.status(400).json({
            success: false,
            message: `Invalid score for ${studentId} on ${criteriaTitle}: must be between 0 and ${maxMarks}`,
          });
        }

        const weightedScore = (scoreValue / maxMarks) * weightage;
        totalScore += weightedScore;

        studentMarks.push({
          criteriaTitle,
          score: scoreValue,
        });
      }

      const normalizedTotal = (totalScore / 100) * totalRubricMarks;

      studentMarksArray.push({
        studentId: student._id,
        marks: studentMarks,
        comments: studentComments[studentId] || "", // Add individual comments
        total: normalizedTotal,
      });
    }

    const overallMarks =
      studentMarksArray.length > 0
        ? studentMarksArray.reduce((sum, student) => sum + student.total, 0) /
          studentMarksArray.length
        : 0;

    // Update weekly report evaluation with marks, comments, and feedback
    weeklyReport.evaluation.studentMarks = studentMarksArray;
    weeklyReport.evaluation.evaluatedBy = mentorId;
    weeklyReport.evaluation.evaluatedAt = new Date();
    weeklyReport.evaluation.overallComment = overallComment; // Store overall comment
    weeklyReport.evaluation.feedback = feedback; // Store feedback
    weeklyReport.status = "Evaluated";
    weeklyReport.overallMarks = overallMarks;

    await weeklyReport.save();

    res.status(200).json({
      success: true,
      message: "Evaluation submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



