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
          url: `${import.meta.env.VITE_BASEURL}/api/events/${id}`,
          method: 'GET',
        });
        const leaderFetch = await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/scoutleaders/${eventFetch.data.ScoutLeader_ID}`,
          method: 'GET',
        });
        const locationFetch = await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/locations/${eventFetch.data.Location_ID}`,
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
