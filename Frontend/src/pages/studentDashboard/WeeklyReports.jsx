import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import WeeklyReportCard from '../../components/core/WeeklyReports/WeeklyReportCard';
import IconBtn from '../../components/comman/IconBtn';
import { useSelector } from 'react-redux';
import { fetchProjectWeeklyReports } from '../../services/operations/weeklyReportAPI';
import WeeklyReportCardSkeleton from '../../components/core/WeeklyReports/WeeklyReportCardSkeleton';
import NoDataFoundImg from '../../../src/assets/NoDataFound/9264828-removebg.png'

const WeeklyReports = () => {
  
  const [evaluatedReports, setEvaluatedReports] = useState([]);
  const [nonEvaluatedReports, setNonEvaluatedReports] = useState([]);
  const [loading, setLoading] = useState(false)
  const {token} = useSelector(state => state.auth)
  const {projectId} = useParams()
  const navigate = useNavigate()
  
  useEffect(()=>{
    const getWeeklyReports = async () => {
      setLoading(true)
      try {
        const weeklyReports = await fetchProjectWeeklyReports(projectId,token)
        // setEvaluatedReports(weeklyReports.evaluatedReports);
        // setNonEvaluatedReports(weeklyReports.nonEvaluatedReports);
        console.log(weeklyReports);
        setEvaluatedReports(weeklyReports.evaluatedReports || []);
        setNonEvaluatedReports(weeklyReports.nonEvaluatedReports || []);
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    }
    getWeeklyReports();

  },[projectId, token])
      console.log("evaluated:", evaluatedReports);
      console.log("nonEvaluated", nonEvaluatedReports);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row-reverse gap-x-2">
        {/* <IconBtn
          onClick={() =>
            navigate(`/student/create-gantt-chart`)
          }
          customClasses="h-12 border rounded-xl px-8 bg-[#4a3aff] font-medium font-poppins"
          type="addProject"
        >
          Create Gantt Chart
        </IconBtn> */}
        <IconBtn
          onClick={() =>
            navigate(`/student/weekly-reports/add-report/${projectId}`)
          }
          customClasses="h-12 border rounded-xl px-8 bg-[#4a3aff] font-medium font-poppins"
          type="addProject"
        >
          + Add Report
        </IconBtn>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-8">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <WeeklyReportCardSkeleton />)
        ) : evaluatedReports.length > 0 || nonEvaluatedReports.length > 0 ? (
          <>
            {evaluatedReports.length > 0 &&
              evaluatedReports.map((report, index) => (
                <Link
                  to={`/student/weekly-report-details/${report.weekId}`}
                  key={index}
                  className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <WeeklyReportCard reportData={report} />
                </Link>
              ))}
            {nonEvaluatedReports.length > 0 &&
              nonEvaluatedReports.map((report, index) => (
                <Link
                  to={`/student/weekly-report-details/${report.weekId}`}
                  key={index}
                  className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <WeeklyReportCard key={index} reportData={report} />
                </Link>
              ))}
          </>
        ) : (
          <div className="w-full h-40 flex flex-col items-center">
            <img
              src={NoDataFoundImg}
              width={600}
              alt="no weekly report available"
            />
            <p className="text-gray-500 font-poppins text-xl col-span-2 text-center">
              No Weekly Reports available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklyReports
