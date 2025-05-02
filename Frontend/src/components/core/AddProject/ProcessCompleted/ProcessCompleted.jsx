import React, { useState } from 'react'
import IconBtn from '../../../comman/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, updateRejectedProject } from '../../../../services/operations/projectAPI';
import { useNavigate } from 'react-router-dom';
import { setStep, setEditProject } from '../../../../slices/projectSlice';

const ProcessCompleted = () => {

  const {project, isUpdateMode, projectId} = useSelector(state => state.project);
  const {token} = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  console.log('processc completed',project);

    const handlePrevious = () => {
      dispatch(setStep(3));
      dispatch(setEditProject(true))
    }

  const generateProject = async () => {
    setLoading(true);
    try {
      if (isUpdateMode && projectId) {
        await updateRejectedProject(projectId, project, token, navigate);
      } else {
        dispatch(createProject(project, token, navigate));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center mt-20 gap-y-3">
      <div className="mb-6">
        <div className="relative w-28 h-28">
          {/* Background squares */}
          <div className="absolute top-0 left-0 w-[51px] h-[51px] bg-[#cecaff] rounded-lg -translate-x-2 -translate-y-5" />
          <div className="absolute top-0 right-0 w-[29px] h-[29px] bg-[#cecaff] rounded-lg translate-x-2 translate-y-2" />
          <div className="absolute bottom-0 left-0 w-[31px] h-[31px] bg-[#eeecff] rounded-lg -translate-x-4 -translate-y-6" />
          <div className="absolute bottom-0 right-0 w-[36px] h-[36px] bg-[#eeecff] rounded-lg translate-x-2 translate-y-2" />

          {/* Main circle with checkmark */}
          <div className="absolute inset-0 bg-[#4A3AFF] rounded-full flex items-center justify-center w-full">
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white "
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-3 items-center">
        <h2 className="text-2xl font-semibold mt-3 text-[#170F49] font-poppins">
          All Step completed successfully
        </h2>
        <p className="text-[#6F6C90] mb-8">
          Please review all the information you previously <br /> typed in the
          past steps, and if all is correct, <br /> Submit your details.
        </p>
        <IconBtn
        onClick={generateProject}
        customClasses={`bg-[#4A3AFF] text-white text-poppins font-medium px-12 py-3 w-32 rounded-xl hover:bg-[#4C1D95] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B21B6] focus:ring-offset-2 active:bg-[#3B0F8F]`}
        loading={loading}
        >
        {loading ? (
          <div className="flex items-center justify-center z-10">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        ) : (
          "Submit"
        )}
      </IconBtn>
      </div>

      <IconBtn onClick={handlePrevious} customClasses={`bg-[#c9a4ff]`}>
        Previous Step
      </IconBtn>
    </div>
  );
}

export default ProcessCompleted
