import AchievementCard from './AchievementCard';
import { useNavigate } from 'react-router-dom';

const AchievementsComponent = ({ achievements }) => {
  const navigate = useNavigate();

  return (
    <div className="achievements-container container mx-auto flex flex-col gap-6 p-4">
      <div className="cards-container grid grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.Achievement_ID}
            achievement={achievement}
          />
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
