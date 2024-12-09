// import { Link } from 'react-router-dom';
// import { Box, List, ListItem, ListItemText } from '@mui/material';

// const Sidebar = () => {
//   return (
//     <Box
//       sx={{
//         width: 250,
//         height: '100vh',
//         bgcolor: 'primary.main',
//         color: 'white',
//         padding: 2,
//       }}
//     >
//       <h2>لوحة التحكم</h2>
//       <List>
//         <ListItem button component={Link} to="/adminDashboard/scouts">
//           <ListItemText primary="الكشافون" />
//         </ListItem>
//         <ListItem button component={Link} to="/adminDashboard/parents">
//           <ListItemText primary="أولياء الأمور" />
//         </ListItem>
//         <ListItem button component={Link} to="/adminDashboard/leaders">
//           <ListItemText primary="قادة الكشافين" />
//         </ListItem>
//         <ListItem button component={Link} to="/adminDashboard/transactions">
//           <ListItemText primary="المعاملات المالية" />
//         </ListItem>
//         <ListItem button component={Link} to="/adminDashboard/sponsors">
//           <ListItemText primary="سجل الرعاة" />
//         </ListItem>
//         <ListItem button component={Link} to="/adminDashboard/announcements">
//           <ListItemText primary="الإعلانات" />
//         </ListItem>
//         <ListItem button component={Link} to="/adminDashboard/addLeader">
//           <ListItemText primary="إضافة قائد جديد" />
//         </ListItem>
//         <ListItem button component={Link} to="/adminDashboard/requests">
//           <ListItemText primary="طلبات السحب" />
//         </ListItem>
//       </List>
//     </Box>
//   );
// };

// export default Sidebar;

import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineBell } from 'react-icons/hi';
import { FaTrophy } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar w-full md:w-64 bg-gray-800 text-white h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-10">Scout Dashboard</h1>
      <nav className="flex flex-col space-y-4 w-full">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2 rounded-md ${
              isActive ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'
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
              isActive ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'
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
              isActive ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'
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
