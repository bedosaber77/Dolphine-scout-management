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
      console.log(parents);
      // setParentsData(parents);

      // Fetch each parent's children data
      const parentsWithChildren = await Promise.all(
        parents.map(async (parent) => {
          const childrenFetch = await apiRequest({
            url: `http://localhost:3000/api/parents/${parent.User_ID}/scouts`,
            method: 'GET',
            data: { id: parent.User_ID.toString() },
          });
          const firstRow = childrenFetch.data[0];
    
          return {
            ...parent,
            relationship: firstRow.Relationship,
            children: childrenFetch.data, // Assuming children data is returned here
          };
        })
      );

      setParentsData(parentsWithChildren);
      console.log(parentsWithChildren);
    } catch (error) {
      console.error('Error fetching parents and their children data:', error);
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
      id: parent.User_ID,
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

  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/parents/${selectedParent.User_ID}`, //////////////////////////////////
        method: 'DELETE',
        data: { id: selectedParent.User_ID.toString() },
      });
      setParentsData((prev) =>
        prev.filter((parent) => parent.User_ID !== selectedParent.User_ID)
      );
      setIsDeleteDialogOpen(false);
      setSelectedParent(null);
      fetchParents();
    } catch (error) {
      console.error('Error deleting parent:', error);
    }
  };

  return (
    <div className="p-4 rounded-2xl">
      <h2
        className="mb-4 text-3xl font-bold"
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
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">الرقم التعريفي</th>
                <th className="border px-4 py-2 text-center">الاسم</th>
                <th className="border px-4 py-2 text-center">العلاقة</th>
                <th className="border px-4 py-2 text-center">رقم الهاتف</th>
                <th className="border px-4 py-2 text-center">
                  البريد الإلكتروني
                </th>
                <th className="border px-4 py-2 text-center">عدد الأطفال</th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {parentsData.map((parent) => (
                <tr key={parent.User_ID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {parent.User_ID}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {parent.Fname && parent.Lname
                      ? `${parent.Fname} ${parent.Lname}`
                      : 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {parent.relationship === 'Father'
                      ? 'أب'
                      : 'أم' || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {parent.Phonenum || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {parent.email || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {parent.childrenIDs?.length || 0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedParent(parent);
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

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              تعديل {selectedParent.Fname}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xl font-medium mb-1">
                  العلاقة
                </label>
                <select
                  name="relationship"
                  value={editAttributes.relationship}
                  onChange={handleAttributeChange}
                  className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm w-full focus:ring focus:ring-secondary-color focus:outline-none transition-all"
                >
                  <option value="">اختر العلاقة</option>
                  <option value="Father">أب</option>
                  <option value="Mother">أم</option>
                </select>
              </div>
              <div>
                <label className="block text-xl font-medium mb-1">
                  الأطفال
                </label>
                <input
                  type="number"
                  min="0"
                  value={editAttributes.childCount}
                  onChange={handleChildCountChange}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />

                {editAttributes.childrenIDs.map((childID, index) => (
                  <div key={index}>
                    <label>رقم المعرف للطفل {index + 1}</label>
                    <input
                      type="text"
                      value={childID}
                      onChange={(e) =>
                        handleChildIDChange(index, e.target.value)
                      }
                      className="border p-2 w-full mb-2"
                    />
                  </div>
                ))}
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
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4 text-center">
            <h3
              className="text-xl mb-4 font-bold"
              style={{ color: 'var(--secondary-color)' }}
            >
              تأكيد الحذف
            </h3>
            <p>هل أنت متأكد أنك تريد حذف ولى الأمر {selectedParent.Fname} ؟</p>
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

export default Parents;
