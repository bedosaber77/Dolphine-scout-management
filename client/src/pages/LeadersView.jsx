import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
const ScoutLeaders = () => {
  const apiRequest = useApi();

  const [leadersData, setLeadersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  ////////////////////////////////////////////////////////////////////////
  const [leaderToDelete, setleaderToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [leaderToEdit, setleaderToEdit] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state

  const fetchScoutLeaders = async () => {
    setLoading(true); // Start loading
    try {
      // Fetch scouts from the backend (already enriched with user data)
      const scoutLeadersFetch = await apiRequest({
        url: 'http://localhost:3000/api/scoutleaders/',
        method: 'GET',
      });
      const scoutLeaders = scoutLeadersFetch.data;

      console.log('Fetched scoutLeadersFetch:', scoutLeaders);

      setLeadersData(scoutLeaders);
    } catch (error) {
      console.error('Error fetching scouts data:', error);
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
    fetchScoutLeaders();
  }, [apiRequest]);

  const handleSubmitLeaders = async (e) => {
    e.preventDefault();
    const newLeader = {
      // name: achievement,
      // level: level || null,
      // description: description || null,
      // criteria: criteria || null,
    };

    if (isEditMode && leaderToEdit) {
      try {
        await apiRequest({
          url: `http://localhost:3000/api/achievements/${leaderToEdit.Achievement_ID}`,//////////////////////////
          method: 'PUT',
          data: newLeader,
        });
        setLeadersData((prevData) =>
          prevData.map((lead) =>
            lead.Achievement_ID === leaderToEdit.Achievement_ID
              ? { ...lead, ...newLeader }
              : lead
          )
        );
      } catch (error) {
        console.error('Error updating achievement:', error);
      }
    } else {
      try {
        const response = await apiRequest({
          url: 'http://localhost:3000/api/achievements/',/////////////////////////
          method: 'POST',
          data: newLeader,
        });
        setLeadersData([...leadersData, response.data]);
      } catch (error) {
        console.error('Error adding achievement:', error);
      }
    }
    fetchScoutLeaders();
    // Reset form state and close modal
    // setAchievement('');
    // setLevel('');
    // setDescription('');
    // setCriteria('');
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleDelete = (achievement) => {
    setleaderToDelete(achievement);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/achievements/${leaderToDelete.Achievement_ID}`,//////////////////////////////////
        method: 'DELETE',
      });
      setLeadersData(
        leadersData.filter(
          (lead) => lead.Achievement_ID !== leaderToDelete.Achievement_ID
        )
      );
      setIsDeleteDialogOpen(false);
      setleaderToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle edit
  const handleEdit = (achievement) => {
    // setAchievement(achievement.Aname);
    // setLevel(achievement.Level);
    // setDescription(achievement.Description);
    // setCriteria(achievement.Criteria);
    setleaderToEdit(achievement);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  return (
    <div className="p-4">
      <h2
        className="mb-4 text-lg font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة القادة
      </h2>

      {/* Add Leader Button */}
      <button
        onClick={() => {
          // Clear the form state for adding new equipment
          // setAchievement('');
          // setLevel('');
          // setDescription('');
          // setCriteria('');
          setIsModalOpen(true);
        }}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة قائد جديد
      </button>

      {/* Leaders Table */}
      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : leadersData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا توجد مواقع لعرضها.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">الرقم التعريفي</th>
              <th className="border px-4 py-2">الاسم</th>
              <th className="border px-4 py-2">رقم الهاتف</th>
              <th className="border px-4 py-2">المجموعات التي يقودها</th>
              <th className="border px-4 py-2">مدير؟</th>
              <th className="border px-4 py-2">تعديل</th>
              <th className="border px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {leadersData.map((leader) => (
              <tr key={leader.User_ID} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{leader.User_ID}</td>
                <td className="border px-4 py-2">
                  {leader.Fname && leader.Lname
                    ? `${leader.Lname} ${leader.Fname}`
                    : 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {leader.Phonenum || 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {leader.email || 'غير متوفر'}
                </td>
                {/* <td className="border px-4 py-2">{leader.troops}</td> */}
                <td className="border px-4 py-2">
                  {leader.isAdmin ? 'نعم' : 'لا'}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(leader)}
                    className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                    style={{ background: 'var(--secondary-color)' }}
                  >
                    تعديل
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(leader)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-xl mb-4 font-bold">
              {isEditMode ? 'تعديل' : 'إضافة'} القائد
            </h3>
            <form onSubmit={handleSubmitLeaders}>
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
                  // value={leadername}
                  // onChange={(e) => setleader(e.target.value)}
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
                  المستوى
                </label>
                <input
                  type="text"
                  name="level"
                  // value={level}
                  // onChange={(e) => setLevel(e.target.value)}
                  id="level"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  الوصف
                </label>
                <textarea
                  name="description"
                  // value={description}
                  // onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="criteria"
                  className="block text-sm font-medium text-gray-700"
                >
                  المعايير
                </label>
                <textarea
                  name="criteria"
                  // value={criteria}
                  // onChange={(e) => setCriteria(e.target.value)}
                  id="criteria"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                />
              </div>
              {/* <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={currentLeader.isAdmin}
                  onChange={(e) =>
                    setCurrentLeader({
                      ...currentLeader,
                      isAdmin: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label className="text-right text-lg mr-2">هل هو مدير ؟</label>
              </div> */}
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
            <p>هل أنت متأكد أنك تريد حذف هذا القائد</p>
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

export default ScoutLeaders;
