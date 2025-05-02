import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const {user} = useSelector(state => state.profile);
  if (token === null) {
    return children;
  } else {
    if(user.userType === 'student')
        return <Navigate to="/student/projects"/>
    else if(user.userType === 'faculty')
        return <Navigate to='/faculty'/>
  }
};
export default OpenRoute;
