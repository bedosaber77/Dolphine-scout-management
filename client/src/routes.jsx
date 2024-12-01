import Home from "./pages/home";
import Login from "./pages/login";
import MainLayout from "./components/MainLayout";
import AboutUs from "./pages/aboutUs";
import ScoutDashboard from "./pages/scoutDashboard"
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
                element: <Login />
            },
            {
                path: '/aboutUs',
                element: <AboutUs />
            },
            {
                path: '/scoutDashboard',
                element: <ScoutDashboard />
            }

        ]
    },
];

export default routes