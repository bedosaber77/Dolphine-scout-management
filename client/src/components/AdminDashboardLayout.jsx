import useAuthStore from '../store/authStore';
import '../styles/global.css';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminDashboardLayout = () => {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);

  return (
    <div className="min-h-screen bg-background text-right rtl">
      {/* Dashboard Header */}
      <header className="shadow-md rounded-2xl">
        <h1
          className="mb-4 py-10 text-5xl bg-white rounded-2xl font-semibold text-center"
          style={{ color: 'var(--secondary-color)' }}
        >
          لوحة تحكم المدير
        </h1>
      </header>

      {/* Tab Navigation */}
      <nav className="flex justify-start flex-wrap space-x-4 px-4 py-3 bg-white shadow-md border-b border-gray-300 gap-x-1 rounded-2xl">
        {tabs.map((tab) => (
          <Tab
            key={tab.to}
            to={tab.to}
            currentPath={location.pathname}
            color="var(--secondary-color)"
          >
            {tab.label}
          </Tab>
        ))}
      </nav>

      {/* Active route content */}
      <main className="mt-4 p-6 bg-white rounded-2xl shadow-md">
        <Outlet />
      </main>
    </div>
  );
};

const Tab = ({ to, currentPath, color, children }) => {
  const isActive = currentPath.includes(to);

  return (
    <Link
      to={to}
      className={`m-2 text-lg px-6 py-2 rounded-2xl transition-all duration-300
        ${
          isActive
            ? 'bg-secondary-color text-white shadow-lg font-semibold'
            : 'bg-gray-100 text-[#000000] font-bold'
        }
        hover:bg-gray-300 hover:text-secondary-hover`}
      style={{
        backgroundColor: isActive ? color : undefined,
      }}
    >
      {children}
    </Link>
  );
};

// Define tabs as an array for cleaner structure
const tabs = [
  { to: 'scouts', label: 'الكشافة' },
  { to: 'parents', label: 'الأهالي' },
  { to: 'leaders', label: 'القادة' },
  { to: 'troops', label: 'المجموعات' },
  { to: 'transactions', label: 'المعاملات' },
  { to: 'sponsors', label: 'الممولين' },
  { to: 'announcements', label: 'الاعلانات' },
  { to: 'achievements', label: 'الانجازات' },
  { to: 'locations', label: 'المواقع' },
  { to: 'equipment', label: 'المعدات' },
  { to: 'verifications', label: 'تفعيل الحساب' },
  { to: 'camps', label: 'المعسكرات' },
  { to: 'gatherings', label: 'الاجتماعات' },
];

export default AdminDashboardLayout;
