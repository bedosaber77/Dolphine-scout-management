import '../styles/eventLayout.css';
import useFetchEvents from '../hooks/useFetchEvents';
import { Link } from 'react-router-dom';

const Events = () => {
  const events = useFetchEvents();
  return (
    <div className="eventLayout">
      <div className="meeting-details">
        <div>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.Event_ID}>
                <p>
                  {event.Ename} -{' '}
                  {new Date(event.Edate).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  <a>
                    <Link to={`/events/${event.Event_ID}`}>زيارة</Link>
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p>Loading events...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
