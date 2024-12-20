// import { NavLink, useNavigate } from 'react-router-dom';
// import useAuthStore from '../store/authStore';
// const AppHeader = () => {
//   const logout = useAuthStore((state) => state.logout);
//   const accessToken = useAuthStore((state) => state.accessToken);
//   const user = useAuthStore((state) => state.user);
//   const navigate = useNavigate();

//   const handleDashboardRoute = () => {
//     if (accessToken) {
//       if (user?.role) navigate(`/dashboard/${user?.role}`);
//       else navigate('verify');
//     }
//   };

//   return (
//     <div
//       className="navbar flex justify-between  bg-base-100 shadow-lg p-4 rtl"
//       dir="ltr"
//     >
//       {/* Dropdown Menu */}
//       <div className="navbar-start flex items-center">
//         {!accessToken ? (
//           <div className="flex gap-3 items-center ">
//             <NavLink
//               to="/login"
//               className="btn-primary px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
//             >
//               تسجيل الدخول
//             </NavLink>
//             <NavLink
//               to="/register"
//               className="btn-outline px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
//             >
//               انضم الينا
//             </NavLink>
//           </div>
//         ) : (
//           <div className="dropdown">
//             <label tabIndex={0} className="btn btn-ghost btn-circle">
//               <div className="w-10 rounded-full">
//                 <img src="https://via.placeholder.com/150" alt="User Avatar" />
//               </div>
//             </label>
//             <ul
//               tabIndex={0}
//               className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
//             >
//               <li className="font-bold">{user?.Fname}</li>
//               <li>
//                 <button onClick={handleDashboardRoute} className="nav-link">
//                   Dashboard
//                 </button>
//               </li>
//               <li>
//                 <button
//                   onClick={() => logout((path) => navigate(path))}
//                   className="btn btn-danger"
//                 >
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Navigation Links */}
//       <div className="navbar-center flex items-center justify-center gap-6">
//         <NavLink
//           to="/#events"
//           className="nav-link transition-transform transform hover:scale-105"
//         >
//           الاحداث
//         </NavLink>
//         <NavLink
//           to="/#news"
//           className="nav-link transition-transform transform hover:scale-105"
//         >
//           الاخبار
//         </NavLink>
//         <NavLink
//           to="/aboutUs"
//           className="nav-link transition-transform transform hover:scale-105"
//         >
//           من نحن
//         </NavLink>
//       </div>

//       {/* Logo Section */}
//       <div className="navbar-end">
//         <NavLink
//           to="/"
//           className="flex items-center transition-transform transform hover:scale-105"
//         >
//           <img
//             src="./src/assets/logo-dolphins-png.png"
//             alt="Logo"
//             className="h-40 w-auto"
//           />
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default AppHeader;

////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { NavLink, useNavigate } from 'react-router-dom';
// import useAuthStore from '../store/authStore';

// const AppHeader = () => {
//   const logout = useAuthStore((state) => state.logout);
//   const accessToken = useAuthStore((state) => state.accessToken);
//   const user = useAuthStore((state) => state.user);
//   const navigate = useNavigate();

//   const handleDashboardRoute = () => {
//     if (accessToken) {
//       if (user?.role) navigate(`/dashboard/${user?.role}`);
//       else navigate('verify');
//     }
//   };

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center py-3">
//         {/* Logo */}
//         <div className="flex items-center">
//           <NavLink to="/" className="flex items-center">
//             <img
//               src="./src/assets/logo-dolphins-png.png"
//               alt="Logo"
//               className="h-12 w-auto"
//             />
//             <span className="ml-3 text-xl font-semibold text-gray-800">
//               DolphinApp
//             </span>
//           </NavLink>
//         </div>

//         {/* Navigation Links */}
//         <nav className="hidden lg:flex space-x-6">
//           <NavLink
//             to="/#events"
//             className="text-gray-600 hover:text-primary font-medium transition duration-200"
//           >
//             الاحداث
//           </NavLink>
//           <NavLink
//             to="/#news"
//             className="text-gray-600 hover:text-primary font-medium transition duration-200"
//           >
//             الاخبار
//           </NavLink>
//           <NavLink
//             to="/aboutUs"
//             className="text-gray-600 hover:text-primary font-medium transition duration-200"
//           >
//             من نحن
//           </NavLink>
//         </nav>

//         {/* User Actions */}
//         <div className="flex items-center space-x-4">
//           {!accessToken ? (
//             <div className="flex gap-4">
//               <NavLink
//                 to="/login"
//                 className="px-4 py-2 text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark transition duration-200"
//               >
//                 تسجيل الدخول
//               </NavLink>
//               <NavLink
//                 to="/register"
//                 className="px-4 py-2 border border-primary text-primary rounded-lg shadow-md hover:bg-primary hover:text-white transition duration-200"
//               >
//                 انضم الينا
//               </NavLink>
//             </div>
//           ) : (
//             <div className="relative group">
//               <button className="flex items-center space-x-2">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     src="https://via.placeholder.com/150"
//                     alt="User Avatar"
//                   />
//                 </div>
//                 <span className="hidden lg:block font-medium text-gray-800">
//                   {user?.Fname}
//                 </span>
//               </button>
//               <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 hidden group-hover:block">
//                 <ul className="py-2">
//                   <li>
//                     <button
//                       onClick={handleDashboardRoute}
//                       className="block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left"
//                     >
//                       Dashboard
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => logout((path) => navigate(path))}
//                       className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
//                     >
//                       Logout
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div className="lg:hidden">
//         <div className="flex justify-between items-center px-4 py-3 bg-gray-100">
//           <NavLink to="/" className="text-lg font-semibold">
//             DolphinApp
//           </NavLink>
//           <button className="text-gray-700">
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6h16M4 12h16m-7 6h7"
//               ></path>
//             </svg>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AppHeader;

////////////////////////////////////////////////////////////////////////

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AppHeader = () => {
  const logout = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDashboardRoute = () => {
    if (accessToken) {
      if (user?.role) {
        if (user?.role === 'Scoutleader' && user?.isAdmin)
          navigate(`/dashboard/admin`);
        else navigate(`/dashboard/${user?.role}`);
      } else navigate('verify');
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
              src="./src/assets/logo-dolphins-png.png"
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
          <NavLink
            to="/#events"
            className="text-gray-600 hover:text-blue-600 font-medium transition duration-200 block lg:inline"
          >
            الاحداث
          </NavLink>
          <NavLink
            to="/#news"
            className="text-gray-600 hover:text-blue-600 font-medium transition duration-200 block lg:inline"
          >
            الاخبار
          </NavLink>
          <NavLink
            to="/aboutUs"
            className="text-gray-600 hover:text-blue-600 font-medium transition duration-200 block lg:inline"
          >
            من نحن
          </NavLink>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {!accessToken ? (
            <div className="flex gap-4">
              <NavLink
                to="/login"
                className="px-4 py-2 text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark transition duration-200"
              >
                تسجيل الدخول
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 border border-primary text-primary rounded-lg shadow-md hover:bg-primary hover:text-white transition duration-200"
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
                <span className="hidden lg:block font-medium text-gray-800">
                  {user?.Fname}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleDashboardRoute}
                        className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 w-full text-left"
                      >
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => logout((path) => navigate(path))}
                        className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                      >
                        Logout
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
