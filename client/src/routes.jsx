import Home from "./pages/home";
import Login from "./pages/login";
import MainLayout from "./components/MainLayout";

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
            }

        ]
    },
];

export default routes