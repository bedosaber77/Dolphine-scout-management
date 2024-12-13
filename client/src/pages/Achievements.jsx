import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Achievements = () => {
  const apiRequest = useApi();

  const [achievementsData, setAchievementsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [achievement, setAchievement] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [achievementToEdit, setAchievementToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const achievementsFetch = await apiRequest({
          url: 'http://localhost:3000/api/achievements/',
          method: 'GET',
        });
        setAchievementsData(achievementsFetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);

  // Add or update an achievement
  const handleSubmitAchievement = async (e) => {
    e.preventDefault();
    const newAchievement = {
      Aname: achievement,
      Level: level || null,
      Description: description || null,
    };
    if (isEditMode && achievementToEdit) {
      try {
        const response = await apiRequest({
          url: `http://localhost:3000/api/achievements/${achievementToEdit.Achievement_ID}`,
          method: 'PUT',
          data: newAchievement,
        });
        setAchievementsData(
          achievementsData.map((ach) =>
            ach.Achievement_ID === achievementToEdit.Achievement_ID
              ? { ...ach, ...newAchievement }
              : ach
          )
        );
        setIsModalOpen(false);
        setAchievement('');
        setLevel('');
        setDescription('');
        setIsEditMode(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await apiRequest({
          url: 'http://localhost:3000/api/achievements/',
          method: 'POST',
          data: newAchievement,
        });
        setAchievementsData([...achievementsData, response.data]);
        setIsModalOpen(false);
        setAchievement('');
        setLevel('');
        setDescription('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Open delete confirmation dialog
  const handleDelete = (achievement) => {
    setAchievementToDelete(achievement);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/achievements/${achievementToDelete.Achievement_ID}`,
        method: 'DELETE',
      });
      setAchievementsData(
        achievementsData.filter(
          (ach) => ach.Achievement_ID !== achievementToDelete.Achievement_ID
        )
      );
      setIsDeleteDialogOpen(false);
      setAchievementToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle edit
  const handleEdit = (achievement) => {
    setAchievement(achievement.Aname);
    setLevel(achievement.Level);
    setDescription(achievement.Description);
    setAchievementToEdit(achievement);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  return (
    <div className="p-4">
      <h2
        className="mb-4 text-lg font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
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
            <th className="border px-4 py-2">المستوى</th>
            <th className="border px-4 py-2">الوصف</th>
            <th className="border px-4 py-2">عدد الأفراد</th>{' '}
            {/* Number of members */}
            <th className="border px-4 py-2">تعديل</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {achievementsData.map((achievement) => (
            <tr key={achievement.Achievement_ID} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{achievement.Aname}</td>
              <td className="border px-4 py-2">{achievement.Level}</td>
              <td className="border px-4 py-2">{achievement.Description}</td>
              <td className="border px-4 py-2">
                {achievement.individuals ? achievement.individuals.length : 0}
              </td>{' '}
              {/* Display number of members */}
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(achievement)}
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(achievement)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding/Editing Achievement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">
              {isEditMode ? 'تعديل' : 'إضافة'} إنجاز
            </h3>
            <form onSubmit={handleSubmitAchievement}>
              <div className="mb-4">
                <label
                  htmlFor="achievementName"
                  className="block text-sm font-medium text-gray-700"
                >
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

              <div className="mb-4">
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-700"
                >
                  المستوى (اختياري)
                </label>
                <input
                  type="text"
                  name="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  id="level"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  الوصف (اختياري)
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
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
                  {isEditMode ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">تأكيد الحذف</h3>
            <p>هل أنت متأكد أنك تريد حذف هذا الإنجاز؟</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
