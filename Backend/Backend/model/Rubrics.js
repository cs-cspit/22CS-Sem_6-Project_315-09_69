import mongoose from "mongoose";

const { Schema } = mongoose;

const rubricSchema = new Schema(
  {
    semester: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      enum: ["CS", "IT", "CE", "AI-ML"],
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    criteria: [
      {
        title: { type: String, required: true },
        maxMarks: { type: Number, required: true },
        weightage: { type: Number, required: true },
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate totalMarks before saving
rubricSchema.pre("save", function (next) {
  this.totalMarks = this.criteria.reduce(
    (sum, criterion) => sum + (criterion.maxMarks || 0),
    0
  );
  next();
});

export default mongoose.model("Rubrics", rubricSchema);
