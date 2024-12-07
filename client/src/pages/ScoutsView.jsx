import { useState } from 'react';

const Scouts = () => {
  const [scoutsData, setScoutsData] = useState([
    { id: 1, name: 'أحمد محمد', phone: '0123456789', leader: 'حسن علي', troop: 'الطائفة 1', achievements: ['مكافأة أفضل كشاف'] },
    { id: 2, name: 'محمود جمال', phone: '0987654321', leader: 'خالد سعيد', troop: 'الطائفة 2', achievements: ['مكافأة الكشاف المثالي'] },
    { id: 3, name: 'سارة علي', phone: '0112233445', leader: 'فاطمة حسين', troop: 'الطائفة 3', achievements: ['حصلت على المركز الأول في المسابقة'] },
  ]);

  const allAchievements = [
    'مكافأة أفضل كشاف',
    'مكافأة الكشاف المثالي',
    'حصلت على المركز الأول في المسابقة',
    'أفضل أداء في النشاطات',
    'أفضل تطوع',
    'كشاف متميز'
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentScout, setCurrentScout] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState('');

  const handleEditClick = (scout) => {
    setCurrentScout(scout);
    setIsDialogOpen(true);
    setSelectedAchievement(''); // Reset the selected achievement input
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentScout(null);
  };

  const handleSave = () => {
    // Add logic to save updated scout information
    setIsDialogOpen(false);
  };

  const handleAddAchievement = () => {
    if (selectedAchievement.trim() !== '') {
      setCurrentScout({
        ...currentScout,
        achievements: [...currentScout.achievements, selectedAchievement],
      });
      setSelectedAchievement(''); // Clear input after adding
    }
  };

  const handleRemoveAchievement = (achievementToRemove) => {
    setCurrentScout({
      ...currentScout,
      achievements: currentScout.achievements.filter((achievement) => achievement !== achievementToRemove),
    });
  };

  const handleDelete = (scoutId) => {
    setScoutsData(scoutsData.filter((scout) => scout.id !== scoutId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--secondary-color)' }}>قائمة الكشافة</h2>
      <table className="min-w-full border-collapse border border-[#6fc0e5]">
        <thead>
          <tr>
            <th className="border px-4 py-2">الاسم</th>
            <th className="border px-4 py-2">رقم الهاتف</th>
            <th className="border px-4 py-2">الرقم التعريفي</th>
            <th className="border px-4 py-2">القائد</th>
            <th className="border px-4 py-2">اسم المجموعة</th>
            <th className="border px-4 py-2">الإنجازات</th> {/* New column */}
            <th className="border px-4 py-2">تعديل</th>
            <th className="border px-4 py-2">حذف</th> {/* New column for Delete */}
          </tr>
        </thead>
        <tbody>
          {scoutsData.map((scout) => (
            <tr key={scout.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{scout.name}</td>
              <td className="border px-4 py-2">{scout.phone}</td>
              <td className="border px-4 py-2">{scout.id}</td>
              <td className="border px-4 py-2">{scout.leader}</td>
              <td className="border px-4 py-2">{scout.troop}</td>
              <td className="border px-4 py-2">
                {scout.achievements.map((achievement, index) => (
                  <p key={index} className="mb-1">{achievement}</p>
                ))}
              </td> {/* Display multiple achievements */}
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditClick(scout)}
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(scout.id)}
                  className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td> {/* Delete button */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full rounded-2xl">
            <h3 className="text-lg font-bold mb-4">تعديل الكشاف</h3>
            <form>
              <label className="block mb-2">
                الاسم:
                <input
                  type="text"
                  value={currentScout.name}
                  onChange={(e) => setCurrentScout({ ...currentScout, name: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-2">
                رقم الهاتف:
                <input
                  type="text"
                  value={currentScout.phone}
                  onChange={(e) => setCurrentScout({ ...currentScout, phone: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-2">
                القائد:
                <input
                  type="text"
                  value={currentScout.leader}
                  onChange={(e) => setCurrentScout({ ...currentScout, leader: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-4">
                اسم المجموعة
                <input
                  type="text"
                  value={currentScout.troop}
                  onChange={(e) => setCurrentScout({ ...currentScout, troop: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>

              {/* Achievements Combobox (Dropdown) */}
              <label className="block mb-4">
                الإنجازات:
                <div className="flex gap-x-2">
                  <select
                    value={selectedAchievement}
                    onChange={(e) => setSelectedAchievement(e.target.value)}
                    className="block w-full mt-1 p-2 border rounded-xl"
                  >
                    <option value="">اختر إنجازًا</option>
                    {allAchievements.map((achievement, index) => (
                      <option key={index} value={achievement}>
                        {achievement}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg ml-2"
                    style={{ background: 'var(--secondary-color)' }}
                  >
                    إضافة
                  </button>
                </div>
              </label>

              {/* Display the added achievements with remove button */}
              <div className="mt-4">
                <h4 className="font-semibold">الإنجازات الحالية:</h4>
                {currentScout.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <p className="text-sm flex-grow">{achievement}</p>
                    <button
                      onClick={() => handleRemoveAchievement(achievement)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
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
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scouts;
