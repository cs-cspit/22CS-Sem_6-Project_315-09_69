import React from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from "framer-motion";
import WeeklyReport from './WeeklyReport/WeeklyReport';
import GithubReport from './Github/GithubReport';
import EvaluateReport from './EvaluationReport/EvaluateReport';

const RenderStep = () => {

  const { step } = useSelector((state) => state.weeklyReportEvaluation);

  const steps = [
    {
      id: 1,
      title: "Weekly Report",
    },
    {
      id: 2,
      title: "Github Information",
    },
    {
      id: 3,
      title: "Assign Marks",
    },
  ];

  return (
    <div className="w-11/12 mx-auto py-8">
      <div className="flex w-11/12 justify-center items-center relative gap-x-10 mx-auto">
        {steps.map((item) => (
          <>
            <div className="flex flex-col items-center" key={item.id}>
              <button
                className={`grid cursor-default aspect-square w-[40px] place-items-center rounded-full border-[1px] font-poppins text-sm ${
                  step >= item.id
                    ? " bg-[#4A3AFF] text-white"
                    : " bg-[#EFF0F6] text-[#6F6C90]"
                } `}
              >
                {item.id}
              </button>
            </div>

            {item.id !== steps.length && (
              <>
                <div
                  className={`h-[calc(34px/6)] w-[33%] border rounded-full  ${
                    step > item.id ? "bg-[#4A3AFF]" : "bg-[#EFF0F6]"
                  } `}
                ></div>
              </>
            )}
          </>
        ))}
      </div>

      <div className="h-[calc(34px/18)] w-full border bg-[#EFF0F6] mt-6"></div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -70 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {step === 1 && <WeeklyReport/>}
          {step === 2 && <GithubReport/>}
          {step === 3 && <EvaluateReport/>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default RenderStep
