import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const Troop = () => {
  const { id } = useParams();
  const [scouts, setScouts] = useState([]);
  const [troop, setTroop] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scoutsData = await fetch(
          `http://localhost:3000/api/troops/${id}/scouts`
        ).then((res) => res.json());
        const troopData = await fetch(
          `http://localhost:3000/api/troops/${id}`
        ).then((res) => res.json());
        console.log(scoutsData);
        setTroop(troopData);
        setScouts(scoutsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
        >
          الغياب
        </Button>
      </Box>
    </Container>
  );
};

export default Troop;
