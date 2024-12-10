import { useEffect, useState } from 'react';
import useApi from './useApi';

const useFetchEvent = (id) => {
  const [event, setEvent] = useState([]);
  const [leader, setLeader] = useState([]);
  const [location, setLocation] = useState([]);
  const apiRequest = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventFetch = await apiRequest({
          url: `http://localhost:3000/api/events/${id}`,
          method: 'GET',
        });
        const leaderFetch = await apiRequest({
          url: `http://localhost:3000/api/scoutleaders/${eventFetch.data.ScoutLeader_ID}`,
          method: 'GET',
        });
        const locationFetch = await apiRequest({
          url: `http://localhost:3000/api/locations/${eventFetch.data.Location_ID}`,
          method: 'GET',
        });
        setEvent(eventFetch.data);
        setLeader(leaderFetch.data);
        setLocation(locationFetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);

  return { ...event, ...leader, ...location };
};

export default useFetchEvent;
