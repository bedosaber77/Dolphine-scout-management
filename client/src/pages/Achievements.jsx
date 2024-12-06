import { useState } from 'react';

const Achievements = () => {
  // State to hold the achievements and the individuals who achieved them
  const [achievementsData, setAchievementsData] = useState([
    { achievement: 'أفضل قائد', individuals: ['أحمد', 'سعيد'] },
    { achievement: 'أفضل متطوع', individuals: ['محمود', 'خالد'] },
    { achievement: 'أفضل أداء', individuals: ['سارة'] },
  ]);

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievement, setAchievement] = useState('');

  // Add a new achievement
  const handleSubmitAchievement = (e) => {
    e.preventDefault();
    setAchievementsData([...achievementsData, { achievement, individuals: [] }]);
    setIsModalOpen(false);
    setAchievement('');
  };

  // Delete an achievement
  const handleDelete = (achievementName) => {
    setAchievementsData(achievementsData.filter((ach) => ach.achievement !== achievementName));
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--secondary-color)' }}>
        قائمة الإنجازات
      </h2>

      {/* Add Achievement Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة إنجاز
      </button>

      {/* Achievements Table */}
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">الإنجاز</th>
            <th className="border px-4 py-2">عدد الأفراد</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {achievementsData.map((achievementItem, index) => (
            <tr key={index} className='hover:bg-gray-100'>
              <td className="border px-4 py-2">{achievementItem.achievement}</td>
              <td className="border px-4 py-2">{achievementItem.individuals.length}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(achievementItem.achievement)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Achievement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">إضافة إنجاز</h3>
            <form onSubmit={handleSubmitAchievement}>
              <div className="mb-4">
                <label htmlFor="achievementName" className="block text-sm font-medium text-gray-700">
                  اسم الإنجاز
                </label>
                <input
                  type="text"
                  name="achievementName"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  id="achievementName"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
