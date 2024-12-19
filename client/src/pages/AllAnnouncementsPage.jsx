import { useEffect } from 'react';
import { useState } from 'react';
import useApi from '../hooks/useApi';
import { BiUpArrowAlt } from 'react-icons/bi';

const AllAnnouncementsPage = () => {
  const apiRequest = useApi();
  const [announcements, setAnnouncements] = useState([]);
  const [dateAsc, setDateAsc] = useState(true);
  const [priorityAsc, setPriorityAsc] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await apiRequest({
          url: 'http://localhost:3000/api/announcements',
          method: 'GET',
        });
        setAnnouncements(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnnouncements();
  }, [apiRequest]);

  const handleSortDate = () => {
    if (dateAsc) {
      const sortedAnnouncements = [...announcements].sort((a, b) => {
        return new Date(b.CreateDate) - new Date(a.CreateDate);
      });
      setAnnouncements(sortedAnnouncements);
    } else {
      const sortedAnnouncements = [...announcements].sort((a, b) => {
        return new Date(a.CreateDate) - new Date(b.CreateDate);
      });
      setAnnouncements(sortedAnnouncements);
    }
    setDateAsc(!dateAsc);
  };

  const handleSortPriority = () => {
    if (priorityAsc) {
      const sortedAnnouncements = [...announcements].sort((a, b) => {
        return a.Priority.localeCompare(b.Priority);
      });
      setAnnouncements(sortedAnnouncements);
    } else {
      const sortedAnnouncements = [...announcements].sort((a, b) => {
        return b.Priority.localeCompare(a.Priority);
      });
      setAnnouncements(sortedAnnouncements);
    }
    setPriorityAsc(!priorityAsc);
  };

  return (
    <div className="container mx-auto">
      <div className="buttons-container flex justify-center gap-6 mt-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={handleSortDate}
        >
          ترتيب حسب التاريخ
          {dateAsc ? (
            <BiUpArrowAlt className="inline-block" />
          ) : (
            <BiUpArrowAlt className="inline-block transform rotate-180" />
          )}
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={handleSortPriority}
        >
          ترتيب حسب الأولوية
          {priorityAsc ? (
            <BiUpArrowAlt className="inline-block" />
          ) : (
            <BiUpArrowAlt className="inline-block transform rotate-180" />
          )}
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">All Announcements</h2>
      <div className="grid grid-cols-1 gap-6 mt-6">
        {announcements.map((announcement) => (
          <div
            key={announcement.Announcement_ID}
            className="p-6 bg-white rounded-lg shadow-md"
          >
            <h3 className="text-lg font-bold text-gray-800">
              {announcement.Content}
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              {announcement.Priority}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(announcement.CreateDate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAnnouncementsPage;
