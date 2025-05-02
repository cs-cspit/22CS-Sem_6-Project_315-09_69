import mongoose from "mongoose";
const { Schema } = mongoose;

const weeklyReportSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    reportPeriod: {
      startDate: Date,
      endDate: Date,
    },
    submissionDate: Date,
    content: {
      title: String,
      workDone: String,
      challenges: String,
      nextWeekPlan: String,
      individualWork: [
        {
          studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
          },
          work: String,
        },
      ],
      attachments: {
        type: [
          {
            name: String,
            url: [String],
          },
        ],
        required: true,
      },
    },
    evaluation: {
      rubricsId: {
        type: Schema.Types.ObjectId,
        ref: "Rubrics",
      },
      studentMarks: [
        {
          studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
          },
          marks: [
            {
              criteriaTitle: {
                type: String,
                required: true,
              },
              score: {
                type: Number,
                required: true,
              },
            },
          ],
          comments: String,
          total: {
            type: Number,
            default: 0,
          },
        },
      ],
      overallComment: String,
      feedback: {
        type: String,
        enum: ["Excellent", "Good", "Average", "Poor", "Bad"],
      },
      evaluatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
        default: null,
      },
      evaluatedAt: Date,
    },
    overallMarks: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Evaluated"],
      default: "Draft",
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true }
);

// Adding indexes to improve query performance
weeklyReportSchema.index({ projectId: 1, weekNumber: 1 });
weeklyReportSchema.index({ "evaluation.rubricsId": 1 });
weeklyReportSchema.index({ "evaluation.studentMarks.studentId": 1 });
weeklyReportSchema.index({ status: 1 });

// Pre-save hook to calculate total marks for each student
weeklyReportSchema.pre("save", async function (next) {
  try {
    // Only recalculate if the evaluation exists and has marks
    if (
      this.evaluation &&
      this.evaluation.studentMarks &&
      this.evaluation.studentMarks.length > 0
    ) {
      // Load the rubric to get weightages if needed
      let rubric = null;
      if (this.evaluation.rubricsId) {
        rubric = await mongoose
          .model("Rubrics")
          .findById(this.evaluation.rubricsId);
      }

      // Calculate total for each student add individual rubrics marks, individual total marks
      for (let studentMarks of this.evaluation.studentMarks) {
        if (studentMarks.marks && studentMarks.marks.length > 0) {
          // Simple sum if no rubric is available
          if (!rubric || !rubric.criteria) {
            studentMarks.total = studentMarks.marks.reduce(
              (sum, mark) => sum + (mark.score || 0),
              0
            );
          } else {
            // Weighted calculation if rubric is available
            let totalWeightedScore = 0;

            for (let mark of studentMarks.marks) {
              const criterion = rubric.criteria.find(
                (c) => c.title === mark.criteriaTitle
              );
              if (criterion) {
                const weightedScore =
                  (mark.score / criterion.maxMarks) * criterion.weightage;
                totalWeightedScore += weightedScore;
              }
            }

            // Store calculated total (normalized to rubric's total marks)
            studentMarks.total = (totalWeightedScore / 100) * rubric.totalMarks;
          }
        } else {
          studentMarks.total = 0;
        }
      }

      // Calculate overall marks (average of all students)
      const totalMarksArray = this.evaluation.studentMarks.map(
        (s) => s.total || 0
      );
      const avgMarks =
        totalMarksArray.length > 0
          ? totalMarksArray.reduce((sum, mark) => sum + mark, 0) /
            totalMarksArray.length
          : 0;

      // Store overall marks
      this.overallMarks = avgMarks;
    } else {
      this.overallMarks = 0;
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("WeeklyReport", weeklyReportSchema);
