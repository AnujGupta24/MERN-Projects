import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = useSelector((state) => state.user.user);

  if (user?.role !== "ADMIN") {
    return <Navigate to={"/"} replace />;
  }

  return children;
}

export default AdminRoute;
