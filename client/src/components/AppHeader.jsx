import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { HashLink } from 'react-router-hash-link';

const AppHeader = () => {
  const logout = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleDashboardRoute = () => {
    toggleDropdown();
    if (accessToken) {
      if (user?.role) {
        if (user?.role === 'Scoutleader' && user?.isAdmin)
          navigate(`/dashboard/admin`);
        else navigate(`/dashboard/${user?.role}`);
      } else navigate('verify');
    }
  };

  const handleSettingsRoute = () => {
    toggleDropdown();
    if (accessToken) {
      //console.log('Settings');
      navigate('/settings');
    }
  };
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="bg-white shadow-md  sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center">
            <img
              src="/logo-dolphins-png.png"
              alt="Logo"
              className="h-40 w-auto"
            />
            <span className="ml-3 text-xl font-semibold text-gray-800">
              Dolphins Scouts
            </span>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } lg:flex lg:space-x-6 gap-10 lg:items-center md:flex md:space-x-6 md:items-center`}
        >
          {isHomePage && (
            <>
              <HashLink
                to="/#achievements"
                className="text-gray-600 hover:text-blue-600 font-medium transition duration-200 block lg:inline"
              >
                الدروع و الجوائز
              </HashLink>
              <HashLink
                to="/#camps"
                className="text-gray-600 hover:text-blue-600 font-medium transition duration-200 block lg:inline"
              >
                المعسكرات
              </HashLink>
              <HashLink
                to="/#aboutUs"
                className="text-gray-600 hover:text-blue-600 font-medium transition duration-200 block lg:inline"
              >
                من نحن
              </HashLink>
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {!accessToken ? (
            <div className="flex gap-4">
              <NavLink
                to="/login"
                className="px-4 py-2 btn-primary rounded-lg shadow-md hover:bg-blue-900 transition duration-200"
              >
                تسجيل الدخول
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 border btn-primary border-primary text-primary rounded-lg shadow-md hover:bg-blue-900 hover:text-white transition duration-200"
              >
                انضم الينا
              </NavLink>
            </div>
          ) : (
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={toggleDropdown}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="User Avatar"
                  />
                </div>
                <span className="md:block hidden font-medium text-gray-800">
                  {user?.Fname}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleDashboardRoute}
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 w-full text-center"
                      >
                        لوحة التحكم
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleSettingsRoute}
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 text-center text-xl w-full"
                      >
                        اعدادات الحساب
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          toggleDropdown();
                          logout((path) => navigate(path));
                        }}
                        className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-center"
                      >
                        تسجيل الخروج
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger Menu */}
        <button
          className="lg:hidden md:hidden text-gray-700"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
