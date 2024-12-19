import ProgressCircle from './ProgressCircle';

const AchievementCard = ({ achievement }) => {
  const levelColors = ['#D32F2F', '#F57C00', '#FBC02D', '#388E3C', '#1976D2'];
  const backgroundLevelColors = [
    '#FFEBEE',
    '#FFF3E0',
    '#FFFDE7',
    '#E8F5E9',
    '#E3F2FD',
  ];

  const getLevelColor = (level) =>
    levelColors[Math.min(level - 1, levelColors.length - 1)];

  const getBackgroundLevelColor = (level) =>
    backgroundLevelColors[Math.min(level - 1, levelColors.length - 1)];
  return (
    <div
      key={achievement.Achievement_ID}
      className="achievement-card flex flex-col items-center justify-center p-6 rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      style={{
        backgroundColor: getBackgroundLevelColor(achievement.Level),
      }}
    >
      <h3 className="text-2xl pb-10 font-bold text-gray-800">
        {achievement.Aname}
      </h3>
      <ProgressCircle
        progress={achievement.Level / 5}
        fromColor={getLevelColor(achievement.Level)}
        toColor={getLevelColor(achievement.Level)}
        size="150px"
        fontSize="1rem"
      />
      <p className="text-lg text-gray-700 mt-2">{achievement.Criteria}</p>
      <p className="text-lg text-gray-500">{achievement.Description}</p>
    </div>
  );
};

export default AchievementCard;
