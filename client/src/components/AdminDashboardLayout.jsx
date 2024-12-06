import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Slidebar';
const AdminDashboard = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      {/* Sidebar */}
      <Box>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: 3,
          bgcolor: '#f5f5f5', // Light gray background for better contrast
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
