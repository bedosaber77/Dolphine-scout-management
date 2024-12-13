import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';

const ParentProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);

  // const user = useAuthStore((state) => state.user);

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator
  }

  if (/*user?.role === 'parent' &&*/ accessToken) {
    /*commented out the role check to test the layout*/
    return (
      <>
        {/* <Sidebar /> */}
        <Outlet />
      </>
    );
  } else return <Navigate to="/" replace={true} />;
};

export default ParentProtectedRoute;
