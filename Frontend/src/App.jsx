import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import PrivateRoute from "./route/PrivateRoute";
import ProjectDetails from "./pages/studentDashboard/ProjectDetails";
import WeeklyReports from "./pages/studentDashboard/WeeklyReports";
import FinalReport from "./pages/studentDashboard/FinalReport";
import ProjectsPage from "./pages/studentDashboard/ProjectsPage"
import Dashboard from "./dashboard/Dashboard";
import {ACCOUNT_TYPE} from "./data/constants"
import AddProject from "./components/core/AddProject/index"
import { useSelector } from "react-redux";
import OpenRoute from "./route/OpenRoute";
import AddWeeklyReport from "./components/core/WeeklyReports/AddWeeklyReport";
import WelcomePage from "./pages/facultyDashbooard/WelcomePage";
import ProjectsRequest from "./pages/facultyDashbooard/ProjectRequest";
import ProjectApprovalPage from "./pages/facultyDashbooard/ProjectApprovalPage";
import ProjectSubmissions from "./pages/facultyDashbooard/ProjectSubmissions";
import EvaluateWeeklyReport from "./components/core/EvaluateWeeklyReport/index";
import CustomGanttChart from "./components/core/GanttChart/CustomGanttChart";
import WeeklyReportDetails from "./pages/studentDashboard/WeeklyReportDetails";
import FacultyProfile from "./pages/facultyDashbooard/FacultyProfile";
import StudentProfile from "./pages/studentDashboard/StudentProfile";
import ProfileLayout from "./components/core/Profile/StudentProfile/ProfileLayout";

function App() {

  const {user} = useSelector(state => state.profile);
  console.log(user);
  

  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <Routes>
        {/* login route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        {/*private route for students */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {user?.userType === ACCOUNT_TYPE.STUDENT && (
            <>
              {/* <Header /> */}
              <Route path="student/projects" element={<ProjectsPage />} />
              <Route path="student/add-project" element={<AddProject />} />
              <Route
                path="student/project-details/:projectId"
                element={<ProjectDetails />}
              />
              <Route
                path="student/weekly-reports/:projectId"
                element={<WeeklyReports />}
              />
              <Route
                path="student/weekly-report-details/:weeklyReportId"
                element={<WeeklyReportDetails />}
              />
              <Route
                path="student/weekly-reports/add-report/:projectId"
                element={<AddWeeklyReport />}
              />
              <Route
                path="student/final-report/:projectId"
                element={<FinalReport />}
              />
              <Route
                path="student/create-gantt-chart"
                element={<CustomGanttChart />}
              />
            </>
          )}

          {user?.userType === ACCOUNT_TYPE.FACULTY && (
            <>
              <Route path="faculty" element={<WelcomePage />} />
              <Route
                path="faculty/project-details/:projectId"
                element={<ProjectApprovalPage />}
              />
              <Route
                path="faculty/:projectType/approval-requests/:semester/:academicYear"
                element={<ProjectsRequest />}
              />

              <Route
                path="faculty/:projectType/approval-requests"
                element={<ProjectsRequest />}
              />

              <Route
                path="faculty/:projectType/submissions/:semester/:academicYear"
                element={<ProjectSubmissions />}
              />

              <Route
                path="faculty/:projectType/submissions"
                element={<ProjectSubmissions />}
              />

              <Route
                path="faculty/:projectType/evaluate-report/:weeklyReportId/:semester/:academicYear"
                element={<EvaluateWeeklyReport />}
              />
              <Route path="faculty/profile" element={<FacultyProfile />} />
            </>
          )}
        </Route>

        <Route
          path="student/profile"
          element={
            <PrivateRoute>
              <ProfileLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<StudentProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
