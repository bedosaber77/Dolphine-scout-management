import axios from 'axios';
import { useEffect, useState } from 'react';

const getFetchEvent = (id) => {
  const [event, setEvent] = useState([]);
  const [leader, setLeader] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/events/${id}`)
      .then((response) => {
        setEvent(response.data);
        axios
          .get(
            `http://localhost:3000/api/scoutleaders/${response.data.ScoutLeader_ID}`
          )
          .then((response) => {
            setLeader(response.data);
          });
        axios
          .get(
            `http://localhost:3000/api/locations/${response.data.Location_ID}`
          )
          .then((response) => {
            setLocation(response.data);
          });
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
      });
  }, []);
  return { ...event, ...leader, ...location };
};

export default getFetchEvent;
