import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default PrivateRoute;
