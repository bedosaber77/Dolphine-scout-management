import EmblaCarousel from '../components/ui/EmblaCarousel';
import { useParams } from 'react-router-dom';
import useFetchEvent from '../hooks/useFetchEvent';
import useFetchGathering from '../hooks/useFetchGathering';
import useFetchCamp from '../hooks/useFetchCamp';
import '../styles/base.css';
import '../styles/embla.css';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useEffect, useState } from 'react';

const OPTIONS = {
  direction: 'rtl', // Right-to-left
};

const Event = () => {
  const { id } = useParams();
  const { accessToken, user } = useAuthStore();
  const event = useFetchEvent(id);
  const gathering = useFetchGathering(id);
  const camp = useFetchCamp(id);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/events/${id}/media`,
        {
          headers: {
            accessToken: accessToken, // Ensure accessToken is defined
          },
        }
      );
      setImages(response.data); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const IMAGES = images.map((image) => image.Link);

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
              {user?.role === 'scout' && (
                <li>
                  <strong>حضرت:</strong>
                </li>
              )}
              <li>
                <strong>الميزانية:</strong> {event.Budget}
              </li>
            </ul>
            {user?.role === 'Scoutleader' && (
              <button className="mt-6 w-full lg:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
                سجل الحضور
              </button>
            )}
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
