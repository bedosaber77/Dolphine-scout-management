import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
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
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Scouts in Troop: {troop.Tname}
      </Typography>
      <Paper elevation={3}>
        <List>
          {scouts.map((scout) => (
            <ListItem key={scout.User_ID}>
              <ListItemText
                primary={
                  <Typography variant="h5">
                    {scout.Fname + ' ' + scout.Lname}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Troop;
