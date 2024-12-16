import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEventsData = await fetch(
          'http://localhost:3000/api/events'
        ).then((res) => res.json());
        console.log(allEventsData);
        const currentDate = new Date();
        const pastEvents = allEventsData.filter(
          (event) => new Date(event.Edate) <= currentDate
        );
        setEvents(pastEvents);
        console.log(pastEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      const fetchScouts = async () => {
        setLoading(true);
        try {
          const scoutsData = await fetch(
            `http://localhost:3000/api/troops/${id}/scouts`
          ).then((res) => res.json());
          const attendanceData = await fetch(
            `http://localhost:3000/api/events/${selectedEventId}/attendance`
          ).then((res) => res.json());
          const attendance = scoutsData.reduce((acc, scout) => {
            acc[scout.User_ID] = attendanceData.some(
              (a) => a.User_ID === scout.User_ID
            );
            return acc;
          }, {});
          setAttendance(attendance);
          setScouts(scoutsData);
          console.log(scoutsData);
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
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [scoutId]: !prevAttendance[scoutId],
    }));
  };

  const handleSaveAttendance = async () => {
    // try {
    //   await fetch(
    //     `http://localhost:3000/api/events/${selectedEventId}/attendance`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(attendance),
    //     }
    //   );
    //   alert('Attendance saved successfully');
    // } catch (err) {
    //   console.error(err);
    //   alert('Failed to save attendance');
    // }
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
                                checked={attendance[scout.User_ID]}
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
    </Container>
  );
}

export default TroopAttendance;
