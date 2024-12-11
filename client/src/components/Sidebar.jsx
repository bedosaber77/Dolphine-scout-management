import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineBell } from 'react-icons/hi';
import { FaTrophy } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div
      className="sidebar w-full md:w-64 text-white h-screen flex flex-col items-center p-4"
      style={{ backgroundColor: 'var(--secondary-hover)' }}
    >
      <h1 className="text-2xl font-bold mb-10">Scout Dashboard</h1>
      <nav className="flex flex-col space-y-4 w-full">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2 rounded-md ${
              isActive ? 'bg-blue-700 text-blue-400' : 'hover:bg-blue-700'
            }`
          }
        >
          <HiOutlineHome className="text-xl" />
          Dashboard
        </NavLink>
        <NavLink
          to="/announcements"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2 rounded-md ${
              isActive ? 'bg-gray-700 text-blue-400' : 'hover:bg-blue-700'
            }`
          }
        >
          <HiOutlineBell className="text-xl" />
          Announcements
        </NavLink>
        <NavLink
          to="/achievements"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2 rounded-md ${
              isActive ? 'bg-blue-700 text-blue-400' : 'hover:bg-blue-700'
            }`
          }
        >
          <FaTrophy className="text-xl" />
          Achievements
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
