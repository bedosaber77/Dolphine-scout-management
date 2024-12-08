import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
const AppHeader = () => {
  const logout = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleDashboardRoute = () => {
    if (accessToken) {
      if (user.role === 'scout') navigate('/scoutDashboard');
      // else if (user.role === 'leader') navigate('/leaderDashboard');
      // else if (user.role === 'parent') navigate('/parentDashboard');
      else if (user.role === 'admin') navigate('/adminDashboard');
      else navigate('/verify');
    }
  };

  return (
    <div
      className="navbar flex justify-between  bg-base-100 shadow-lg p-4 rtl"
      dir="ltr"
    >
      {/* Dropdown Menu */}
      <div className="navbar-start flex items-center">
        {!accessToken ? (
          <div className="flex gap-3 items-center ">
            <NavLink
              to="/login"
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
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="w-10 rounded-full">
                <img src="https://via.placeholder.com/150" alt="User Avatar" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="font-bold">{user?.Fname}</li>
              <li>
                <button onClick={handleDashboardRoute} className="nav-link">
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => logout((path) => navigate(path))}
                  className="btn btn-danger"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="navbar-center flex items-center justify-center gap-6">
        <NavLink
          to="/#events"
          className="nav-link transition-transform transform hover:scale-105"
        >
          الاحداث
        </NavLink>
        <NavLink
          to="/#news"
          className="nav-link transition-transform transform hover:scale-105"
        >
          الاخبار
        </NavLink>
        <NavLink
          to="/aboutUs"
          className="nav-link transition-transform transform hover:scale-105"
        >
          من نحن
        </NavLink>
      </div>

      {/* Logo Section */}
      <div className="navbar-end">
        <NavLink
          to="/"
          className="flex items-center transition-transform transform hover:scale-105"
        >
          <img
            src="./src/assets/logo-dolphins-png.png"
            alt="Logo"
            className="h-40 w-auto"
          />
        </NavLink>
      </div>
    </div>
  );
};

export default AppHeader;
