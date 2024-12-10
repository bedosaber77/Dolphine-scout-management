import '../styles/souctDashboard.css';
import '../styles/radialProgress.css';
import Calendar from '../components/Calender';
import UpcomingEvents from '../components/UpcomingEvents';
import useAuthStore from '../store/authStore';
import useApi from '../hooks/useApi';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const ScoutDashboard = () => {
  const apiRequest = useApi();

  const navigate = useNavigate();
  const groupName = 'المجموعة الأولى';
  const groupLeader = 'محمد';
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const arr = ['المهارات', 'الأنشطة', 'المهام', 'المشاريع'];

  // const fetchData = useCallback(async () => {
  //   try {
  //     const eventsFetch = await apiRequest({
  //       url: 'http://localhost:3000/api/events',
  //       method: 'GET',
  //     });
  //     // const attendanceFetch = await apiRequest({
  //     //   url: 'http://localhost:3000/api/events/1/attendance',
  //     //   method: 'GET',
  //     // });
  //     console.log(eventsFetch.data);
  //     //   console.log(attendanceFetch.data);
  //     //   const eventsOnMonth = eventsFetch.data.filter((event) => {
  //     //     const eventDate = new Date(event.Edate);
  //     //     return (
  //     //       eventDate.getMonth() === new Date().getMonth() &&
  //     //       eventDate.getFullYear() === new Date().getFullYear()
  //     //     );
  //     //   });
  //     //   setEvents(eventsOnMonth);
  //     //   setAttendance(attendanceFetch.data);
  //     // } catch (error) {
  //     //   console.error(error);
  // const attendanceFetch = await apiRequest({
  //   url: 'http://localhost:3000/api/users/1/attendance',
  //   method: 'GET',
  // });
  //     console.log(attendanceFetch.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   // }
  // }, [apiRequest]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios('http://localhost:3000/api/events', {
  //         method: 'GET',
  //         headers: {
  //           accessToken: accessToken,
  //         },
  //       });

  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [accessToken]);
  // setEvents(data);

  // const something = useMemo(()=>{
  //   attendance.includes(user?.User_ID)
  // })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsFetch = await apiRequest({
          url: 'http://localhost:3000/api/events',
          method: 'GET',
        });
        const attendanceFetch = await apiRequest({
          url: 'http://localhost:3000/api/users/1/attendance',
          method: 'GET',
        });
        console.log(eventsFetch);
        console.log(attendanceFetch);
        setEvents(eventsFetch.data);
        setAttendance(attendanceFetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);

  const Achievements = () => {
    return (
      <ul className="achievements-list grid grid-cols-3 gap-4 h-full ">
        {arr.map((el) => (
          <li
            key={el}
            className="border-2 rounded-lg h-1/3 min-w-min cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110"
          >
            {el}
            <div className="flex flex-col items-center space-y-4">
              <div
                className="radial-progress text-gray-500"
                style={{
                  '--value': '50',
                  '--size': '6rem',
                  '--color': '#4caf50',
                }}
              >
                50%
              </div>
              <p className="text-sm font-medium text-gray-700">Progress: 50%</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const upcomingEvents = [
    {
      id: 1,
      name: 'Event 1',
      date: '2024-12-02',
      details: 'Details of Event 1',
    },
    {
      id: 2,
      name: 'Event 2',
      date: '2024-12-05',
      details: 'Details of Event 2',
    },
    {
      id: 3,
      name: 'Event 3',
      date: '2024-12-15',
      details: 'Details of Event 3',
    },
    {
      id: 4,
      name: 'Event 4',
      date: '2024-12-25',
      details: 'Details of Event 4',
    },
  ];

  const attendanceFilter = attendance.map((event) => {
    return {
      date: new Date(event.Edate).toISOString().split('T')[0],
      hasAttended: event.Event_ID != null,
    };
  });

  return (
    <div className="dashboard flex flex-col md:flex-row gap-4">
      <Sidebar />
      <div className="main-content col-span-4 grid grid-cols-1 md:grid-cols-[repeat(2,minmax(200px,1fr))] lg:grid-cols-[repeat(5,minmax(200px,1fr))] gap-4">
        <div className="profile-details col-span-1  border-2  lg:col-start-5 lg:col-span-1 lg:row-span-2  rounded-xl p-4">
          <h1>معلوماتي</h1>
          <p>الاسم: {user?.Fname + ' ' + user?.Lname}</p>
          <p>المجموعة: {groupName}</p>
          <p>قائد المجموعة: {groupLeader}</p>
        </div>

        <div className="relative announcement border-2 rounded-xl p-4 lg:col-start-1 lg:col-span-2 row-start-1 ">
          <h2>الإعلانات</h2>
          <p>الأخبار الرئيسية هنا...</p>
          Add button for full announcements
          <button
            className="absolute bottom-4 right-4 mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/announcements')}
          >
            عرض المزيد
          </button>
        </div>

        <div className="calendar border-2 rounded-xl p-4 lg:col-start-3  lg:col-span-2 lg:row-start-1">
          <h2>التقويم</h2>
          <Calendar attendance={attendanceFilter} />
        </div>

        <div className="upcoming-events border-2 rounded-xl p-4 lg:col-start-3 lg:col-span-2">
          <UpcomingEvents events={upcomingEvents} />
        </div>

        <div className="relative achievements border-2 rounded-xl p-4 lg:col-start-1 lg:col-span-2 lg:row-start-2">
          <h2>الإنجازات</h2>
          <button
            className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={() => navigate('/achievements')}
          >
            View All Achievements
          </button>
          <Achievements />
        </div>
      </div>
    </div>
  );
};

export default ScoutDashboard;
