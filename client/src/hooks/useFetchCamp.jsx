import { useEffect, useState } from 'react';
import useApi from './useApi';

const useFetchCamp = (id) => {
  const [camp, setCamp] = useState([]);
  const apiRequest = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campFetch = await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/camps/${id}`,
          method: 'GET',
        });
        setCamp(campFetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);

  return { ...camp };
};

export default useFetchCamp;
