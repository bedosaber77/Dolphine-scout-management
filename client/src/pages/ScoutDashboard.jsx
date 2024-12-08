import '../styles/souctDashboard.css';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/radialProgress.css';
// import createTable from '../components/createTable';
import Calendar from '../components/Calender';
import UpcomingEvents from '../components/UpcomingEvents';
// import { useAuth } from "../hooks/AuthProvider";
// import { useNavigate } from 'react-router-dom';

const ScoutDashboard = () => {
  const name = 'أحمد';
  const groupName = 'المجموعة الأولى';
  const groupLeader = 'محمد';
  // const auth = useAuth();
  // const navigate = useNavigate();

  const arr = ['Achievement 1', 'Achievement 2', 'Achievement 3'];

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
  const arr2 = ['Event 1', 'Event 2', 'Event 3'];

  const Events = () => {
    return (
      <ul className="events-list">
        {arr2.map((el) => (
          <li key={el}>{el}</li>
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

  const attendance = [
    { date: '2024-12-02', hasAttended: true },
    { date: '2024-12-05', hasAttended: false },
    { date: '2024-12-15', hasAttended: true },
    { date: '2024-12-25', hasAttended: false },
  ];

  return (
    <div className="dashboard grid grid-cols-5 gap-4" dir="ltr">
      <div className="side-bar col-span-1"></div>
      <div className="main-content col-span-4 grid grid-cols-[repeat(2,minmax(200px,1fr))] gap-4">
        {/* <h1 className="col-start-4">الصفحة الشخصية</h1> */}

        <div className="calendar col-start-1  col-span-1 border-2 rounded-xl p-10 ">
          <h2>التقويم</h2>
          <Calendar attendance={attendance} />
        </div>
        <div className="upcoming-events col-start-1 col-span-1 row-start-3 border-2 rounded-xl p-10 ">
          <UpcomingEvents events={upcomingEvents} />
        </div>
        <div className="acheivements col-start-2 col-span-1 row-start-3 border-2 rounded-xl p-10 ">
          <h2>انجازاتى</h2>

          <Achievements />
        </div>
      </div>
    </div>
  );
};

export default ScoutDashboard;
