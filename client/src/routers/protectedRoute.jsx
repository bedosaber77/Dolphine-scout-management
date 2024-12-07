import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../hooks/AuthProvider';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  // if (auth.isLoading) {
  //   return <div>Loading...</div>; // Optional loading spinner
  // }
  console.log(accessToken);
  if (!accessToken) return <Navigate to="/" replace={true} />;
  return <Outlet />;
};

export default ProtectedRoute;
