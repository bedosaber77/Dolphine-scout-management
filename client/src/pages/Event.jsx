import EmblaCarousel from '../components/ui/EmblaCarousel';
import { useParams } from 'react-router-dom';
import useFetchEvent from '../hooks/useFetchEvent';
import useFetchGathering from '../hooks/useFetchGathering';
import useFetchCamp from '../hooks/useFetchCamp';
import '../styles/base.css';
import '../styles/embla.css';

const IMAGES = [
  'https://plus.unsplash.com/premium_photo-1661893427047-16f6ddc173f6?q=80&w=500&h=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1541790453029-41ad91024de6?w=500&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2F5YWt8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1450500392544-c2cb0fd6e3b8?w=500&h=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8a2F5YWt8ZW58MHx8MHx8fDA%3D',
];

const OPTIONS = {
  direction: 'rtl', // Right-to-left
};

const Event = () => {
  const { id } = useParams();
  const event = useFetchEvent(id);
  const gathering = useFetchGathering(id);
  const camp = useFetchCamp(id);

  if (!event || event.length === 0) {
    return <p className="text-center text-lg font-medium">Event not found</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Event Details Section */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {event.Ename}
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li>
                <strong>التاريخ:</strong>{' '}
                {new Date(event.Edate).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </li>
              <li>
                <strong>المكان:</strong> {event.LocationName}
              </li>
              <li>
                <strong>القائد:</strong> {event.name}
              </li>
              <li>
                <strong>حضرت:</strong> 
              </li>
              <li>
                <strong>الميزانية:</strong> {event.Budget}
              </li>
            </ul>
            <button className="mt-6 w-full lg:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
              سجل الحضور
            </button>
          </div>
          {/* Carousel Section */}
        </div>
        <div className="col-span-1 flex justify-center lg:justify-start">
          <EmblaCarousel slides={IMAGES} options={OPTIONS} />
        </div>
      </div>

      {/* Gathering Outcomes and Camp Details */}
      <div className="bg-white rounded-lg shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gathering Outcomes Section */}
        {Object.keys(gathering).length > 0 && (
          <div className="col-span-1">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              نواتج الاجتماع
            </h3>
            <ul className="space-y-3 text-gray-700">
              {gathering.GeneralOutcome && (
                <li>✅ {gathering.GeneralOutcome}</li>
              )}
              {gathering.EducationalOutcome && (
                <li>📘 {gathering.EducationalOutcome}</li>
              )}
              {gathering.PhysicalOutcome && (
                <li>💪 {gathering.PhysicalOutcome}</li>
              )}
              {gathering.ScientificOutcome && (
                <li>🔬 {gathering.ScientificOutcome}</li>
              )}
              {gathering.ArtOutcome && <li>🎨 {gathering.ArtOutcome}</li>}
              {gathering.ExtraOutcome && <li>⭐ {gathering.ExtraOutcome}</li>}
            </ul>
          </div>
        )}

        {/* Camp Details Section */}
        {Object.keys(camp).length > 0 && (
          <div className="col-span-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              تفاصيل المخيم
            </h3>
            <p className="text-gray-700 mb-2">{camp.Season}</p>
            <p className="text-gray-700">
              <strong>المدة:</strong>{' '}
              {camp.Duration.days !== undefined && camp.Duration.days} أيام
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
