import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  Alert,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import useAuthStore from '../store/authStore';

const color = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

const ScoutLeaderDashboard = () => {
  const apiRequest = useApi();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [troops, setTroops] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleButtonClick = () => {
    navigate('/leader/troops/');
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        //setLoading(true);
        //setLoading(false)
        // const troopsData = await fetch('/api/troops').then((res) => res.json());
        // const announcementsData = await fetch('/api/announcements').then(
        //   (res) => res.json()
        // );
        // setEvents(eventsData);
        // setTroops(troopsData);
        // setAnnouncements(announcementsData);
        const eventsFetch = await apiRequest({
          url: 'http://localhost:3000/api/events',
          method: 'GET',
        });
        const troopsFetch = await apiRequest({
          url: `http://localhost:3000/api/troops/leader/${user.User_ID}`,
          method: 'GET',
        });
        const announcementsFetch = await apiRequest({
          url: 'http://localhost:3000/api/announcements',
          method: 'GET',
        });
        console.log(troopsFetch.data);
        setEvents(eventsFetch.data);
        setTroops(troopsFetch.data);
        setAnnouncements(announcementsFetch.data);
        console.log(eventsFetch.data);
      } catch (err) {
        console.error(err);
        // setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiRequest, user]);

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ marginTop: '20px' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  align="center"
                  style={{ fontWeight: 'bold' }}
                >
                  Events
                </Typography>
              }
            />
            <CardContent>
              <List>
                {events.map((event, index) => (
                  <ListItem key={index}>
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      justifyContent="space-around"
                    >
                      <Typography variant="h4">{event.Ename}</Typography>
                      <Typography variant="body2" textAlign="center">
                        {new Date(event.Edate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  align="center"
                  style={{ fontWeight: 'bold' }}
                >
                  مجموعاتي
                </Typography>
              }
            />
            <CardContent>
              <List>
                {troops.map((troop, index) => (
                  <ListItem key={index}>
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      justifyContent="space-around"
                    >
                      {troop.Tname}
                      <Button
                        variant="outlined"
                        sx={{
                          color: 'white',
                          backgroundColor: 'var(--footer-bg)',
                          borderColor: 'var(--footer-bg)',
                          '&:hover': {
                            backgroundColor: 'var(--footer-bg)', // Define this variable in your CSS
                            borderColor: 'var(--footer-bg)',
                          },
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  align="center"
                  style={{ fontWeight: 'bold' }}
                >
                  Announcements
                </Typography>
              }
            />
            <CardContent>
              <List>
                {announcements.map((announcement, index) => (
                  <ListItem key={index}>
                    {' '}
                    <Typography
                      variant="body1"
                      color={color[announcement.Priority]}
                    >
                      {announcement.Content}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={color[announcement.Priority]}
                      style={{ margin: '20px' }}
                    >
                      {new Date(announcement.CreateDate).toLocaleDateString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ScoutLeaderDashboard;
