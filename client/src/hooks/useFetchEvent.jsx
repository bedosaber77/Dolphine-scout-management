import axios from "axios";
import { useEffect, useState } from "react";

const getFetchEvent = (id) => {
  const [event, setEvent] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/events/${id}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, []);

  return event;
};

export default getFetchEvent;
