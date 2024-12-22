import '../styles/souctDashboard.css';
import '../styles/radialProgress.css';
import ProgressCircle from '../components/ProgressCircle';
import Calendar from '../components/Calender';
import UpcomingEvents from '../components/UpcomingEvents';
import useAuthStore from '../store/authStore';
import useApi from '../hooks/useApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import Announcements from '../components/AnnouncementsContainer';
import AnnouncementsContainer from '../components/AnnouncementsContainer';
import AchievementsComponent from '../components/AchievementsComponent';

const ScoutDashboard = () => {
  const apiRequest = useApi();
  const navigate = useNavigate();
  const groupName = 'المجموعة الأولى';
  const groupLeader = 'محمد';
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsFetch = await apiRequest({
          url: 'http://localhost:3000/api/events',
          method: 'GET',
        });
        const attendanceFetch = await apiRequest({
          url: `http://localhost:3000/api/scouts/${user?.User_ID}/attendance`,
          method: 'GET',
        });
        const announcementsFetch = await apiRequest({
          url: 'http://localhost:3000/api/announcements',
          method: 'GET',
        });
        const achievementsFetch = await apiRequest({
          url: `http://localhost:3000/api/scouts/${user?.User_ID}/achievements`,
          method: 'GET',
        });

        setEvents(
          eventsFetch.data.filter((event) => {
            return new Date(event.Edate) > new Date();
          })
        );

        setAttendance(attendanceFetch.data);
        console.log('before', announcementsFetch.data);
        setAnnouncements(
          announcementsFetch.data.filter((announcement) => {
            return announcement.Visibility.includes('S');
          })
        );
        console.log('after', announcements);
        setAchievements(achievementsFetch.data);
      } catch (error) {
        console.error(error);
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

  const attendanceFilter = attendance.map((event) => {
    return {
      id: event.Event_ID,
      date: new Date(event.Edate).toISOString().split('T')[0],
      hasAttended: event.Event_ID != null,
    };
  });

  return (
    <div className="main-content col-span-4 grid grid-cols-1 md:grid-cols-[repeat(2,minmax(200px,1fr))] lg:grid-cols-[repeat(5,minmax(200px,1fr))] gap-10">
      <div className="profile-details col-span-1 lg:col-start-5 lg:col-span-1 lg:row-span-2 rounded-xl p-6 bg-white shadow-lg">
        <h1 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          معلوماتي
        </h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">الاسم:</span>{' '}
          {user?.Fname + ' ' + user?.Lname}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">المجموعة:</span> {groupName}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">قائد المجموعة:</span> {groupLeader}
        </p>
      </div>

      <div className="relative announcement lg:col-start-1 lg:col-span-2 row-start-1 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">الإعلانات</h2>
        <AnnouncementsContainer announcements={announcements} />
      </div>

      <div className="calendar lg:col-start-3 lg:col-span-2 lg:row-start-1 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">التقويم</h2>
        <Calendar attendance={attendanceFilter} />
      </div>

      <div className="upcoming-events lg:col-start-3 lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">الأحداث القادمة</h2>
        <UpcomingEvents events={upcomingEvents} />
      </div>

      <div className="relative achievements lg:col-start-1 lg:col-span-2 lg:row-start-2 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">الإنجازات</h2>
        <AchievementsComponent achievements={achievements} />
      </div>
    </div>
  );
};

export default ScoutDashboard;
