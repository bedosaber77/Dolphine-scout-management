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
  const [criteria, setCriteria] = useState('');
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [achievementToEdit, setAchievementToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const achievementsFetch = await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/achievements/`,
        method: 'GET',
      });
      setAchievementsData(achievementsFetch.data);
      console.log('ach fetch', achievementsFetch);
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [apiRequest]);

  // Add or update an achievement
  const handleSubmitAchievement = async (e) => {
    e.preventDefault();
    const newAchievement = {
      name: achievement,
      level: level || null,
      description: description || null,
      criteria: criteria || null,
    };

    if (isEditMode && achievementToEdit) {
      try {
        await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/achievements/${achievementToEdit.Achievement_ID}`,
          method: 'PUT',
          data: newAchievement,
        });
        setAchievementsData((prevData) =>
          prevData.map((ach) =>
            ach.Achievement_ID === achievementToEdit.Achievement_ID
              ? { ...ach, ...newAchievement }
              : ach
          )
        );
      } catch (error) {
        console.error('Error updating achievement:', error);
      }
    } else {
      try {
        const response = await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/achievements/`,
          method: 'POST',
          data: newAchievement,
        });
        setAchievementsData([...achievementsData, response.data]);
      } catch (error) {
        console.error('Error adding achievement:', error);
      }
    }
    fetchData();
    // Reset form state and close modal
    setAchievement('');
    setLevel('');
    setDescription('');
    setCriteria('');
    setIsModalOpen(false);
    setIsEditMode(false);
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
        url: `${import.meta.env.VITE_BASEURL}/api/achievements/${achievementToDelete.Achievement_ID}`,
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
    setCriteria(achievement.Criteria);
    setAchievementToEdit(achievement);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between justify-center">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ color: 'var(--secondary-color)' }}
        >
          قائمة الإنجازات
        </h2>

        {/* Add Achievement Button */}
        <button
          onClick={() => {
            // Clear the form state for adding new equipment
            setAchievement('');
            setLevel('');
            setDescription('');
            setCriteria('');
            setIsModalOpen(true);
          }}
          className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة إنجاز
        </button>
      </div>

      {/* Achievements Table */}
      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : achievementsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد إنجازات للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">الإنجاز</th>
                <th className="border px-4 py-2 text-center">المستوى</th>
                <th className="border px-4 py-2 text-center">الوصف</th>
                <th className="border px-4 py-2 text-center">المعايير</th>
                {/* <th className="border px-4 py-2 text-center">عدد الأفراد</th>{' '} */}
                {/* Number of members */}
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {achievementsData.map((achievement) => (
                <tr
                  key={achievement.Achievement_ID}
                  className="hover:bg-gray-100"
                >
                  <td className="border px-4 py-2 text-center">
                    {achievement.Aname}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {achievement.Level || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {achievement.Description || 'لا توجد'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {achievement.Criteria || 'لا توجد'}
                  </td>
                  {/* <td className="border px-4 py-2 text-center">
                {achievement.individuals ? achievement.individuals.length : 0}
              </td>{' '} */}
                  {/* Display number of members */}
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(achievement)}
                      className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              {isEditMode ? 'تعديل' : 'إضافة'} إنجاز
            </h3>
            <form onSubmit={handleSubmitAchievement} className="space-y-4">
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="achievementName"
                >
                  اسم الإنجاز
                </label>
                <input
                  type="text"
                  name="achievementName"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  id="achievementName"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="level"
                >
                  المستوى
                </label>
                <input
                  type="text"
                  name="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  id="level"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="description"
                >
                  الوصف
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="criteria"
                >
                  المعايير
                </label>
                <textarea
                  name="criteria"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  id="criteria"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
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
            <p>هل أنت متأكد أنك تريد حذف إنجاز {achievementToDelete.Aname}؟</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg hover:bg-red-600"
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
