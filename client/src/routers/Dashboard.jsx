import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="dashboard bg-gray-100 min-h-screen p-10">
      <Outlet />
    </div>
  );
};

export default Dashboard;

// flex flex-col md:flex-row gap-10 bg-gray-100 min-h-screen p-6
