
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const ProtectedRoute = () => {
    const auth = useAuth();
    if (!auth.token) return <Navigate to="/" replace={true} />;;
    return <Outlet />;
};

export default ProtectedRoute;