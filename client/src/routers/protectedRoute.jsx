import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  if (user.role === 'scout' && accessToken) return <Outlet />;
  else return <Navigate to="/" replace={true} />;
};

export default ProtectedRoute;
