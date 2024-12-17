import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="dashboard flex flex-col md:flex-row gap-10 bg-gray-100 min-h-screen p-6">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
