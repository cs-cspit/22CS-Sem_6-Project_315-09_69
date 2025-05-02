import React, { useState } from "react";
import { Chart } from "react-google-charts";

const CustomGanttChart = () => {
  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Student Id" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    task: "",
    subtask: "",
    studentId: "",
    startDate: "",
    endDate: "",
    dependencies: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Calculate duration in days

    const newTask = [
      `T${tasks.length + 1}`,
      `${formData.subtask}`,
      formData.studentId,
      start,
      end,
      duration,
      0,
      formData.dependencies || null,
    ];

    setTasks([...tasks, newTask]);
    setFormData({
      task: "",
      subtask: "",
      studentId: "",
      startDate: "",
      endDate: "",
      dependencies: "",
    });
  };

  const data = [columns, ...tasks];

  const options = {
    height: 800, // Adjusted height for better visibility
    width: "100%", // Full width
    gantt: {
      trackHeight: 40,
      criticalPathEnabled: true,
      criticalPathStyle: {
        stroke: "#4A3AFF",
        strokeWidth: 5,
      },
    },
  };

  return (
    <div className="p-6 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold font-poppins tracking-wider text-center text-[#4A3AFF] mb-6">
        Gantt Chart
      </h1>

      {/* Form for Task Input */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl bg-white shadow-md mb-6 w-full max-w-5xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#443d6d] mb-2">
              Task
            </label>
            <input
              type="text"
              name="task"
              placeholder="Enter task"
              value={formData.task}
              onChange={handleChange}
              required
              className="w-full p-2 border shadow-sm rounded-lg focus:ring-[#4A3AFF] focus:border-[#4A3AFF] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#443d6d] mb-2">
              Subtask
            </label>
            <input
              type="text"
              name="subtask"
              placeholder="Enter subtask"
              value={formData.subtask}
              onChange={handleChange}
              required
              className="w-full p-2 border shadow-sm rounded-lg focus:ring-[#4A3AFF] focus:border-[#4A3AFF] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#443d6d] mb-2">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              placeholder="Enter student ID"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full p-2 border shadow-sm rounded-lg focus:ring-[#4A3AFF] focus:border-[#4A3AFF] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#443d6d] mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full p-2 border shadow-sm rounded-lg focus:ring-[#4A3AFF] focus:border-[#4A3AFF] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#443d6d] mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full p-2 border shadow-sm rounded-lg focus:ring-[#4A3AFF] focus:border-[#4A3AFF] text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#443d6d] mb-2">
              Dependencies (Optional)
            </label>
            <input
              type="text"
              name="dependencies"
              placeholder="Enter task ID (e.g., T1, T2)"
              value={formData.dependencies}
              onChange={handleChange}
              className="w-full p-2 border shadow-sm rounded-lg focus:ring-[#4A3AFF] focus:border-[#4A3AFF] text-black"
            />
          </div>
        </div>

        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="mt-4 bg-[#4A3AFF] text-white py-2 px-4 rounded-lg hover:bg-[#A0A3BD]"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Gantt Chart Container */}
      <>
        {tasks.length > 0 ? (
          <Chart chartType="Gantt" width="100%" className="rounded-xl"  data={data} options={options} />
        ) : (
          <p className="text-center text-gray-700">No tasks added yet.</p>
        )}
      </>
    </div>
  );
};

export default CustomGanttChart