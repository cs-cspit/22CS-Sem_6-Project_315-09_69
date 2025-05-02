import React, { useEffect } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
import { MdEditSquare } from "react-icons/md";
import { fetchAcademicYears } from "../../../services/operations/facultyAPI";
import { setAcademicYear, setSemester } from "../../../slices/navSlice";
import Loader from "../../comman/Loader";
import { useDispatch, useSelector } from "react-redux";

const FacultySideBar = () => {
  const [expandedYear, setExpandedYear] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const semesters = ["3", "4", "5", "6", "7"];

  const { semester:selectedSemester, } = useSelector((state) => state.faculty);


  const dispatch = useDispatch()

  

  useEffect(() => {
    const getAcademicYears = async () => {
      setLoading(true);
      try {
        const academicYears = await fetchAcademicYears();

        if (academicYears.length > 0) {
          setAcademicYears(academicYears);
          setExpandedYear(academicYears[0]);
          dispatch(setAcademicYear(academicYears[0]));

          
        } else {
          setAcademicYears([]);
        }
      } catch (error) {}
      setLoading(false);
    };
    getAcademicYears();
  }, []);

  console.log(expandedYear, selectedSemester);
  

  return (
    <div className="mt-10">
      {loading && <Loader />}
      {academicYears.map((year) => (
        <div key={year} className="mb-4">
          <button
            className="flex items-center gap-x-2 bg-[#e3e4ec] text-[#170F49] font-poppins font-medium text-base px-4 py-2 rounded w-full"
            onClick={() =>{ setExpandedYear(expandedYear === year ? null : year); dispatch(setAcademicYear(year));}}
          >
            <MdEditSquare className=" w-6 h-auto" />
            {year}
          </button>
          <AnimatePresence>
            {expandedYear === year && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mt-2 bg-[#c9c4ff] border rounded-lg px-3 py-2 overflow-hidden space-y-2"
              >
                {semesters.map((semester) => (
                  <motion.button
                    key={semester}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch(setSemester(semester))}
                    className={`w-full px-4 py-2 text-left text-black font-poppins text-sm border-none rounded-xl transition-all duration-200 ease-in-out
                            ${
                              selectedSemester === semester
                                ? "bg-white shadow-md transform scale-105"
                                : "hover:bg-[#f8f8f8] hover:shadow-lg hover:scale-105"
                            }`}
                  >
                    Semester {semester}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FacultySideBar;
