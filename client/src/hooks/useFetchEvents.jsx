import axios from 'axios';
import { useEffect, useState } from 'react';

const getFetchEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/events', {
        headers: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0LCJyb2xlIjpudWxsfSwiaWF0IjoxNzMzNTI0MDE2LCJleHAiOjE3MzM1MjU4MTZ9.hdTrpa9akUEBFvettokWxVojenO98iRD8NV-kCv9mqQ',
        },
      })
      .then((response) => {
        console.log(response);
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return events;
};

export default getFetchEvents;
