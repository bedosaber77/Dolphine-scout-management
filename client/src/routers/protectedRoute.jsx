import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

const ProtectedRoute = () => {
  const auth = useAuth();
  if (auth.isLoading) {
    return <div>Loading...</div>; // Optional loading spinner
  }
  if (!auth.isAuthenticated) return <Navigate to="/" replace={true} />;
  return <Outlet />;
};

export default ProtectedRoute;
