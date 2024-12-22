import { useEffect, useState } from 'react';
import AchievementCard from '../components/AchievementCard';
import useApi from '../hooks/useApi';
import { BiUpArrowAlt } from 'react-icons/bi';
import useAuthStore from '../store/authStore';

const AllAchievementsPage = () => {
  const apiRequest = useApi();
  const [achievements, setAchievements] = useState([]);
  const [levelAsc, setLevelAsc] = useState(true);
  const user = useAuthStore((state) => state.user);

  const totalAchievements = 10;

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/achievements`,
          method: 'GET',
        });
        setAchievements(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAchievements();
  }, [apiRequest]);

  const handleSortLevel = () => {
    const sortedAchievements = [...achievements].sort((a, b) => {
      return levelAsc ? a.Level - b.Level : b.Level - a.Level;
    });
    setAchievements(sortedAchievements);

    setLevelAsc(!levelAsc);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 ">
      <header className="w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">
          انجازاتي
        </h1>
        <div className="flex flex-col items-center mt-4">
          <p className="text-gray-600">
            إجمالي الإنجازات المكتسبة:{' '}
            <span className="font-bold">{achievements.length}</span> /{' '}
            {totalAchievements}
          </p>
          <div className="w-full bg-gray-300 h-4 rounded-full mt-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{
                width: `${(achievements.length / totalAchievements) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Sort Button */}
      <div className="w-full max-w-4xl  flex justify-center mb-6">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          onClick={handleSortLevel}
        >
          ترتيب حسب المستوى{' '}
          {levelAsc ? (
            <BiUpArrowAlt className="inline-block" />
          ) : (
            <BiUpArrowAlt className="inline-block transform rotate-180" />
          )}
        </button>
      </div>

      {/* Achievements List */}
      <div className="w-full  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.Achievement_ID}
            achievement={achievement}
          />
        ))}
      </div>
    </div>
  );
};

export default AllAchievementsPage;
