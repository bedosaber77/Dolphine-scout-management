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
        <ListItem button component={Link} to="/scouts">
          <ListItemText primary="الكشافون" />
        </ListItem>
        <ListItem button component={Link} to="/parents">
          <ListItemText primary="أولياء الأمور" />
        </ListItem>
        <ListItem button component={Link} to="/leaders">
          <ListItemText primary="قادة الكشافين" />
        </ListItem>
        <ListItem button component={Link} to="/finance">
          <ListItemText primary="إدارة مالية" />
        </ListItem>
        <ListItem button component={Link} to="/sponsors">
          <ListItemText primary="سجل الرعاة" />
        </ListItem>
        <ListItem button component={Link} to="/announcements">
          <ListItemText primary="الإعلانات" />
        </ListItem>
        <ListItem button component={Link} to="/add">
          <ListItemText primary="إضافة عناصر جديدة" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
