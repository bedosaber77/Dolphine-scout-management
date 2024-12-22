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
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [announcement, setAnnouncement] = useState({});

  const handleAnnouncementClick = (announcement) => {
    setAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
        setAnnouncements(
          announcementsFetch.data.filter((announcement) => {
            return announcement.Visibility.includes('S');
          })
        );
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          معلوماتي
        </h1>
        <p className="text-gray-700 mb-2">
          <span
            className="font-semibold"
            style={{ color: 'var(--secondary-color)' }}
          >
            الرقم التعريفي:
          </span>{' '}
          {user?.User_ID}
        </p>
        <p className="text-gray-700 mb-2">
          <span
            className="font-semibold"
            style={{ color: 'var(--secondary-color)' }}
          >
            الاسم:
          </span>{' '}
          {user?.Fname + ' ' + user?.Lname}
        </p>
        <p className="text-gray-700 mb-2">
          <span
            className="font-semibold"
            style={{ color: 'var(--secondary-color)' }}
          >
            البريد الإلكتروني:
          </span>{' '}
          {user?.email}
        </p>
        <p className="text-gray-700 mb-2">
          <span
            className="font-semibold"
            style={{ color: 'var(--secondary-color)' }}
          >
            الرتبة:
          </span>{' '}
          {user?.rank}
        </p>
        <p className="text-gray-700 mb-2">
          <span
            className="font-semibold"
            style={{ color: 'var(--secondary-color)' }}
          >
            رقم الهاتف:
          </span>{' '}
          {user?.Phonenum || 'لا يوجد'}
        </p>
        <p className="text-gray-700 mb-2">
          <span
            className="font-semibold"
            style={{ color: 'var(--secondary-color)' }}
          >
            السنة الاكاديمية:
          </span>{' '}
          {user?.academicYear || 'لا يوجد'}
        </p>
      </div>

      <div className="relative announcement lg:col-start-1 lg:col-span-2 row-start-1 bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          الإعلانات
        </h1>
        <AnnouncementsContainer
          handleAnnouncementClick={handleAnnouncementClick}
          announcements={announcements}
        />
      </div>

      <div className="calendar lg:col-start-3 lg:col-span-2 lg:row-start-1 bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          التقويم
        </h1>
        <Calendar attendance={attendanceFilter} />
      </div>

      <div className="upcoming-events lg:col-start-3 lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          الأحداث القادمة
        </h1>
        <UpcomingEvents events={upcomingEvents} />
      </div>

      <div className="relative achievements lg:col-start-1 lg:col-span-2 lg:row-start-2 bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          الإنجازات
        </h1>
        <AchievementsComponent achievements={achievements} />
      </div>
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full flex flex-col gap-4 max-w-md mx-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              {announcement.Content}
            </h2>
            <p className="text-2xl text-gray-600">
              <span className="font-bold">اولوية:</span> {announcement.Priority}
            </p>
            <p className="text-2xl text-gray-600">
              <span className="font-bold">تاريخ:</span>{' '}
              {new Date(announcement.CreateDate).toLocaleString()}
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
              onClick={handleCloseDialog}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoutDashboard;
