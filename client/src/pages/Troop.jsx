import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  Grid,
  Card,
  CardContent,
  CardHeader,
  ListItemText,
  CircularProgress,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import useApi from '../hooks/useApi';
import useAuthStore from '../store/authStore';

const Troop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scouts, setScouts] = useState([]);
  const [troop, setTroop] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedScout, setSelectedScout] = useState(null);
  const [newAchievement, setNewAchievement] = useState('');
  const [AllAchievements, setAchievements] = useState([]);
  const [scoutAchievements, setScoutAchievements] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const apiRequest = useApi();
  const user = useAuthStore((state) => state.user);

  const fetchScoutAchievements = async (scoutId) => {
    try {
      const achievementsData = await apiRequest({
        url: `http://localhost:3000/api/scouts/${scoutId}/achievements`,
        method: 'GET',
      });
      setScoutAchievements(achievementsData.data);
      return achievementsData.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scoutsData = await apiRequest({
          url: `http://localhost:3000/api/troops/${id}/scouts`,
          method: 'GET',
        });
        const troopData = await apiRequest({
          url: `http://localhost:3000/api/troops/${id}`,
          method: 'GET',
        });
        const achievementsData = await apiRequest({
          url: `http://localhost:3000/api/achievements`,
          method: 'GET',
        });
        setAchievements(achievementsData.data);
        setTroop(troopData.data);
        setScouts(scoutsData.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleDialogOpen = async (scout) => {
    setSelectedScout(scout);
    console.log('Selected Scout:', scout);
    const scoutAchievements = await fetchScoutAchievements(scout.User_ID);
    const filteredAchievements = AllAchievements.filter(
      (achievement) =>
        !scoutAchievements.some(
          (scoutAchievement) =>
            scoutAchievement.Achievement_ID === achievement.Achievement_ID
        )
    );
    console.log('Filtered Achievements:', filteredAchievements);
    setAchievements(filteredAchievements);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedScout(null);
    setScoutAchievements([]);
    setNewAchievement('');
  };

  const handleAddAchievement = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/scouts/${selectedScout.User_ID}/achievements`,
        method: 'POST',
        data: {
          achievement_id: `${newAchievement}`,
          date: new Date().toDateString(),
        },
      });
      setSnackbarSeverity('success');
      setSnackbarMessage('!تمت إضافة الإنجاز بنجاح');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarSeverity('error');
      setSnackbarMessage('فشل إضافة الإنجاز');
      setSnackbarOpen(true);
    }
    handleDialogClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      <Container>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Scouts in Troop: {troop.Tname}
        </Typography>
        <Paper elevation={3}>
          <Grid container spacing={3} padding={'12px'}>
            {scouts.map((scout) => (
              <Grid item xs={12} sm={6} md={4} key={scout.User_ID}>
                <Card>
                  <CardHeader title={`${scout.Fname} ${scout.Lname}`} />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" dir="rtl">
                      الرتبة: {scout.rank}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" dir="rtl">
                      السنة الأكاديمية: {scout.academicYear}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" dir="rtl">
                      رقم الهاتف: {scout.Phonenum}
                    </Typography>
                    <div className="flex justify-end">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDialogOpen(scout)}
                      >
                        الانجازات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
      {troop.ScoutLeader_ID === user.User_ID && (
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
            onClick={() => {
              navigate(`/troops/${id}/attendance`);
            }}
          >
            الغياب
          </Button>
        </Box>
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h3" align="center">
            انجازات {selectedScout?.Fname} {selectedScout?.Lname}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">الانجازات الحالية:</Typography>
          {scoutAchievements.length > 0 ? (
            <List>
              {scoutAchievements.map(
                (achievement) => (
                  console.log(achievement),
                  (
                    <ListItem key={achievement.Achievement_ID}>
                      <ListItemText primary={achievement.Aname} />
                    </ListItem>
                  )
                )
              )}
            </List>
          ) : (
            <Typography variant="body1" align="center">
              لا يوجد انجازات
            </Typography>
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel style={{ color: 'grey', fontSize: '1.15rem' }}>
              إضافة إنجاز جديد
            </InputLabel>
            <Select
              autoFocus
              value={newAchievement}
              label="إضافة إنجاز جديد"
              onChange={(e) => setNewAchievement(e.target.value)}
            >
              {AllAchievements.map(
                (achievement) => (
                  console.log(achievement),
                  (
                    <MenuItem
                      key={achievement.Achievement_ID}
                      value={achievement.Achievement_ID}
                    >
                      {achievement.Aname}
                    </MenuItem>
                  )
                )
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleAddAchievement} color="primary">
            إضافة
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Troop;
