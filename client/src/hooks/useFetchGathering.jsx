import { useEffect, useState } from 'react';
import useApi from './useApi';

const useFetchGathering = (id) => {
  const [gathering, setGathering] = useState([]);
  const apiRequest = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gatheringFetch = await apiRequest({
          url: `http://localhost:3000/api/gatherings/${id}`,
          method: 'GET',
        });
        setGathering(gatheringFetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);

  return { ...gathering };
};

export default useFetchGathering;
