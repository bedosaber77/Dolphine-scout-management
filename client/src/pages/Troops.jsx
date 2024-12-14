import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Troops = () => {
  const apiRequest = useApi();

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

  // Fetch troops and leaders
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch troops
        const troopsFetch = await apiRequest({
          url: 'http://localhost:3000/api/troops/',
          method: 'GET',
        });
        const troops = troopsFetch.data;
        console.log("troops",troops);

        // Fetch leaders
        const leadersFetch = await apiRequest({
          url: 'http://localhost:3000/api/scoutleaders/',
          method: 'GET',
        });
        const leaders = leadersFetch.data;

        // Enrich troops with leader names
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
        setLeadersData(leaders);
      } catch (error) {
        console.error('Error fetching troops or leaders:', error);
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
      setTroopsData((prevData) =>
        prevData.map((troop) =>
          troop.Troop_ID === editingTroop.Troop_ID
            ? { ...troop, ...updatedTroop }
            : troop
        )
      );

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

      const response = await apiRequest({
        url: 'http://localhost:3000/api/troops/',
        method: 'POST',
        data: newTroop,
      });

      setTroopsData((prevData) => [...prevData, response.data]);
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
    <div className="p-4">
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة المجموعات
      </h2>

      {/* Add Troop Button */}
      <button
        onClick={handleAddClick}
        className="bg-secondary-color text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة مجموعة
      </button>

      {/* Troops Table */}
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">اسم المجموعة</th>
            <th className="border px-4 py-2">القائد</th>
            <th className="border px-4 py-2">الحد الاقصى</th>
            <th className="border px-4 py-2">تعديل</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {troopsData.map((troop) => (
            <tr key={troop.Troop_ID} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{troop.Tname}</td>
              <td className="border px-4 py-2">{troop.leaderName}</td>
              <td className="border px-4 py-2">{troop.max_Members}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditClick(troop)}
                  className="bg-secondary-color text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteClick(troop)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isEditModalOpen && editingTroop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">تعديل المجموعة</h3>
            <form>
              <label className="block mb-4">
                اسم المجموعة:
                <input
                  type="text"
                  value={editingTroop.Tname}
                  onChange={(e) =>
                    setEditingTroop({ ...editingTroop, Tname: e.target.value })
                  }
                  className="block w-full mt-1 p-2 border rounded"
                />
              </label>
              <label className="block mb-4">
                القائد:
                <select
                  value={editingTroop.ScoutLeader_ID}
                  onChange={(e) =>
                    setEditingTroop({
                      ...editingTroop,
                      ScoutLeader_ID: parseInt(e.target.value, 10),
                    })
                  }
                  className="block w-full mt-1 p-2 border rounded"
                >
                  <option value="">اختر قائدًا</option>
                  {leadersData.map((leader) => (
                    <option
                      key={leader.ScoutLeader_ID}
                      value={leader.ScoutLeader_ID}
                    >
                      {leader.Fname} {leader.Lname}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-4">
                الحد الأقصى لعدد الكشافة:
                <input
                  type="number"
                  value={editingTroop.max_Members}
                  onChange={(e) =>
                    setEditingTroop({
                      ...editingTroop,
                      max_Members: parseInt(e.target.value, 10),
                    })
                  }
                  className="block w-full mt-1 p-2 border rounded"
                />
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-secondary-color text-white px-4 py-2 rounded"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">إضافة مجموعة جديدة</h3>
            <form>
              <label className="block mb-4">
                اسم المجموعة:
                <input
                  type="text"
                  value={newTroopName}
                  onChange={(e) => setNewTroopName(e.target.value)}
                  className="block w-full mt-1 p-2 border rounded"
                />
              </label>
              <label className="block mb-4">
                القائد:
                <select
                  value={newTroopLeader}
                  onChange={(e) => setNewTroopLeader(e.target.value)}
                  className="block w-full mt-1 p-2 border rounded"
                >
                  <option value="">اختر قائدًا</option>
                  {leadersData.map((leader) => (
                    <option
                      key={leader.ScoutLeader_ID}
                      value={leader.ScoutLeader_ID}
                    >
                      {leader.Fname} {leader.Lname}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-4">
                الحد الأقصى لعدد الكشافة:
                <input
                  type="number"
                  value={newTroopMaxMembers}
                  onChange={(e) => setNewTroopMaxMembers(e.target.value)}
                  className="block w-full mt-1 p-2 border rounded"
                />
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddTroop}
                  className="bg-secondary-color text-white px-4 py-2 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">
              هل تريد حذف المجموعة "{deletingTroop.Tname}"؟
            </h3>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
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
