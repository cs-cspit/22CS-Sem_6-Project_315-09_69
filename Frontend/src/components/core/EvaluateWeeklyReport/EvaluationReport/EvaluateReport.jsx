import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { setStep } from "../../../../slices/weeklyReportEvaluationSlice";
import {
  fetchRubrics,
  submitEvaluation,
} from "../../../../services/operations/weeklyReportAPI";
import IconBtn from "../../../comman/IconBtn";
import { toast } from "react-hot-toast";

const EvaluateReport = () => {
  const [marks, setMarks] = useState({});
  const [studentComments, setStudentComments] = useState({});
  const [students, setStudents] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [overallComment, setOverallComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { weeklyReportId, projectType, semester, academicYear } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getRubrics = async () => {
      try {
        const response = await fetchRubrics(weeklyReportId, token);
        if (response && response.members) {
          setStudents(response.members);
          setRubrics(response.rubrics.criteria || []);
        }
      } catch (error) {
        console.error("Error fetching rubrics:", error);
        toast.error("Failed to load evaluation criteria");
      }
    };
    getRubrics();
  }, [weeklyReportId, token]);

  const handleMarkChange = (studentId, rubricTitle, value) => {
    // Get the rubric to check max marks
    const rubric = rubrics.find((r) => r.title === rubricTitle);
    const maxMarks = rubric ? rubric.maxMarks : 5; // Default to 5 if not found

    // Validate input - ensure it's a number and within range
    let parsedValue = parseInt(value);

    // If empty, allow it (for user convenience)
    if (value === "") {
      parsedValue = "";
    }
    // Otherwise enforce constraints
    else {
      if (isNaN(parsedValue)) parsedValue = 0;
      if (parsedValue < 0) parsedValue = 0;
      if (parsedValue > maxMarks) parsedValue = maxMarks;
    }

    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: {
        ...(prevMarks[studentId] || {}),
        [rubricTitle]: parsedValue.toString(),
      },
    }));
  };

  const handleStudentCommentChange = (studentId, value) => {
    setStudentComments((prevComments) => ({
      ...prevComments,
      [studentId]: value,
    }));
  };

  const validateAllMarks = () => {
    // Check if all students have marks for all rubrics
    const missing = [];

    students.forEach((student) => {
      rubrics.forEach((rubric) => {
        const markValue = marks[student.studentId]?.[rubric.title];
        if (markValue === undefined || markValue === "") {
          missing.push(`${student.name}: ${rubric.title}`);
        }
      });
    });

    return missing;
  };

  const handleSubmitEvaluation = async () => {
    try {
      setIsSubmitting(true);

      // Validate all marks are entered
      const missingMarks = validateAllMarks();
      if (missingMarks.length > 0) {
        toast.error(
          `Missing marks for: ${missingMarks.slice(0, 3).join(", ")}${
            missingMarks.length > 3
              ? ` and ${missingMarks.length - 3} more`
              : ""
          }`
        );
        setIsSubmitting(false);
        return;
      }

      // Format for the backend
      const evaluationData = {
        marks: {},
        studentComments: studentComments,
        overallComment: overallComment,
        feedback,
      };

      // Transform formatted data to match backend expectations
      students.forEach((student) => {
        evaluationData.marks[student.studentId] = {};
        rubrics.forEach((rubric) => {
          evaluationData.marks[student.studentId][rubric.title] =
            marks[student.studentId]?.[rubric.title] || "0";
        });
      });

      console.log("Submission data:", evaluationData);

      await submitEvaluation(
        weeklyReportId,
        evaluationData,
        token,
        projectType,
        semester,
        academicYear,
        navigate
      );
      toast.success("Evaluation submitted successfully");
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error(error.message || "Failed to submit evaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-[#170F49] p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-poppins font-bold text-[#4b4c4e] mb-2">
          Project Evaluation
        </h1>
        <p className="text-[#6F6C90]">
          Evaluate each student based on the criteria below. Enter marks out of
          the maximum possible.
        </p>
      </header>

      {students.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>Loading evaluation criteria...</p>
        </div>
      ) : (
        <>
          {students.map((student) => (
            <div
              key={student.studentId}
              className="bg-white mb-8 p-4 rounded-lg"
            >
              <h2 className="text-xl font-medium font-poppins mb-4 text-[#4A3AFF]">
                {student.name} ({student.studentId})
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#A0A3BD]">
                    <th className="text-left py-2 px-4 font-semibold">
                      Criteria
                    </th>
                    <th className="text-left py-2 px-4 font-semibold w-64">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rubrics.map((rubric) => (
                    <tr
                      key={rubric.title}
                      className="border-b border-[#A0A3BD]"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium">{rubric.title}</div>
                        <div className="text-sm text-[#6F6C90] mt-1">
                          Weightage: {rubric.weightage}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max={rubric.maxMarks}
                            className="w-14 p-2 border border-[#A0A3BD] rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4A3AFF]"
                            value={
                              marks[student.studentId]?.[rubric.title] || ""
                            }
                            onChange={(e) =>
                              handleMarkChange(
                                student.studentId,
                                rubric.title,
                                e.target.value
                              )
                            }
                          />
                          <span className="ml-2 text-[#A0A3BD]">
                            / {rubric.maxMarks}
                          </span>
                          <div className="ml-4 flex-grow">
                            <div className="h-2 bg-[#F7F7FB] rounded-full">
                              <motion.div
                                className="h-full bg-[#4A3AFF] rounded-full"
                                initial={{ width: "0%" }}
                                animate={{
                                  width: `${
                                    (parseInt(
                                      marks[student.studentId]?.[
                                        rubric.title
                                      ] || "0",
                                      10
                                    ) /
                                      rubric.maxMarks) *
                                    100
                                  }%`,
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Individual Student Comment */}
              <div className="mt-4">
                <label
                  htmlFor={`comment-${student.studentId}`}
                  className="text-sm font-medium text-[#170F49] font-poppins"
                >
                  Comments for {student.name}:
                </label>
                <textarea
                  id={`comment-${student.studentId}`}
                  placeholder={`Add comments specific to ${student.name}...`}
                  value={studentComments[student.studentId] || ""}
                  className="min-h-20 w-full mt-2 rounded-lg border-2 shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] p-4"
                  onChange={(e) =>
                    handleStudentCommentChange(
                      student.studentId,
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-y-4">
            {/* Overall Comment */}
            <div className="flex flex-col gap-y-2">
              <label
                htmlFor="overallComment"
                className="text-sm font-medium text-[#170F49] font-poppins"
              >
                Overall Comment:
              </label>
              <textarea
                id="overallComment"
                placeholder="Add overall comment for the team..."
                value={overallComment}
                className="min-h-16 w-full rounded-lg border-2 shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-sm text-[#6F6C90] p-4"
                onChange={(e) => setOverallComment(e.target.value)}
              />
            </div>

            {/* Feedback Dropdown */}
            <div className="flex flex-col gap-y-2">
              <label
                htmlFor="feedback"
                className="text-sm font-medium text-[#170F49] font-poppins"
              >
                Feedback:
              </label>
              <select
                id="feedback"
                value={feedback}
                className="block w-full h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-2 pr-2"
                onChange={(e) => setFeedback(e.target.value)}
              >
                <option value="">Select Feedback</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
                <option value="Bad">Bad</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <IconBtn
              type="button"
              onClick={() => dispatch(setStep(2))}
              customClasses="bg-[#4a3aff] hover:bg-[#3929ff] shadow-lg"
            >
              Previous Step
            </IconBtn>
            <button
              onClick={handleSubmitEvaluation}
              className={`bg-[#4A3AFF] text-white py-2 px-6 rounded-lg transition-colors ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-opacity-90 cursor-pointer"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Evaluation"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EvaluateReport;
