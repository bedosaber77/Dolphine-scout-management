import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ScoutProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);

  // const user = useAuthStore((state) => state.user);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator
  }

  if (/*user?.role === 'scout' &&*/ accessToken)
    return <Outlet />; //commented out the role check to test the layout
  else return <Navigate to="/" replace={true} />;
};

export default ScoutProtectedRoute;
