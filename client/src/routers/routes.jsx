import Home from '../pages/Home';
import Login from '../pages/Login';
import MainLayout from '../components/MainLayout';
import AboutUs from '../pages/AboutUs';
import ScoutDashboard from '../pages/ScoutDashboard';
import ProtectedRoute from './protectedRoute';
import Register from '../pages/Register';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';
import AdminDashboard from '../components/AdminDashboardLayout';
import ScoutsView from '../pages/ScoutsView';
import ParentsView from '../pages/ParentsView';
import LeadersView from '../pages/LeadersView';
import TransactionsView from '../pages/TransactionsView';
import SponsorHistory from '../pages/SponsorHistory';
import Announcements from '../pages/Announcements';
import AddLeaderAccount from '../pages/AddLeaderAccount';
import WithdrawRequests from '../pages/WithdrawRequests';

const AppRoutes = () => {
  const auth = useAuth();

  const routes = [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: '/login',
          element: !auth.isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to="/" replace={true} />
          ),
        },
        {
          path: '/register',
          // action: registerAction,
          // element: !auth.isAuthenticated ? (
          element: <Register />,
          // ) : (
          //   <Navigate to="/" replace={true} />
          // ),
        },
        {
          path: '/aboutUs',
          element: <AboutUs />,
        },
        {
          path: '/scoutDashboard',
          element: <ProtectedRoute />,
          children: [
            {
              path: '',
              element: <ScoutDashboard />,
            },
          ],
        },
        {
          path: '/adminDashboard',
          element: <AdminDashboard />,
          children: [
            {
              path: 'scouts',
              element: <ScoutsView />,
            },
            {
              path: 'parents',
              element: <ParentsView />,
            },
            {
              path: 'leaders',
              element: <LeadersView />,
            },
            {
              path: 'transactions',
              element: <TransactionsView />,
            },
            {
              path: 'sponsors',
              element: <SponsorHistory />,
            },
            {
              path: 'announcements',
              element: <Announcements />,
            },
            {
              path: 'addLeader',
              element: <AddLeaderAccount />,
            },
            {
              path: 'requests',
              element: <WithdrawRequests />,
            },
          ],
        },
      ],
    },
  ];

  return routes;
};

export default AppRoutes;
