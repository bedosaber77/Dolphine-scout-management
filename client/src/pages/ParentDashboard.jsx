import Sidebar from '../components/Sidebar';
import useAuthStore from '../store/authStore';
import useApi from '../hooks/useApi';
import { useEffect, useState } from 'react';
import AnnouncementsContainer from '../components/AnnouncementsContainer';
import UpcomingEvents from '../components/UpcomingEvents';
import Children from '../components/Children';

const ParentDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState([]);
  const [children, setChildren] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const apiRequest = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsFetch = await apiRequest({
          url: 'http://localhost:3000/api/events',
          method: 'GET',
        });
        const announcementsFetch = await apiRequest({
          url: 'http://localhost:3000/api/announcements',
          method: 'GET',
        });
        const childrenFetch = await apiRequest({
          url: `http://localhost:3000/api/parents/${
            /*user?.User_ID*/ 2
          }/scouts`,
          method: 'GET',
        });

        setChildren(childrenFetch.data);
        setEvents(
          eventsFetch.data.filter((event) => {
            return new Date(event.Edate) > new Date();
          })
        );

        setAnnouncements(announcementsFetch.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [apiRequest]);

  const upcomingEvents = events.map((event) => {
    return {
      id: event.Event_ID,
      name: event.Ename,
      date: new Date(event.Edate).toISOString().split('T')[0],
      details: event.Ename,
    };
  });

  console.log(children);
  return (
    <div className="main-content col-span-4 grid grid-cols-1 md:grid-cols-[repeat(2,minmax(200px,1fr))] lg:grid-cols-[repeat(5,minmax(200px,1fr))] gap-10">
      <div className="profile-details col-span-1 lg:col-start-5 lg:col-span-1 lg:row-span-2 rounded-xl p-6 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-100 pb-2">
          معلوماتي
        </h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">الاسم:</span>{' '}
          {user?.Fname + ' ' + user?.Lname}
        </p>
      </div>
      <div className="relative announcement rounded-xl p-4 lg:col-start-1 lg:row-span-2 lg:col-span-2 lg:row-start-1 bg-white shadow-lg rounded-xl p-6 ">
        <h2 className="max-h-fit">الابناء الكشافة</h2>
        <Children childrenData={children} />
      </div>

      <div className="relative announcement rounded-xl p-4 lg:col-start-3 lg:col-span-2 row-start-1 bg-white shadow-lg rounded-xl p-6 ">
        <h2>الإعلانات</h2>
        <AnnouncementsContainer announcements={announcements} />
      </div>

      <div className="upcoming-events  rounded-xl p-4 lg:col-start-3 lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
        <UpcomingEvents events={upcomingEvents} />
      </div>
    </div>
  );
};

export default ParentDashboard;
