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
import SponsorHistory from '../pages/SponsorHistory';
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
// import AllAnnouncementsPage from '../pages/AllAnnouncementsPage';
import AllAchievementsPage from '../pages/AllAchievementsPage';

const achievements = [
  {
    Achievement_ID: 1,
    Aname: 'Beginner',
    Criteria: 'Complete Task 1',
    Description: 'Awarded for starting',
    Level: 1,
    Acquired: true,
  },
  {
    Achievement_ID: 6,
    Aname: 'Beginner',
    Criteria: 'Complete Task 1',
    Description: 'Awarded for starting',
    Level: 2,
    Acquired: true,
  },
  {
    Achievement_ID: 2,
    Aname: 'Intermediate',
    Criteria: 'Complete Task 2',
    Description: 'Awarded for making progress',
    Level: 3,
    Acquired: false,
  },
  {
    Achievement_ID: 3,
    Aname: 'Advanced',
    Criteria: 'Complete Task 3',
    Description: 'Awarded for significant progress',
    Level: 5,
    Acquired: true,
  },
];
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
          element: <AllAchievementsPage achievements={achievements} />,
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
