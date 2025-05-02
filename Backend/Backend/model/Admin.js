import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    profile: {
      name: String,
      contact: String,
      avatar: String,
    },
    department: {
      type: String,
      enum: ["CS", "IT", "CE", "AI-ML"],
      required: true,
    },
    role: { type: String, default: "admin" },
    permissions: [String],
  },
  { timestamps: true }
);

export default mongoose.model("admin", adminSchema);
