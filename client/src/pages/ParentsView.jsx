import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Parents = () => {
  const apiRequest = useApi();
  const [parentsData, setParentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [editAttributes, setEditAttributes] = useState({
    relationship: '',
    childCount: 0,
    childrenIDs: [],
  });

  const fetchParents = async () => {
    setLoading(true);
    try {
      const parentsFetch = await apiRequest({
        url: 'http://localhost:3000/api/parents/',
        method: 'GET',
      });
      const parents = parentsFetch.data;

      setParentsData(parents);
      console.log(parents.data);
    } catch (error) {
      console.error('Error fetching parents data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [apiRequest]);

  const handleEdit = (parent) => {
    setSelectedParent(parent);
    setEditAttributes({
      relationship: parent.relationship || '',
      childCount: parent.childrenIDs?.length || 0,
      childrenIDs: parent.childrenIDs || [],
    });
    setIsDialogOpen(true);
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setEditAttributes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChildCountChange = (e) => {
    const childCount = parseInt(e.target.value, 10) || 0;
    const updatedChildrenIDs = [...editAttributes.childrenIDs];
    while (updatedChildrenIDs.length < childCount) {
      updatedChildrenIDs.push('');
    }
    while (updatedChildrenIDs.length > childCount) {
      updatedChildrenIDs.pop();
    }
    setEditAttributes((prev) => ({
      ...prev,
      childCount,
      childrenIDs: updatedChildrenIDs,
    }));
  };

  const handleChildIDChange = (index, value) => {
    const updatedChildrenIDs = [...editAttributes.childrenIDs];
    updatedChildrenIDs[index] = value;
    setEditAttributes((prev) => ({
      ...prev,
      childrenIDs: updatedChildrenIDs,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest({
        url: `http://localhost:3000/api/parents/${selectedParent.Parent_ID}`,
        method: 'PUT',
        data: editAttributes,
      });
      setParentsData((prevData) =>
        prevData.map((parent) =>
          parent.Parent_ID === selectedParent.Parent_ID
            ? { ...parent, ...editAttributes }
            : parent
        )
      );
      setIsDialogOpen(false);
      setSelectedParent(null);
      fetchParents();
    } catch (error) {
      console.error('Error updating parent:', error);
    }
  };

  return (
    <div className="p-4">
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة أولياء الأمور
      </h2>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : parentsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">
          لا يوجد أولياء أمور للعرض
        </p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">الرقم التعريفي</th>
              <th className="border px-4 py-2">الاسم</th>
              <th className="border px-4 py-2">العلاقة</th>
              <th className="border px-4 py-2">رقم الهاتف</th>
              <th className="border px-4 py-2">البريد الإلكتروني</th>
              <th className="border px-4 py-2">عدد الأطفال</th>
              <th className="border px-4 py-2">تعديل</th>
              <th className="border px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {parentsData.map((parent) => (
              <tr key={parent.User_ID} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{parent.User_ID}</td>
                <td className="border px-4 py-2">
                  {parent.Fname && parent.Lname
                    ? `${parent.Fname} ${parent.Lname}`
                    : 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {parent.relationship || 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {parent.Phonenum || 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {parent.email || 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {parent.childrenIDs?.length || 0}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(parent)}
                    className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  >
                    تعديل
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedParent(parent);
                      setIsDeleteDialogOpen(true);
                    }}
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

      {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">تعديل ولي أمر</h3>
            <form onSubmit={handleSubmit}>
              <label>العلاقة</label>
              <select
                name="relationship"
                value={editAttributes.relationship}
                onChange={handleAttributeChange}
                className="border p-2 w-full mb-4"
              >
                <option value="">اختر العلاقة</option>
                <option value="Father">الأب</option>
                <option value="Mother">الأم</option>
              </select>

              <label>عدد الأطفال</label>
              <input
                type="number"
                min="0"
                value={editAttributes.childCount}
                onChange={handleChildCountChange}
                className="border p-2 w-full mb-4"
              />

              {editAttributes.childrenIDs.map((childID, index) => (
                <div key={index}>
                  <label>رقم المعرف للطفل {index + 1}</label>
                  <input
                    type="text"
                    value={childID}
                    onChange={(e) => handleChildIDChange(index, e.target.value)}
                    className="border p-2 w-full mb-2"
                  />
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-secondary-color text-white px-4 py-2 rounded-lg"
                >
                  تعديل
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
