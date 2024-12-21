import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
const ScoutLeaders = () => {
  const apiRequest = useApi();

  const [leadersData, setLeadersData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedLeader, setSelectedLeader] = useState(null);

const [editAttributes, setEditAttributes] = useState({
    startDate: '',
    isAdmin: 'false',
});
  const [loading, setLoading] = useState(true); // For loading state

  const fetchScoutLeaders = async () => {
    setLoading(true);
    try {
      const scoutLeadersFetch = await apiRequest({
        url: 'http://localhost:3000/api/scoutleaders/',
        method: 'GET',
      });
      const scoutLeaders = scoutLeadersFetch.data;

      // Fetch troops for each leader
      const leadersWithTroops = await Promise.all(
        scoutLeaders.map(async (leader) => {
          try {
            const troopsFetch = await apiRequest({
              url: `http://localhost:3000/api/troops/leader/${leader.User_ID}`,
              method: 'GET',
              data: { id: leader.User_ID },
            });
            return {
              ...leader,
              troops:
                troopsFetch.data.map((t) => t.Tname).join(', ') ||
                'لا توجد مجموعات',
            };
          } catch (error) {
            console.error(
              `Error fetching troops for leader ${leader.User_ID}:`,
              error
            );
            return { ...leader, troops: 'غير متوفر' };
          }
        })
      );

      setLeadersData(leadersWithTroops);
      console.log(leadersWithTroops);
    } catch (error) {
      console.error('Error fetching scout leaders:', error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchScoutLeaders();
  }, [apiRequest]);

  const handleEdit = (leader) => {
    setSelectedLeader(leader);
    setEditAttributes({
      id: leader.User_ID.toString(),
      startDate: leader.startDate || '',
      isAdmin: leader.isAdmin || 'false',
    });
    setIsDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/scoutleaders/${selectedLeader.User_ID}`, //////////////////////////////////
        method: 'DELETE',
      });
      setLeadersData((prev) =>
        prev.filter((lead) => lead.User_ID !== selectedLeader.User_ID)
      );
      setIsDeleteDialogOpen(false);
      setSelectedLeader(null);
      fetchScoutLeaders();
    } catch (error) {
      console.error('Error deleting leader:', error);
    }
  };

  const handleAttributeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAttributes((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await apiRequest({
      url: `http://localhost:3000/api/scoutleaders/${selectedLeader.User_ID}`,
      method: 'PUT',
      data: editAttributes,
    });
    setLeadersData((prevData) =>
      prevData.map((lead) =>
        lead.User_ID === selectedLeader.User_ID
          ? { ...lead, ...editAttributes }
          : lead
      )
    );
    setIsDialogOpen(false);
    setSelectedLeader(null);
    fetchScoutLeaders();
  } catch (error) {
    console.error('Error updating leader:', error);
  }
};

  return (
    <div className="p-4 rounded-2xl">
      <h2
        className="mb-4 text-3xl font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة القادة
      </h2>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : leadersData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد قادة للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">الرقم التعريفي</th>
                <th className="border px-4 py-2 text-center">الاسم</th>
                <th className="border px-4 py-2 text-center">رقم الهاتف</th>
                <th className="border px-4 py-2 text-center">
                  البريد الإلكتروني
                </th>
                <th className="border px-4 py-2 text-center">
                  المجموعات التي يقودها
                </th>
                <th className="border px-4 py-2 text-center">تاريخ البدء</th>
                <th className="border px-4 py-2 text-center">هل هو مدير ؟</th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {leadersData.map((leader) => (
                <tr key={leader.User_ID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {leader.User_ID}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {leader.Fname && leader.Lname
                      ? `${leader.Fname} ${leader.Lname}`
                      : 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {leader.Phonenum || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {leader.email || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {leader.troops}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(leader.startDate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {leader.isAdmin ? 'نعم' : 'لا'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(leader)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedLeader(leader);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:text-white"
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

      {/* Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              تعديل {selectedLeader.Fname}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xl font-medium mb-1">
                  تاريخ البدء
                </label>
                <input
                  name="startDate"
                  type="date"
                  value={editAttributes.startDate}
                  onChange={handleAttributeChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={editAttributes.isAdmin === 'true'}
                  onChange={handleAttributeChange}
                  className="mr-2 focus:ring focus:ring-secondary-color"
                />
                <label className="mr-2 text-xl">هل هو مدير ؟</label>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4 text-center">
            <h3
              className="text-xl mb-4 font-bold"
              style={{ color: 'var(--secondary-color)' }}
            >
              تأكيد الحذف
            </h3>
            <p>هل أنت متأكد أنك تريد حذف القائد {selectedLeader.Fname}؟</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:text-white"
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
