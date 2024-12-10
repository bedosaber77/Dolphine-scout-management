import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import AuthProvider from './hooks/AuthProvider';
import AppRoutes from './routers/routes';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

function App() {
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshAccessToken();
    };

    initializeAuth();
  }, [refreshAccessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

function Routes() {
  const router = createBrowserRouter(AppRoutes()); // `useAuth` is safe to use here
  return <RouterProvider router={router} />;
}

export default App;
