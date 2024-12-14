import ProgressCircle from './ProgressCircle';
import { useNavigate } from 'react-router-dom';

const AchievementsComponent = ({ achievements }) => {
  const navigate = useNavigate();

  const levelColors = ['#D32F2F', '#F57C00', '#FBC02D', '#388E3C', '#1976D2'];

  const backgroundlevelColors = [
    '#FFEBEE',
    '#FFF3E0',
    '#FFFDE7',
    '#E8F5E9',
    '#E3F2FD',
  ];

  const getLevelColor = (level) =>
    levelColors[Math.min(level - 1, levelColors.length - 1)];

  const getBackgroundLevelColor = (level) =>
    backgroundlevelColors[Math.min(level - 1, levelColors.length - 1)];

  return (
    <div className="achievements-container container mx-auto flex flex-col gap-6 p-4">
      <div className="cards-container grid grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.Achievement_ID}
            className="achievement-card flex flex-col items-center justify-center p-6 rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            style={{
              backgroundColor: getBackgroundLevelColor(achievement.Level),
            }}
          >
            <h3 className="text-lg font-bold text-gray-800">
              {achievement.Aname}
            </h3>
            <ProgressCircle
              progress={achievement.Level / 5}
              fromColor={getLevelColor(achievement.Level)}
              toColor={getLevelColor(achievement.Level)}
              size="70px"
              fontSize="1rem"
            />
            <p className="text-sm text-gray-700 mt-2">{achievement.Criteria}</p>
            <p className="text-xs text-gray-500">{achievement.Description}</p>
          </div>
        ))}
      </div>
      <div className=" flex justify-start mt-6">
        <button
          className=" bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => navigate('/achievements')}
        >
          View All Achievements
        </button>
      </div>
    </div>
  );
};

export default AchievementsComponent;
