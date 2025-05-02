import { useState, React } from "react";
import { X } from "lucide-react";
const FinalReport = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
      <div className="w-full bg-white rounded-xl border shadow-md p-8 max-w-content">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-medium font-poppins text-gray-900">
              Upload Final Report here
            </h2>
            <p className="text-gray-500 mt-1 font-poppins">
              Add your documents and attachments here.
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`
                mt-4 border-2 border-dashed rounded-lg p-8
                ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrag}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4 text-blue-600">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM16 13H13V16H11V13H8L12 9L16 13Z" />
              </svg>
            </div>
            <p className="text-lg text-gray-700">
              Drag your file(s) to start uploading
            </p>
            <p className="text-sm text-gray-500 mt-2">OR</p>
            <button className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
              Browse files
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">Only support .pdf file</p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button className="px-8 py-2 border-2 border-[#6366f1] text-[#6366f1] rounded-lg hover:bg-[#6366f1] hover:text-white">
            Cancel
          </button>
          <button className="px-8 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#5558e6]">
            Save
          </button>
        </div>
      </div>
  );
};

export default FinalReport;
