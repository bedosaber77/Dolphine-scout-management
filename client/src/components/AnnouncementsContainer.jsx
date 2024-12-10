import { useNavigate } from 'react-router-dom';

const AnnouncementCard = ({ announcement }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {announcement.Content}
      </h3>
      <p className="text-sm text-gray-600">
        <span className="font-bold">Priority:</span> {announcement.Priority}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-bold">Date:</span>{' '}
        {new Date(announcement.CreateDate).toLocaleString()}
      </p>
    </div>
  );
};

// Sort announcements by date, most recent first
const AnnouncementsContainer = ({ announcements }) => {
  const navigate = useNavigate();
  // Sort announcements by date, most recent first
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.CreateDate) - new Date(a.CreateDate)
  );

  return (
    <div className="flex flex-col gap-6 justify-center bg-gray-100 p-6 rounded-lg relative ">
      <div className="flex flex-wrap gap-6 justify-center">
        {sortedAnnouncements.map((announcement) => (
          <AnnouncementCard
            key={announcement.Announcement_ID}
            announcement={announcement}
          />
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => navigate('/announcements')}
        >
          عرض كل الاعلانات
        </button>
      </div>
    </div>
  );
};

export default AnnouncementsContainer;