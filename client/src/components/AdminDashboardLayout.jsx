import useAuthStore from '../store/authStore';
import '../styles/global.css';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminDashboardLayout = () => {
  const location = useLocation(); // Get the current path for active tab styling
  // const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);

  return (
    //commented out the role check to test the layout
    <div className="min-h-screen bg-background text-right rtl">
      {/* Dashboard Header */}
      <header className="p-6 bg-secondary-color text-white">
        <h1
          className="mb-4 text-4xl font-semibold"
          style={{ color: 'var(--secondary-color)' }} // Inline style to apply the CSS variable
        >
          لوحة تحكم المدير
        </h1>
      </header>

      {/* Tab Navigation */}
      <div className="flex justify-start space-x-4 p-4 bg-white shadow-md border-b border-gray-300 gap-x-1">
        <Tab
          to="scouts"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          الكشافة
        </Tab>
        <Tab
          to="parents"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          الأهالي
        </Tab>
        <Tab
          to="leaders"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          القادة
        </Tab>
        <Tab
          to="troops"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          المجموعات
        </Tab>
        <Tab
          to="transactions"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          المعاملات
        </Tab>
        {/* <Tab
          to="requests"
          currentPath={location.pathname}
          color="var(--secondary-color)"
          >
          الطلبات
          </Tab> */}
        {/* <Tab to="addLeader" currentPath={location.pathname} color="var(--secondary-color)">
          اضافة قائد
          </Tab> */}
        <Tab
          to="announcements"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          الاعلانات
        </Tab>
        <Tab
          to="achievements"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          الانجازات
        </Tab>
        <Tab
          to="locations"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          المواقع
        </Tab>
        <Tab
          to="equipment"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
          المعدات
        </Tab>
        <Tab
          to="verifications"
          currentPath={location.pathname}
          color="var(--secondary-color)"
        >
        تفعيل الحساب 
      </Tab>
        {/* <Tab to="statistics" currentPath={location.pathname} color="var(--secondary-color)">
        الاحصائيات
        </Tab> */}
      </div>

      
      {/* Render the active route's component */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

// Tab Component with custom colors
const Tab = ({ to, currentPath, color, children }) => {
  const isActive = currentPath.includes(to);

  return (
    <Link
      to={to}
      className={`text-lg px-4 py-2 rounded-lg transition-all duration-300
        ${isActive ? 'text-white shadow-md' : 'text-primary'}
        ${
          isActive
            ? `bg-[${color}]`
            : 'hover:bg-gray-100 hover:text-secondary-hover'
        } 
        font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300`}
      style={{
        backgroundColor: isActive ? color : 'transparent',
        color: isActive ? '#fff' : 'var(--text-primary)',
      }}
    >
      {children}
    </Link>
  );
};

export default AdminDashboardLayout;
