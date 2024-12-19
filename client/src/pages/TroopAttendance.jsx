import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

function TroopAttendance() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [scouts, setScouts] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [newAttendance, setNewAttendance] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const apiRequest = useApi();

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEventsData = await apiRequest({
          url: 'http://localhost:3000/api/events',
          method: 'GET',
        });
        const currentDate = new Date();
        const pastEvents = allEventsData.data.filter(
          (event) => new Date(event.Edate) <= currentDate
        );
        setEvents(pastEvents);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      const fetchScouts = async () => {
        setLoading(true);
        try {
          const scoutsData = await apiRequest({
            url: `http://localhost:3000/api/troops/${id}/scouts`,
            method: 'GET',
          });
          const attendanceData = await apiRequest({
            url: `http://localhost:3000/api/events/${selectedEventId}/attendance`,
            method: 'GET',
          });
          const attendance = scoutsData.data.reduce((acc, scout) => {
            acc[scout.User_ID] = attendanceData.data.some(
              (a) => a.User_ID === scout.User_ID
            );
            return acc;
          }, {});
          setAttendance(attendance);
          setNewAttendance(attendance);
          setScouts(scoutsData.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchScouts();
    }
  }, [selectedEventId]);

  const handleAttendanceChange = (scoutId) => {
    setNewAttendance((prevAttendance) => {
      const newAttendance = {
        ...prevAttendance,
        [scoutId]: !prevAttendance[scoutId],
      };
      return newAttendance;
    });
  };

  const handleSaveAttendance = async () => {
    for (const scoutId of Object.keys(newAttendance)) {
      if (newAttendance[scoutId] !== attendance[scoutId]) {
        if (newAttendance[scoutId] === true) {
          try {
            await fetch(
              `http://localhost:3000/api/events/${selectedEventId}/attendance`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  Scout_ID: scoutId,
                }),
              }
            );
          } catch (err) {
            console.error(err);
          }
        } else {
          try {
            await fetch(
              `http://localhost:3000/api/events/${selectedEventId}/attendance/${scoutId}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    setAttendance(newAttendance);
    setShowSnackbar(true);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Select Event to Take Attendance
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="select-event-label">Select Event</InputLabel>
        <Select
          labelId="select-event-label"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          {events.map((event) => (
            <MenuItem key={event.Event_ID} value={event.Event_ID}>
              {event.Ename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedEventId && (
        <>
          <Paper elevation={3}>
            <Grid container spacing={3} padding={'12px'}>
              {scouts.map((scout) => (
                <Grid item xs={12} key={scout.User_ID}>
                  <Card>
                    <CardContent>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <Typography variant="h6">
                            {scout.Fname} {scout.Lname}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={newAttendance[scout.User_ID]}
                                onChange={() =>
                                  handleAttendanceChange(scout.User_ID)
                                }
                                color="primary"
                              />
                            }
                            label="حضور"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                backgroundColor: 'var(--footer-bg)',
                borderColor: 'var(--footer-bg)',
                fontSize: '1.5rem',
                padding: '12px 24px',
                '&:hover': {
                  backgroundColor: 'var(--footer-bg)',
                  borderColor: 'var(--footer-bg)',
                },
              }}
              onClick={handleSaveAttendance}
            >
              حفظ الحضور
            </Button>
          </Box>
        </>
      )}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Attendance saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default TroopAttendance;
