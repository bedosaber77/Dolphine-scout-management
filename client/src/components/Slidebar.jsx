import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        bgcolor: 'primary.main',
        color: 'white',
        padding: 2,
      }}
    >
      <h2>لوحة التحكم</h2>
      <List>
        <ListItem button component={Link} to="/adminDashboard/scouts">
          <ListItemText primary="الكشافون" />
        </ListItem>
        <ListItem button component={Link} to="/adminDashboard/parents">
          <ListItemText primary="أولياء الأمور" />
        </ListItem>
        <ListItem button component={Link} to="/adminDashboard/leaders">
          <ListItemText primary="قادة الكشافين" />
        </ListItem>
        <ListItem button component={Link} to="/adminDashboard/transactions">
          <ListItemText primary="المعاملات المالية" />
        </ListItem>
        <ListItem button component={Link} to="/adminDashboard/sponsors">
          <ListItemText primary="سجل الرعاة" />
        </ListItem>
        <ListItem button component={Link} to="/adminDashboard/announcements">
          <ListItemText primary="الإعلانات" />
        </ListItem>
        <ListItem button component={Link} to="/adminDashboard/addLeader">
          <ListItemText primary="إضافة قائد جديد" />
        </ListItem>
        <ListItem button component={Link} to="/adminDashboard/requests">
          <ListItemText primary="طلبات السحب" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
