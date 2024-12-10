import ProgressCircle from './ProgressCircle';
import { useNavigate } from 'react-router-dom';
const AchievementsComponent = ({ achievements }) => {
  const navigate = useNavigate();
  return (
    <ul className="achievements-list container mx-auto h-96 overflow-hidden grid grid-cols-3 gap-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
      {achievements.map((achievement) => (
        <li
          key={achievement.Achievement_ID}
          className="border-2 rounded-lg min-h-fit card flex flex-col gap-4 p-4 items-center justify-center text-center bg-white shadow rounded-lg h-32
        > cursor-pointer bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 bg-blue-200"
        >
          <div className="achievementTitle text-xl">{achievement.Aname}</div>
          <div className="flex flex-col items-center space-y-4">
            <ProgressCircle
              progress={achievement.Level / 5}
              duration={1400}
              fromColor="#0000ff"
              toColor="#00ff00"
              size="50px"
              fontSize="1rem"
            />
          </div>
          <div className="criteria text-sm">{achievement.Criteria}</div>
        </li>
      ))}
      <button
        className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        onClick={() => navigate('/achievements')}
      >
        عرض كل الإنجازات
      </button>
    </ul>
  );
};

export default AchievementsComponent;
