import { useState } from 'react';

const ScoutLeaders = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentLeader, setCurrentLeader] = useState(null);
  const [leadersData, setLeadersData] = useState([
    { id: 1, name: 'خالد سعيد', phone: '0112233445', troops: 'الطائفة 1, الطائفة 2', isAdmin: false },
    { id: 2, name: 'سعيد محمود', phone: '0109876543', troops: 'الطائفة 3', isAdmin: true },
  ]);

  const [newLeader, setNewLeader] = useState({
    name: '',
    phone: '',
    id: '',
    troops: '',
    isAdmin: false,
  });

  // Handle editing a leader
  const handleEdit = (leader) => {
    setCurrentLeader({ ...leader });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentLeader(null);
  };

  const handleSave = () => {
    setLeadersData((prevData) =>
      prevData.map((leader) => (leader.id === currentLeader.id ? currentLeader : leader))
    );
    setIsDialogOpen(false);
  };

  // Handle adding a new leader
  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewLeader({ name: '', phone: '', id: '', troops: '', isAdmin: false });
  };

  const handleAdd = () => {
    setLeadersData((prevData) => [...prevData, { ...newLeader, id: leadersData.length + 1 }]);
    setIsAddDialogOpen(false);
  };

  // Handle deleting a leader
  const handleDelete = (id) => {
    setLeadersData((prevData) => prevData.filter((leader) => leader.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--secondary-color)' }}>
        قادة الكشافة
      </h2>

      {/* Add Leader Button */}
      <button
        onClick={() => setIsAddDialogOpen(true)}
        className="bg-secondary-color text-white px-4 py-2 rounded-lg mb-4"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة قائد جديد
      </button>

      {/* Leaders Table */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">الاسم</th>
            <th className="border px-4 py-2">رقم الهاتف</th>
            <th className="border px-4 py-2">الرقم التعريفي</th>
            <th className="border px-4 py-2">المجموعات التي يقودها</th>
            <th className="border px-4 py-2">مدير؟</th>
            <th className="border px-4 py-2">تعديل</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {leadersData.map((leader) => (
            <tr key={leader.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{leader.name}</td>
              <td className="border px-4 py-2">{leader.phone}</td>
              <td className="border px-4 py-2">{leader.id}</td>
              <td className="border px-4 py-2">{leader.troops}</td>
              <td className="border px-4 py-2">{leader.isAdmin ? 'نعم' : 'لا'}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(leader)}
                  className="bg-secondary-color text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(leader.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">تعديل القائد</h3>
            <form>
              <label className="block mb-2">
                الاسم:
                <input
                  type="text"
                  value={currentLeader.name}
                  onChange={(e) => setCurrentLeader({ ...currentLeader, name: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-2">
                رقم الهاتف:
                <input
                  type="text"
                  value={currentLeader.phone}
                  onChange={(e) => setCurrentLeader({ ...currentLeader, phone: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-2">
                الفرق التي يقودها:
                <input
                  type="text"
                  value={currentLeader.troops}
                  onChange={(e) => setCurrentLeader({ ...currentLeader, troops: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={currentLeader.isAdmin}
                  onChange={(e) => setCurrentLeader({ ...currentLeader, isAdmin: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-right text-lg mr-2">هل هو مدير ؟</label>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleDialogClose}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-secondary-color text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Leader Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">إضافة قائد جديد</h3>
            <form>
              <label className="block mb-2">
                الاسم:
                <input
                  type="text"
                  value={newLeader.name}
                  onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-2">
                رقم الهاتف:
                <input
                  type="text"
                  value={newLeader.phone}
                  onChange={(e) => setNewLeader({ ...newLeader, phone: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-2">
                الفرق التي يقودها:
                <input
                  type="text"
                  value={newLeader.troops}
                  onChange={(e) => setNewLeader({ ...newLeader, troops: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={newLeader.isAdmin}
                  onChange={(e) => setNewLeader({ ...newLeader, isAdmin: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-right text-lg mr-2">هل هو مدير ؟</label>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleAddDialogClose}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="bg-secondary-color text-white px-4 py-2 rounded-lg"
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

export default ScoutLeaders;
