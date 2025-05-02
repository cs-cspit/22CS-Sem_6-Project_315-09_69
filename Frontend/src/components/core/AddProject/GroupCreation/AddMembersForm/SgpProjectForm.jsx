import React from 'react'
import { useState } from 'react';

const SgpProjectForm = ({register,setValue, remaningStudents}) => {

  const [filteredStudents, setFilteredStudents] = useState({});
  const [selectedMembers, setSelectedMembers] = useState(new Set());

  const handleSearch = (event, member) => {
    const query = event.target.value.toLowerCase();
    if (query.length === 0) {
      setFilteredStudents((prev) => ({ ...prev, [member]: [] }));
      return;
    }

    // Filter out already selected members
    const availableStudents = remaningStudents.filter(
      (student) =>
        !selectedMembers.has(student.studentId) &&
        student.studentId.toLowerCase().includes(query)
    );

    setFilteredStudents((prev) => ({ ...prev, [member]: availableStudents }));
  };

  const selectStudent = (student, member) => {
    setValue(`${member}.collegeId`, student.studentId);
    setValue(`${member}.batch`, student.batch);
    setValue(`${member}.department`, student.department);

    setSelectedMembers((prev) => {
      const updated = new Set(prev);
      updated.add(student.studentId);
      return updated;
    });

    setFilteredStudents((prev) => ({ ...prev, [member]: [] }));
  };
  return (
          <>
            {/* Group Member 1 (Pre-filled, Non-editable) */}
            <div className="flex  flex-col gap-y-2">
              <h3 className="font-medium text-sm font-poppns text-[#170F49]">
                Group Member 1 (You)
              </h3>
              <div className="grid grid-cols-3 gap-x-12">
                <input
                  type="text"
                  readOnly
                  {...register("groupMember1.collegeId")}
                  className="h-12  rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
                />
                <input
                  type="text"
                  readOnly
                  {...register("groupMember1.batch")}
                  className="h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
                />
                <input
                  type="text"
                  readOnly
                  {...register("groupMember1.department")}
                  className="h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 focus:ring-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
                />
              </div>
            </div>

            {/* Group Member 2 */}
            <div className="relative flex flex-col gap-y-2">
              <h3 className="font-medium text-sm font-poppins text-[#170F49]">
                Group Member 2
              </h3>
              <div className="grid grid-cols-3 gap-x-12">
                {/* College ID Input with Dropdown */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Enter College ID"
                    {...register("groupMember2.collegeId")}
                    onChange={(e) => handleSearch(e, "groupMember2")}
                    className="h-12 w-full rounded-lg border-2 border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
                  />
                  {/* Dropdown - Visible only for this field */}
                  {filteredStudents["groupMember2"]?.length > 0 && (
                    <div className="absolute left-0 w-full bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-50 rounded-lg">
                      {filteredStudents["groupMember2"].map((student) => (
                        <div
                          key={student.studentId}
                          onClick={() => selectStudent(student, "groupMember2")}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                        >
                          {student.studentId}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Read-Only Fields */}
                <input
                  type="text"
                  {...register("groupMember2.batch")}
                  readOnly
                  className="h-12 w-full rounded-lg border-2 border-[#f8f8fa] shadow-md text-[#6F6C90] font-poppins text-sm pl-4 bg-white"
                />
                <input
                  type="text"
                  {...register("groupMember2.department")}
                  readOnly
                  className="h-12 w-full rounded-lg border-2 border-[#f8f8fa] shadow-md text-[#6F6C90] font-poppins text-sm pl-4 bg-white"
                />
              </div>
            </div>

            {/* Group Member 3 */}
            <div className="relative flex flex-col gap-y-2">
              <h3 className="font-medium text-sm font-poppins text-[#170F49]">
                Group Member 3
              </h3>
              <div className="grid grid-cols-3 gap-x-12">
                {/* College ID Input with Dropdown */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Enter College ID"
                    {...register("groupMember3.collegeId")}
                    onChange={(e) => handleSearch(e, "groupMember3")}
                    className="h-12 w-full rounded-lg border-2 border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
                  />
                  {/* Dropdown - Visible only for this field */}
                  {filteredStudents["groupMember3"]?.length > 0 && (
                    <div className="absolute left-0 w-full bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-50 rounded-lg">
                      {filteredStudents["groupMember3"].map((student) => (
                        <div
                          key={student.studentId}
                          onClick={() => selectStudent(student, "groupMember3")}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                        >
                          {student.studentId}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Read-Only Fields */}
                <input
                  type="text"
                  {...register("groupMember3.batch")}
                  readOnly
                  className="h-12 w-full rounded-lg border-2 border-[#f8f8fa] shadow-md text-[#6F6C90] font-poppins text-sm pl-4 bg-white"
                />
                <input
                  type="text"
                  {...register("groupMember3.department")}
                  readOnly
                  className="h-12 w-full rounded-lg border-2 border-[#f8f8fa] shadow-md text-[#6F6C90] font-poppins text-sm pl-4 bg-white"
                />
              </div>
            </div>
          </>

  );
}

export default SgpProjectForm
