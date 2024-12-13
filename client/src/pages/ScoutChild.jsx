import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calender';
import AchievementsComponent from '../components/AchievementsComponent';

const ScoutChild = () => {
  const apiRequest = useApi();
  const { id: childId } = useParams();
  const navigate = useNavigate();

  const [childData, setChildData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScoutData = async (scoutId) => {
      return apiRequest({
        url: `http://localhost:3000/api/scouts/${scoutId}`,
        method: 'GET',
      });
    };

    const fetchAttendanceData = async (scoutId) => {
      return apiRequest({
        url: `http://localhost:3000/api/scouts/${scoutId}/attendance`,
        method: 'GET',
      });
    };

    const fetchAchievementsData = async (scoutId) => {
      return apiRequest({
        url: `http://localhost:3000/api/scouts/${scoutId}/achievements`,
        method: 'GET',
      });
    };

    const fetchChildData = async (childId) => {
      try {
        const [scoutResponse, attendanceResponse, achievementsResponse] =
          await Promise.all([
            fetchScoutData(childId),
            fetchAttendanceData(childId),
            fetchAchievementsData(childId),
          ]);

        if (scoutResponse.status === 403) {
          navigate('/parentDashboard');
        } else if (scoutResponse.status === 404) {
          console.error('Scout not found');
        } else {
          setChildData(scoutResponse.data);
          setAttendance(attendanceResponse.data);
          setAchievements(achievementsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildData(childId);
  }, [apiRequest, childId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const attendanceFilter = attendance.map((event) => {
    return {
      date: new Date(event.Edate).toISOString().split('T')[0],
      hasAttended: event.Event_ID != null,
    };
  });

  return (
    <div className="dashboard flex flex-col md:flex-row gap-10 bg-gray-100 min-h-screen p-6">
      <Sidebar />
      <div className="main-content col-span-4 grid grid-cols-1 md:grid-cols-[repeat(2,minmax(200px,1fr))] lg:grid-cols-[repeat(5,minmax(200px,1fr))] gap-10">
        <div className="profile-details col-span-1  lg:col-start-5 lg:col-span-1 lg:row-span-2 rounded-xl p-6 bg-white shadow-md">
          <h1 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-100 pb-2">
            معلومات الابن
          </h1>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">الاسم:</span>{' '}
            {childData?.Fname + ' ' + childData?.Lname}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">المجموعة:</span> {'group name'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">قائد المجموعة:</span>{' '}
            {'groupLeader'}
          </p>
        </div>

        <div className="calendar rounded-xl bg-white shadow-lg rounded-xl p-6 lg:col-start-1  lg:col-span-4 lg:row-start-1">
          <h2>التقويم</h2>
          <Calendar attendance={attendanceFilter} />
        </div>

        <div className="relative achievements rounded-xl bg-white shadow-lg rounded-xl p-6 lg:col-start-1 lg:col-span-4 lg:row-start-2">
          <h2>الإنجازات</h2>
          <AchievementsComponent achievements={achievements} />
        </div>
      </div>
    </div>
  );
};

export default ScoutChild;
