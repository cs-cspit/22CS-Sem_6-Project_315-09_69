import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { TbFileCheck } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWeeklyReportSubmissions } from "../../services/operations/facultyAPI";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/comman/Loader";
import NoDataFoundImg from '../../../src/assets/NoDataFound/9264828-removebg.png'

const ProjectSubmissions = () => {

  const [submissions, setSubmissions] = useState([]);
  const [loadeing, setLoadeing] = useState(false);
  const {token} = useSelector(state => state.auth);
  const { projectType, semester, academicYear } = useParams();
  const navigate = useNavigate();

  const totalWeeks = 15;

  useEffect(()=>{
    const getSubmissions = async ()=>{
      setLoadeing(true);
      try {
        const submissions = await fetchWeeklyReportSubmissions(token, semester, academicYear);
        setSubmissions(submissions);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      }
      setLoadeing(false)
    }

    getSubmissions()

    console.log(submissions);
    
  },[semester,academicYear,token])

  return (
    <div className="mt-10">
      {loadeing ? (
        <Loader />
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img src={NoDataFoundImg} className="mt-14 " width={600} />
          <p className="text-xl font-semibold text-gray-600">
            No submissions found
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          <table className="w-full border-2 shadow-lg">
            <thead>
              <tr className="bg-[#c9c4ff]">
                <th className="py-4 px-6 text-left text-base font-medium font-poppins text-[#170f49]">
                  Projects
                </th>
                {Array.from({ length: totalWeeks }, (_, index) => (
                  <th
                    key={index + 1}
                    className="py-4 px-6 text-center text-base font-medium font-poppins text-[#170f49]"
                  >
                    {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr
                  key={index}
                  className="border-t border-[#1A1046]/10 bg-white"
                >
                 <td className="py-4 px-4 text-[#170f49] text-center text-sm font-poppins border max-w-[150px] relative">
                  <div className="truncate overflow-hidden whitespace-nowrap" title={submission.projectTitle}>
                    {submission.projectTitle}
                  </div>
                  </td>


                  {Array.from({ length: totalWeeks }, (_, weekIndex) => {
                    const weekNumber = (weekIndex + 1).toString();
                    const report = submission.weeklyReports.find(
                      (report) => report.weekNo === weekNumber
                    );

                    return (
                      <td key={weekIndex} className="py-4 px-6 text-center">
                        {report ? (
                          report.status === "Evaluated" ? (
                            <TbFileCheck className="mx-auto size-5 text-blue-600" />
                          ) : (
                            <button
                              onClick={() =>
                                navigate(
                                  `/faculty/${projectType}/evaluate-report/${report.weeklyReportId}/${semester}/${academicYear}`
                                )
                              }
                            >
                              <FileText className="mx-auto size-6 pt-1 text-[#1A1046]" />
                            </button>
                          )
                        ) : (
                          <FileText className="mx-auto size-5 text-[#a0a3bd]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col space-y-2">
            <div className="flex gap-x-11">
              <p>Submitted: </p>
              <FileText className="size-5 text-[#1A1046]" />
            </div>
            <div className="flex gap-x-3">
              <p>Not Submitted: </p>
              <FileText className="size-5 text-[#a0a3bd]" />
            </div>
            <div className="flex gap-x-12">
              <p>Evaluated: </p>
              <TbFileCheck className="size-[22px] text-blue-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSubmissions;
