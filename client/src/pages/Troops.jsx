import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const Troops = () => {
  const apiRequest = useApi();
const [loading, setLoading] = useState(true);
  const [troopsData, setTroopsData] = useState([]);
  const [leadersData, setLeadersData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTroop, setEditingTroop] = useState(null);
  const [deletingTroop, setDeletingTroop] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTroopName, setNewTroopName] = useState('');
  const [newTroopLeader, setNewTroopLeader] = useState('');
  const [newTroopMaxMembers, setNewTroopMaxMembers] = useState('');
  const { accessToken } = useAuthStore();

  // Fetch troops and leaders
  useEffect(() => {
    const fetchData = async () => {
       setLoading(true);
      try {
        const leadersData = await axios.get(
          'http://localhost:3000/api/scoutleaders',
          {
            headers: {
              accessToken: accessToken, // Ensure accessToken is defined
            },
          }
        );
        const leaders = leadersData.data;
        setLeadersData(leaders);

        const troopsData = await axios.get('http://localhost:3000/api/troops', {
          headers: {
            accessToken: accessToken, // Ensure accessToken is defined
          },
        });
        const troops = troopsData.data;

        const enrichedTroops = troops.map((troop) => {
          const leader = leaders.find(
            (leader) => leader.User_ID === troop.ScoutLeader_ID
          );
          return {
            ...troop,
            leaderName: leader
              ? `${leader.Fname} ${leader.Lname}`
              : 'غير متوفر',
          };
        });

        setTroopsData(enrichedTroops);
        console.log(enrichedTroops);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiRequest]);

  // Open Edit Modal
  const handleEditClick = (troop) => {
    setEditingTroop(troop);
    setIsEditModalOpen(true);
  };

  // Save Edits
  const handleSaveChanges = async () => {
    try {
      const updatedTroop = {
        Tname: editingTroop.Tname,
        ScoutLeader_ID: editingTroop.ScoutLeader_ID,
        max_Members: editingTroop.max_Members,
      };

      await apiRequest({
        url: `http://localhost:3000/api/troops/${editingTroop.Troop_ID}`,
        method: 'PUT',
        data: updatedTroop,
      });

      // Update UI
      const troopsData = await axios.get('http://localhost:3000/api/troops', {
        headers: {
          accessToken: accessToken, // Ensure accessToken is defined
        },
      });
      const troops = troopsData.data;

      const enrichedTroops = troops.map((troop) => {
        const leader = leadersData.find(
          (leader) => leader.User_ID === troop.ScoutLeader_ID
        );
        return {
          ...troop,
          leaderName: leader ? `${leader.Fname} ${leader.Lname}` : 'غير متوفر',
        };
      });

      setTroopsData(enrichedTroops);

      setIsEditModalOpen(false);
      setEditingTroop(null);
    } catch (error) {
      console.error('Error updating troop:', error);
    }
  };

  // Open Add Modal
  const handleAddClick = () => {
    setIsAddModalOpen(true);
    setNewTroopName('');
    setNewTroopLeader('');
  };

  // Add Troop
  const handleAddTroop = async () => {
    // Validate the input fields
    if (
      !newTroopName.trim() ||
      !newTroopMaxMembers.trim() ||
      isNaN(newTroopMaxMembers) ||
      parseInt(newTroopMaxMembers, 10) <= 0
    ) {
      alert(
        'اسم المجموعة والحد الأقصى لعدد الكشافة هما حقول مطلوبة ويجب أن يكون الحد الأقصى عددًا صالحًا.'
      );
      return;
    }

    try {
      const newTroop = {
        Tname: newTroopName,
        ScoutLeader_ID: parseInt(newTroopLeader, 10) || null,
        max_Members: parseInt(newTroopMaxMembers, 10),
      };

      const response = await axios.post(
        'http://localhost:3000/api/troops',
        newTroop,
        {
          headers: {
            accessToken: accessToken, // Ensure accessToken is defined
          },
        }
      );

      const troopsData = await axios.get('http://localhost:3000/api/troops', {
        headers: {
          accessToken: accessToken, // Ensure accessToken is defined
        },
      });
      const troops = troopsData.data;

      const enrichedTroops = troops.map((troop) => {
        const leader = leadersData.find(
          (leader) => leader.User_ID === troop.ScoutLeader_ID
        );
        return {
          ...troop,
          leaderName: leader ? `${leader.Fname} ${leader.Lname}` : 'غير متوفر',
        };
      });

      setTroopsData(enrichedTroops);

      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding new troop:', error);
    }
  };

  // Open Delete Dialog
  const handleDeleteClick = (troop) => {
    setDeletingTroop(troop);
    setIsDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/troops/${deletingTroop.Troop_ID}`,
        method: 'DELETE',
      });

      setTroopsData((prevData) =>
        prevData.filter((troop) => troop.Troop_ID !== deletingTroop.Troop_ID)
      );

      setIsDeleteDialogOpen(false);
      setDeletingTroop(null);
    } catch (error) {
      console.error('Error deleting troop:', error);
    }
  };

  return (
    <div className="p-4 rounded-2xl">
      <div className="flex justify-between items-center">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ color: 'var(--secondary-color)' }}
        >
          قائمة المجموعات
        </h2>

        {/* Add Troop Button */}
        <button
          onClick={handleAddClick}
          className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة مجموعة
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : troopsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد فرق للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">اسم المجموعة</th>
                <th className="border px-4 py-2 text-center">القائد</th>
                <th className="border px-4 py-2 text-center">الحد الاقصى</th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {troopsData.map((troop) => (
                <tr key={troop.Troop_ID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {troop.Tname}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {troop.leaderName}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {troop.max_Members}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEditClick(troop)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteClick(troop)}
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

      {/* Edit Modal */}
      {isEditModalOpen && editingTroop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              تعديل {editingTroop.Tname}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xl font-medium mb-1">
                  اسم المجموعة:
                </label>
                <input
                  type="text"
                  value={editingTroop.Tname}
                  onChange={(e) =>
                    setEditingTroop({ ...editingTroop, Tname: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="ScoutLeader_ID"
                >
                  القائد:
                </label>
                <select
                  name="ScoutLeader_ID"
                  value={editingTroop.ScoutLeader_ID}
                  onChange={(e) =>
                    setEditingTroop({
                      ...editingTroop,
                      ScoutLeader_ID: parseInt(e.target.value, 10),
                    })
                  }
                  className="my-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="">اختر قائدًا</option>
                  {leadersData.map((leader) => (
                    <option key={leader.User_ID} value={leader.User_ID}>
                      {leader.Fname} {leader.Lname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xl font-medium mb-1">
                  الحد الأقصى لعدد الكشافة:
                </label>
                <input
                  type="number"
                  value={editingTroop.max_Members}
                  onChange={(e) =>
                    setEditingTroop({
                      ...editingTroop,
                      max_Members: parseInt(e.target.value, 10),
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              إضافة مجموعة جديدة
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xl font-medium mb-1">
                  اسم المجموعة:
                </label>
                <input
                  type="text"
                  value={newTroopName}
                  onChange={(e) => setNewTroopName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="leader_id"
                >
                  القائد:
                </label>
                <select
                  name="leader_id"
                  value={newTroopLeader}
                  onChange={(e) => setNewTroopLeader(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="">اختر قائدًا</option>
                  {leadersData.map((leader) => (
                    <option key={leader.User_ID} value={leader.User_ID}>
                      {leader.Fname} {leader.Lname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xl font-medium mb-1">
                  الحد الأقصى لعدد الكشافة:
                </label>
                <input
                  type="number"
                  value={newTroopMaxMembers}
                  onChange={(e) => setNewTroopMaxMembers(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddTroop}
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

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && deletingTroop && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4 text-center">
            <h3
              className="text-xl mb-4 font-bold"
              style={{ color: 'var(--secondary-color)' }}
            >
              تأكيد الحذف
            </h3>
            <p>هل أنت متأكد أنك تريد حذف الفرقة {deletingTroop.Tname}؟</p>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
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

export default Troops;
