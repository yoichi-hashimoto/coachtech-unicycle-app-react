import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import Loading from "../modal/Loading";

export default function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.authStatus);

  if (status === "checking") return <Loading />;
  if (status === "error") {
    return <Navigate to="/" replace state={{ authError: true }} />;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_admin) return <Navigate to="/" replace />;
  return children;
}
