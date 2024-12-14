import EmblaCarousel from '../components/ui/EmblaCarousel';
import { useParams } from 'react-router-dom';
import useFetchEvent from '../hooks/useFetchEvent';
import useFetchGathering from '../hooks/useFetchGathering';
import useFetchCamp from '../hooks/useFetchCamp';
import '../styles/base.css';
import '../styles/embla.css';
import '../styles/eventLayout.css';

const IMAGES = [
  'https://plus.unsplash.com/premium_photo-1661893427047-16f6ddc173f6?q=80&w=500&h=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1541790453029-41ad91024de6?w=500&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2F5YWt8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1450500392544-c2cb0fd6e3b8?w=500&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8a2F5YWt8ZW58MHx8MHx8fDA%3D',
];

const OPTIONS = {
  direction: 'rtl', // right to Left
};
const Event = () => {
  const { id } = useParams();
  const event = useFetchEvent(id);
  const gathering = useFetchGathering(id);
  const camp = useFetchCamp(id);
  if (event.length === 0) {
    return <p>event not found</p>;
  } else {
    return (
      <>
        <EmblaCarousel slides={IMAGES} options={OPTIONS} />
        <div className="layout">
          <div className="meeting-details">
            <ul>
              <li>{event.Ename}</li>
              <li>
                التاريخ:{' '}
                {new Date(event.Edate).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </li>
              <li>المكان: {event.LocationName}</li>
              <li>القائد: {event.name}</li>
              <li>حضرت: ×</li>
              <li>الميزانية: {event.Budget}</li>
            </ul>
            <button className="attendance-button">سجل الحضور</button>
          </div>
          {Object.keys(camp).length > 0 && (
            <div className="event-info">
              <p>تفاصيل المخيم</p>
              <p>{camp.Season != '' && camp.Season}</p>
              <p>
                المدة: {camp.Duration.days !== undefined && camp.Duration.days}{' '}
                ايام
              </p>
            </div>
          )}
          {Object.keys(gathering).length > 0 && (
            <div className="event-info">
              <p>نواتج الاجتماع</p>
              <p>
                {gathering.GeneralOutcome != '' && gathering.GeneralOutcome}
              </p>
              <p>
                {gathering.EducationalOutcome != '' &&
                  gathering.EducationalOutcome}
              </p>
              <p>
                {gathering.PhysicalOutcome != '' && gathering.PhysicalOutcome}
              </p>
              <p>
                {gathering.ScientificOutcome != '' &&
                  gathering.ScientificOutcome}
              </p>
              <p>{gathering.ArtOutcome != '' && gathering.ArtOutcome}</p>
              <p>{gathering.ExtraOutcome != '' && gathering.ExtraOutcome}</p>
            </div>
          )}
        </div>
      </>
    );
  }
};

export default Event;
