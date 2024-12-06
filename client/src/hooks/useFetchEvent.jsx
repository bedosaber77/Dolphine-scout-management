import axios from "axios";
import { useEffect, useState } from "react";

const getFetchEvent = (id) => {
  const [event, setEvent] = useState([]);
  const [location, setLocation] = useState([]);
  const [leader, setLeader] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/events/${id}`)
      .then((response) => {
        setEvent(response.data);
        axios
          .get(
            `http://localhost:3000/api/locations/${response.data.Location_ID}`
          )
          .then((response) => {
            setLocation(response.data);
          })
          .catch((error) => {
            console.error("Error fetching Location:", error);
          });
        axios
          .get(
            `http://localhost:3000/api/scoutleaders/${response.data.ScoutLeader_ID}`
          )
          .then((response) => {
            setLeader(response.data);
          })
          .catch((error) => {
            console.error("Error fetching ScoutLeader:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, []);

  return { ...event, ...location, ...leader };
};

export default getFetchEvent;
