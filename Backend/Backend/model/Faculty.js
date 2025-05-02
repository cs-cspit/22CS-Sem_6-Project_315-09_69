import mongoose from "mongoose";

const coordinatorSchema = new mongoose.Schema({
  academicYear: {
    type: String, // Example: "2024-25"
    match: /^\d{4}-\d{2}$/, // Ensures format like "2024-25"
    required: true,
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
    required: true,
  },
});

const facultySchema = new mongoose.Schema(
  {
    facultyId: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    department: {
      type: String,
      enum: ["CS", "IT", "CE", "AI-ML"],
      required: true,
    },
    profile: {
      name: String,
      contact: String,
      avatar: String,
      bio: String,
    },
    designation: String,
    specialization: [String],
    isCoordinator: { type: Boolean, default: false },
    coordinatorHistory: {
      type: [coordinatorSchema], // Array of coordinator records
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Faculty", facultySchema);
