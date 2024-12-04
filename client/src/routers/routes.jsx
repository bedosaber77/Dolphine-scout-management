import Home from "../pages/home";
import Login from "../pages/login";
import MainLayout from "../components/MainLayout";
import AboutUs from "../pages/aboutUs";
import ScoutDashboard from "../pages/scoutDashboard"
import ProtectedRoute from "./protectedRoute";
import { Navigate } from "react-router-dom";

const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Home />
            },

            {
                path: '/login',
                element: (!localStorage.getItem('site')) ? <Login /> : <Navigate to="/" replace={true} />
            },
            {
                path: '/aboutUs',
                element: <AboutUs />
            },
            {
                path: '/scoutDashboard',
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '',
                        element: <ScoutDashboard />
                    }
                ]
            }

        ]
    },
];

export default routes