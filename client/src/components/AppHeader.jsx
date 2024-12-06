import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

const AppHeader = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-background shadow-md p-4 rtl">
      {/* Buttons Section */}
      <div className="navbar-start flex items-center">
        {!auth.isAuthenticated ? (
          <div className="flex gap-3">
            <NavLink
              to="/adminDashboard"
              className="btn-primary px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              تسجيل الدخول
            </NavLink>
            <NavLink
              to="/register"
              className="btn-outline px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
            >
              انضم الينا
            </NavLink>
          </div>
        ) : (
          <button
            onClick={() => auth.logOut((path) => navigate(path))}
            className="btn-danger px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            تسجيل الخروج
          </button>
        )}
      </div>

      {/* Logo Section */}
      <div className="navbar-center">
        <NavLink to="/" className="flex items-center">
          <img
            src="./src/assets/logo-dolphins-png.png"
            alt="Logo"
            className="h-16 w-auto"
          />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="navbar-end flex justify-center gap-6">
        <NavLink to="/#events" className="nav-link">
          الاحداث
        </NavLink>
        <NavLink to="/#news" className="nav-link">
          الاخبار
        </NavLink>
        <NavLink to="/aboutUs" className="nav-link">
          من نحن
        </NavLink>
      </div>
    </div>
  );
};

export default AppHeader;
