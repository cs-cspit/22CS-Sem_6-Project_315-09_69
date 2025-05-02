import React from 'react'
import { useState } from 'react';

const OtherProjectForm = ({register}) => {

  const [members, setMembers] = useState([]); // For dynamic member addition

  const addMember = () => {
    setMembers([...members, { id: members.length + 2 }]);
  };

  return (
    <>
      {members.map((_, index) => (
        <div
          key={`dynamicMember${index + 1}`}
          className="flex flex-col gap-y-2"
        >
          <h3 className="font-medium text-sm font-poppns text-[#170F49]">
            Additional Member {index + 1}
          </h3>
          <div className="grid grid-cols-3 gap-x-12">
            <input
              type="text"
              placeholder="College ID"
              {...register(`dynamicMember${index + 1}.collegeId`)}
              className="h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
            />
            <input
              type="text"
              placeholder="Batch"
              {...register(`dynamicMember${index + 1}.batch`)}
              className="h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
            />
            <input
              type="text"
              placeholder="Department"
              {...register(`dynamicMember${index + 1}.department`)}
              className="h-12 rounded-lg border-[2px] border-[#f8f8fa] shadow-md focus:border-indigo-500 text-[#6F6C90] font-poppins text-sm pl-4"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addMember}
        className="mx-auto mt-2 px-2 py-2 text-sm text-blue-500 font-poppins font-medium border-2 rounded-md border-sky-600 w-32"
      >
        + Add Member
      </button>
    </>
  );
}

export default OtherProjectForm
