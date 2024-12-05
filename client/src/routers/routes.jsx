import Home from "../pages/Home";
import Login from "../pages/Login";
import MainLayout from "../components/MainLayout";
import AboutUs from "../pages/AboutUs";
import ScoutDashboard from "../pages/ScoutDashboard";
import ProtectedRoute from "./protectedRoute";
import Register from "../pages/Register";
import Event from "../pages/Event";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const AppRoutes = () => {
  const auth = useAuth();

  const routes = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/login",
          element: !auth.isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to="/" replace={true} />
          ),
        },
        {
          path: "/register",
          // action: registerAction,
          // element: !auth.isAuthenticated ? (
          element: <Register />,
          // ) : (
          //   <Navigate to="/" replace={true} />
          // ),
        },
        {
          path: "/aboutUs",
          element: <AboutUs />,
        },
        {
          path: "/scoutDashboard",
          element: <ProtectedRoute />,
          children: [
            {
              path: "",
              element: <ScoutDashboard />,
            },
          ],
        },
        {
          path: "/event",
          element: <Event />,
        },
      ],
    },
  ];

  return routes;
};

export default AppRoutes;
