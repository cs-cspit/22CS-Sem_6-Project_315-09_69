import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    rubricsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rubrics",
      default: null,
    },
    title: { type: String, required: true },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Technology" },
    technologies: [
      {
        technologyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Technology",
        },
        name: {
          type: String,
          required: true,
        },
        category: {
          type: String,
        },
        isCustom: {
          type: Boolean,
          default: false,
        },
        customInput: {
          type: String,
          default: null,
        },
      },
    ],
    // researchArea: String,
    description: String,
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Revision"],
      default: "Pending",
    },
    isRevisionalResubmitted: {
      type: Boolean,
      default: false,
    },
    githubRepoLink: { type: String, required: true },
    isSGPProject: { type: Boolean, default: false }, // Default is not an SGP project
    isOtherProject: { type: Boolean, default: false },
    type: { type: String, enum: ["SGP", "Other Project"] },
    status: {
      type: String,
      enum: ["Active", "Completed", "Abandoned"],
      default: "Active",
    },
    comments: [
      {
        facultyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Faculty",
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    documents: [
      {
        type: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
