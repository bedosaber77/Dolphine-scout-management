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
} from '@mui/material';
import useApi from '../hooks/useApi';

const Troop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scouts, setScouts] = useState([]);
  const [troop, setTroop] = useState({});
  const [loading, setLoading] = useState(true);
  const apiRequest = useApi();

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
        setTroop(troopData.data);
        setScouts(scoutsData.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
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
    </Container>
  );
};

export default Troop;
