import axios from "axios";
import { useEffect, useState } from "react";

const getFetchLocation = (id) => {
  const [Location, setLocation] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASEURL}/api/locations/${id}`)
      .then((response) => {
        setLocation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Location:", error);
      });
  }, []);

  return Location;
};

export default getFetchLocation;
