import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Verifications = () => {
  const apiRequest = useApi();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [extraAttributes, setExtraAttributes] = useState({});
  const [childrenIDs, setChildrenIDs] = useState([]); // Child inputs
  const [relationship, setRelationship] = useState([]); // Track relationships for children

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersFetch = await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/users/unverified`,
        method: 'GET',
      });
      setUsersData(usersFetch.data);
      console.log(usersFetch.data);
    } catch (error) {
      console.error('Error fetching users data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiRequest]);

  const handleVerification = (user) => {
    setSelectedUser(user);
    setRole('');
    setExtraAttributes({});
    setChildrenIDs([]);
    setIsRoleDialogOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/users/${userToDelete.User_ID}`,
        method: 'DELETE',
      });
      fetchData();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExtraAttributeChange = (e) => {
    const { name, value } = e.target;
    setExtraAttributes({ ...extraAttributes, [name]: value });
  };

  const handleChildCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setChildrenIDs(Array(count).fill('')); 
  };

  const handleChildIDChange = (index, value) => {
    const updatedChildren = [...childrenIDs];
    updatedChildren[index] = value;
    setChildrenIDs(updatedChildren);
  };

  const handleConfirmVerification = async () => {
    if (!role) {
      alert('يرجى اختيار دور للمستخدم');
      return;
    }

    if (role === 'parent' && !relationship) {
      alert('يرجى اختيار العلاقة (الأب أو الأم)');
      return;
    }

    try {
      const userID = selectedUser.User_ID.toString();
      let payload = { User_ID: userID, ...extraAttributes };
      let url = '';
      console.log(payload);

      if (role === 'Scout') {
          url = `${import.meta.env.VITE_BASEURL}/api/scouts`;
          await apiRequest({ url, method: 'POST', data: payload });

          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/users/${userID}`,
            method: 'PATCH',
            data: { role: role },
          });
      } else if (role === 'Scoutleader') {
          url = `${import.meta.env.VITE_BASEURL}/api/scoutleaders`;
          await apiRequest({ url, method: 'POST', data: payload });

          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/users/${userID}`,
            method: 'PATCH',
            data: { role: role },
          });
        
      } else if (role === 'Parent') {
          url = `${import.meta.env.VITE_BASEURL}/api/parents`;
          await apiRequest({ url, method: 'POST', data: { User_ID: userID } });

          for (const childID of childrenIDs) {
            if (childID) {
              await apiRequest({
                url: `${import.meta.env.VITE_BASEURL}/api/parents/${userID}/scouts`,
                method: 'POST',
                data: {
                  id: userID.toString(),
                  scout_id: childID.toString(),
                  relationship: relationship,
                },
              });
            }
          }

          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/users/${userID}`,
            method: 'PATCH',
            data: { role: role },
          });
        fetchData();
        setIsRoleDialogOpen(false);
        setSelectedUser(null);
        return;
      }

      // Refresh the data and close dialog
      fetchData();
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  return (
    <div className="p-4 rounded-2xl">
      <h2
        className="mb-4 text-3xl font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        حسابات قيد الانتظار
      </h2>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : usersData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">
          لا يوجد حسابات قيد الانتظار
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">اسم المستخدم</th>
                <th className="border px-4 py-2 text-center">رقم الهاتف</th>
                <th className="border px-4 py-2 text-center">
                  البريد الإلكتروني
                </th>
                <th className="border px-4 py-2 text-center">تفعيل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.User_ID}>
                  <td className="border px-4 py-2 text-center">
                    {user.Fname && user.Lname
                      ? `${user.Fname} ${user.Lname}`
                      : 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {user.Phonenum || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {user.email || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleVerification(user)}
                      className="bg-green-500 text-white hover:text-white px-4 py-2 rounded-lg"
                    >
                      تفعيل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(user)}
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

      {/* Verification Dialog */}
      {isRoleDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              تفعيل الحساب
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xl font-medium mb-1">
                  اختر الدور
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="">اختر الدور</option>
                  <option value="Scout">كشاف</option>
                  <option value="Parent">ولى امر</option>
                  <option value="Scoutleader">قائد</option>
                </select>
              </div>

              {role === 'Scout' && (
                <>
                  <div>
                    <label className="block text-xl font-medium mb-1">
                      الرتبة
                    </label>
                    <input
                      name="rank"
                      onChange={handleExtraAttributeChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-medium mb-1">
                      تاريخ الميلاد
                    </label>
                    <input
                      name="Birthdate"
                      type="date"
                      onChange={handleExtraAttributeChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-medium mb-1">
                      السنة الأكاديمية
                    </label>
                    <input
                      name="academicYear"
                      onChange={handleExtraAttributeChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xl font-medium mb-1">
                      تاريخ الانضمام
                    </label>
                    <input
                      name="joinDate"
                      type="date"
                      onChange={handleExtraAttributeChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="PaperSubmitted"
                      onChange={(e) =>
                        setExtraAttributes({
                          ...extraAttributes,
                          PaperSubmitted: e.target.checked ? 'true' : 'false', // Convert boolean to string
                        })
                      }
                      className="mr-2 focus:ring focus:ring-secondary-color"
                    />
                    <label className="mr-2 text-xl">تسليم الورق</label>
                  </div>
                </>
              )}

              {role === 'Parent' && (
                <>
                  <div>
                    <label className="block text-xl font-medium mb-1">
                      العلاقة
                    </label>
                    <select
                      onChange={(e) => setRelationship(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                    >
                      <option value="">اختر العلاقة</option>
                      <option value="Father">الأب</option>
                      <option value="Mother">الأم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xl font-medium mb-1">
                      عدد الأطفال
                    </label>
                    <input
                      type="number"
                      min="0"
                      onChange={handleChildCountChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                    />
                  </div>
                  {childrenIDs.map((_, index) => (
                    <div key={index}>
                      <label className="block text-xl font-medium mb-1">
                        رقم المعرف للطفل {index + 1}
                      </label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleChildIDChange(index, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                      />
                    </div>
                  ))}
                </>
              )}

              {role === 'Scoutleader' && (
                <>
                  <div>
                    <label className="block text-xl font-medium mb-1">
                      تاريخ البداية
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      onChange={handleExtraAttributeChange}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                    />
                  </div>
                  {/* Checkbox for هل هو مدير؟ */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAdmin"
                      onChange={(e) =>
                        setExtraAttributes({
                          ...extraAttributes,
                          isAdmin: e.target.checked ? 'true' : 'false', // Convert boolean to string
                        })
                      }
                      className="mr-2 focus:ring focus:ring-secondary-color"
                    />
                    <label className="mr-2 text-xl">هل هو مدير؟</label>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setIsRoleDialogOpen(false)}
                  className="bg-gray-300 px-4 py-2 hover:text-red-600 rounded-lg mr-2"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmVerification}
                  className="bg-green-500 text-white hover:text-white px-4 py-2 rounded-lg"
                >
                  تفعيل
                </button>
              </div>
            </div>
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
            
              >تأكيد الحذف
            </h3>
            <p>هل أنت متأكد من أنك تريد حذف هذا حساب {userToDelete.Fname} ؟</p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
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

export default Verifications;
