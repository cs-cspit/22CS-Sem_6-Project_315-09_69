import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    department: {
      type: String,
      enum: ["CS", "IT", "CE", "AI-ML"],
      required: true,
    },
    profile: {
      name: { type: String, required: true },
      contact: { type: String, default: null }, // Contact should be unique and required
      avatar: { type: String, default: null }, // Optional field for profile picture
      bio: { type: String, default: null },
    },
    semester: { type: Number, required: true },
    batchYear: { type: String, required: true }, //2022-26
    batch: { type: String, required: true }, //A1 - A2
    groupInvitations: [
      {
        groupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
          required: true,
        }, // References a group and is required
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        }, // Status defaults to "Pending"
        invitedAt: { type: Date, default: Date.now }, // Invitation date defaults to current date
      },
    ],
    projectList: [
      {
        groupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
          required: true,
        }, // Reference to group is mandatory
        projectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          required: true,
        }, // Reference to project is mandatory
      },
    ],
    skills: [
      {
        technologyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Technology",
          required: true,
        },
        customSkill: { type: String, default: null }, //optional
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          required: true,
        }, // Skill level is required
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
