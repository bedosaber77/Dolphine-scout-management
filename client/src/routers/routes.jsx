import Home from '../pages/Home';
import Login from '../pages/Login';
import MainLayout from '../components/MainLayout';
import AboutUs from '../pages/AboutUs';
import ScoutDashboard from '../pages/ScoutDashboard';
import Register from '../pages/Register';
import Events from '../pages/Events';
import Event from '../pages/Event';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboardLayout';
import ScoutsView from '../pages/ScoutsView';
import ParentsView from '../pages/ParentsView';
import LeadersView from '../pages/LeadersView';
import TransactionsView from '../pages/TransactionsView';
import Verifications from '../pages/Verifications';
import Announcements from '../pages/Announcements';
import AddLeaderAccount from '../pages/AddLeaderAccount';
import WithdrawRequests from '../pages/WithdrawRequests';
import Achievements from '../pages/Achievements';
import Locations from '../pages/Locations';
import Equipment from '../pages/Equipment';
import Troops from '../pages/Troops';
import Statistics from '../pages/Statistics';
import useAuthStore from '../store/authStore';
import NotFound from '../pages/NotFound';
import WaitVerify from '../pages/waitVerfiy';
import ParentDashboard from '../pages/ParentDashboard';
import ParentProtectedRoute from './ParentProtectedRouter';
import AdminProtectedRoute from './AdminProtectedRoute';
import ScoutProtectedRoute from './ScoutProtectedRoute';
import Dashboard from './Dashboard';
import ScoutChild from '../pages/ScoutChild';
import AllAnnouncementsPage from '../pages/AllAnnouncementsPage';
import AllAchievementsPage from '../pages/AllAchievementsPage';
const AppRoutes = () => {
  const user = useAuthStore((state) => state.user);

  const routes = [
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: '/login',
          element: !user ? <Login /> : <Navigate to="/" replace={true} />,
        },
        {
          path: '/register',
          element: !user ? <Register /> : <Navigate to="/" replace={true} />,
        },
        {
          path: '/aboutUs',
          element: <AboutUs />,
        },
        {
          path: 'verify',
          element: <WaitVerify />,
        },
        {
          path: 'achievements',
          element: <AllAchievementsPage />,
        },
        {
          path: '/announcements',
          element: <AllAnnouncementsPage />,
        },
        {
          path: '/dashboard',
          element: <Dashboard />,
          children: [
            {
              path: 'scout',
              element: <ScoutProtectedRoute />,
              children: [
                {
                  path: '',
                  element: <ScoutDashboard />,
                },
              ],
            },
            {
              path: 'parent',
              element: <ParentProtectedRoute />,
              children: [
                {
                  path: '',
                  element: <ParentDashboard />,
                },
                {
                  path: 'child/:id',
                  element: <ScoutChild />,
                },
              ],
            },

            {
              path: 'admin',
              element: <AdminProtectedRoute />,
              children: [
                {
                  path: '',
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
                      path: 'troops',
                      element: <Troops />,
                    },
                    {
                      path: 'transactions',
                      element: <TransactionsView />,
                    },
                    {
                      path: 'verifications',
                      element: <Verifications />,
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
                    {
                      path: 'achievements',
                      element: <Achievements />,
                    },
                    {
                      path: 'locations',
                      element: <Locations />,
                    },
                    {
                      path: 'equipment',
                      element: <Equipment />,
                    },
                    {
                      path: 'statistics',
                      element: <Statistics />,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: '/events',
          element: <Events />,
        },
        {
          path: 'events/:id',
          element: <Event />,
          loader: ({ params }) => {
            const { id } = params;
            return { id };
          },
        },
      ],
    },
  ];

  return routes;
};

export default AppRoutes;
