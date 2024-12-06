import { useState } from 'react';

const Parents = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);

  const [parentsData, setParentsData] = useState([
    { id: 1, name: 'فاطمة أحمد', phone: '0123456789', children: 'أحمد محمد, سارة علي' },
    { id: 2, name: 'خالد علي', phone: '0987654321', children: 'محمود جمال' },
  ]);

  const handleEdit = (parent) => {
    setCurrentParent(parent);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentParent(null);
  };

  const handleSave = () => {
    // Logic to save the edited parent details (e.g., update the state or call API)
    console.log('Parent edited:', currentParent);
    setIsDialogOpen(false);
  };

  const handleDelete = (parentId) => {
    setParentsData(parentsData.filter((parent) => parent.id !== parentId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--secondary-color)' }}>قائمة الأهالي</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">الاسم</th>
            <th className="border px-4 py-2">رقم الهاتف</th>
            <th className="border px-4 py-2">الرقم التعريفي</th>
            <th className="border px-4 py-2">الأبناء</th>
            <th className="border px-4 py-2">تعديل</th>
            <th className="border px-4 py-2">حذف</th> {/* New column for Delete button */}
          </tr>
        </thead>
        <tbody>
          {parentsData.map((parent) => (
            <tr key={parent.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{parent.name}</td>
              <td className="border px-4 py-2">{parent.phone}</td>
              <td className="border px-4 py-2">{parent.id}</td>
              <td className="border px-4 py-2">{parent.children}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(parent)}
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(parent.id)}
                  className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td> {/* Delete button */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">تعديل الوالد</h3>
            <form>
              <label className="block mb-2">
                الاسم:
                <input
                  type="text"
                  value={currentParent.name}
                  onChange={(e) => setCurrentParent({ ...currentParent, name: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-2">
                رقم الهاتف:
                <input
                  type="text"
                  value={currentParent.phone}
                  onChange={(e) => setCurrentParent({ ...currentParent, phone: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
              <label className="block mb-4">
                الأبناء:
                <input
                  type="text"
                  value={currentParent.children}
                  onChange={(e) => setCurrentParent({ ...currentParent, children: e.target.value })}
                  className="block w-full mt-1 p-2 border rounded-xl"
                />
              </label>
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

export default Parents;
