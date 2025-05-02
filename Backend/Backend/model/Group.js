import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupId: { type: String },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    department: {
      type: String,
      enum: ["CS", "IT", "CE", "AI-ML", "MultiDisciplinary"],
      required: true,
    },
    semester: Number,
    academicYear: String,
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    members: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        isLeader: Boolean,
        status: {
          type: String,
          enum: ["Pending", "Accepted"],
          default: "Pending",
        }, //invitation status
        joinedAt: Date,
      },
    ],
    githubMetrics: {
      repoName: String,
      contributors: [
        {
          username: String,
          commits: Number,
          additions: Number,
          deletions: Number,
          lastUpdated: Date,
        },
      ],
      lastFetched: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
