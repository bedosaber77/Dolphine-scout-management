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
import UpcomingEvents from '../components/UpcomingEvents';
import AnnouncementsContainer from '../components/AnnouncementsContainer';

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

  const handleButtonClick = (id) => {
    navigate(`/troops/${id}`);
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
        setEvents(eventsFetch.data);
        setTroops(troopsFetch.data);
        setAnnouncements(announcementsFetch.data);
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
  const upcomingEvents = events
    .filter((event) => new Date(event.Edate) > new Date())
    .map((event) => {
      return {
        id: event.Event_ID,
        name: event.Ename,
        date: new Date(event.Edate).toISOString().split('T')[0],
        details: event.Ename,
      };
    });

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            {events.length > 0 ? (
              <UpcomingEvents events={upcomingEvents} />
            ) : (
              <CardContent>
                <Typography align="center">No upcoming events</Typography>
              </CardContent>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Typography
                  variant="h4"
                  align="center"
                  style={{ fontWeight: 'bold' }}
                >
                  مجموعاتي
                </Typography>
              }
            />
            <CardContent>
              {troops.length > 0 ? (
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
                              backgroundColor: 'var(--footer-bg)',
                              borderColor: 'var(--footer-bg)',
                            },
                          }}
                          onClick={() => handleButtonClick(troop.Troop_ID)}
                        >
                          View
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography align="center">No troops available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Typography
                  variant="h4"
                  align="center"
                  style={{ fontWeight: 'bold' }}
                >
                  الإعلانات
                </Typography>
              }
            />
            {announcements.length > 0 ? (
              <AnnouncementsContainer announcements={announcements} />
            ) : (
              <CardContent>
                <Typography align="center">No announcements</Typography>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ScoutLeaderDashboard;
