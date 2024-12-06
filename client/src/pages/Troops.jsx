import { useState } from 'react';

const Troops = () => {
  // State to hold troop data
  const [troopsData, setTroopsData] = useState([
    { troopName: 'مجموعة 1', leader: 'أحمد', scoutsCount: 15 },
    { troopName: 'مجموعة 2', leader: 'سعيد', scoutsCount: 20 },
    { troopName: 'مجموعة 3', leader: 'خالد', scoutsCount: 12 },
  ]);

  // Modal control and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [troopName, setTroopName] = useState('');
  const [leader, setLeader] = useState('');
  const [scoutsCount, setScoutsCount] = useState('');

  // Add new troop
  const handleSubmitTroop = (e) => {
    e.preventDefault();
    setTroopsData([
      ...troopsData,
      { troopName, leader, scoutsCount: parseInt(scoutsCount, 10) },
    ]);
    setIsModalOpen(false);
    setTroopName('');
    setLeader('');
    setScoutsCount('');
  };

  // Delete a troop
  const handleDelete = (troopName) => {
    setTroopsData(troopsData.filter((troop) => troop.troopName !== troopName));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--secondary-color)' }}>
        قائمة المجموعات
      </h2>

      {/* Add Troop Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
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
            <th className="border px-4 py-2">عدد الكشافة</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {troopsData.map((troop, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{troop.troopName}</td>
              <td className="border px-4 py-2">{troop.leader}</td>
              <td className="border px-4 py-2">{troop.scoutsCount}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(troop.troopName)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Troop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">إضافة مجموعة جديدة</h3>
            <form onSubmit={handleSubmitTroop}>
              <div className="mb-4">
                <label htmlFor="troopName" className="block text-sm font-medium text-gray-700">
                  اسم المجموعة
                </label>
                <input
                  type="text"
                  name="troopName"
                  value={troopName}
                  onChange={(e) => setTroopName(e.target.value)}
                  id="troopName"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="leader" className="block text-sm font-medium text-gray-700">
                  القائد
                </label>
                <input
                  type="text"
                  name="leader"
                  value={leader}
                  onChange={(e) => setLeader(e.target.value)}
                  id="leader"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="scoutsCount" className="block text-sm font-medium text-gray-700">
                  عدد الكشافة
                </label>
                <input
                  type="number"
                  name="scoutsCount"
                  value={scoutsCount}
                  onChange={(e) => setScoutsCount(e.target.value)}
                  id="scoutsCount"
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

export default Troops;
