import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const ScoutsView = () => {
  const apiRequest = useApi();
  const [scoutsData, setScoutsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScout, setSelectedScout] = useState(null);
  const [parents, setParents] = useState([]);
  const [users, setUsers] = useState([]);
  const [editAttributes, setEditAttributes] = useState({
    rank: '',
    Birthdate: '',
    academicYear: '',
    joinDate: '',
    PaperSubmitted: 'false',
    Father: '',
    Mother: '',
  });

  const fetchScouts = async () => {
    setLoading(true);
    try {
      const scoutsFetch = await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/scouts/`,
        method: 'GET',
      });
      const usersFetch = await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/users/unverified`,
        method: 'GET',
      });
      const parentsallFetch = await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/parents`,
        method: 'GET',
      });
      setParents(parentsallFetch.data);
      setUsers(usersFetch.data);
      const scouts = scoutsFetch.data;

      scouts.forEach(async (scout) => {
        const parentsFetch = await apiRequest({
          url: `${import.meta.env.VITE_BASEURL}/api/scouts/${
            scout.User_ID
          }/parents`,
          method: 'GET',
        });
        scout.Father = parentsFetch.data.find(
          (parent) => parent.gender === 'Male'
        )?.User_ID;

        scout.Mother = parentsFetch.data.find(
          (parent) => parent.gender === 'Female'
        )?.User_ID;
      });

      console.log('Fetched scouts:', scouts);

      setScoutsData(scouts);
    } catch (error) {
      console.error('Error fetching scouts data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScouts();
  }, [apiRequest]);

  const handleEdit = (scout) => {
    setSelectedScout(scout);
    setEditAttributes({
      id: scout.User_ID.toString(),
      rank: scout.rank || '',
      Birthdate: scout.Birthdate || '',
      academicYear: scout.academicYear || '',
      joinDate: scout.joinDate || '',
      PaperSubmitted: scout.PaperSubmitted || 'false',
      Father: scout.Father || '',
      Mother: scout.Mother || '',
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/scouts/${
          selectedScout.User_ID
        }`,
        method: 'DELETE',
      });
      await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/users/${
          selectedScout.User_ID
        }`,
        method: 'PATCH',
        data: { role: null },
      });
      setScoutsData((prev) =>
        prev.filter((scout) => scout.User_ID !== selectedScout.User_ID)
      );
      setIsDeleteDialogOpen(false);
      setSelectedScout(null);
      fetchScouts();
    } catch (error) {
      console.error('Error deleting scout:', error);
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
        url: `${import.meta.env.VITE_BASEURL}/api/scouts/${
          selectedScout.User_ID
        }`,
        method: 'PUT',
        data: editAttributes,
      });
      if (editAttributes.Father != selectedScout.Father) {
        if (typeof selectedScout.Father === 'undefined') {
          if (
            parents.some((parent) => parent.User_ID == editAttributes.Father)
          ) {
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                editAttributes.Father
              }/scouts`,
              method: 'POST',
              data: { scout_id: selectedScout.User_ID.toString() },
            });
          } else if (
            users.some((user) => user.User_ID == editAttributes.Father)
          ) {
            console.log('dssdsa?');
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents`,
              method: 'POST',
              data: { User_ID: editAttributes.Father, gender: 'Male' },
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/users/${
                editAttributes.Father
              }`,
              method: 'PATCH',
              data: { role: 'Parent' },
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                editAttributes.Father
              }/scouts`,
              method: 'POST',
              data: { scout_id: selectedScout.User_ID.toString() },
            });
          }
        } else if (
          typeof editAttributes.Father === 'undefined' ||
          editAttributes.Father === ''
        ) {
          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Father
            }/scouts/${selectedScout.User_ID}`,
            method: 'DELETE',
          });
          const children = await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Father
            }/scouts`,
            method: 'GET',
          });
          if (children.data.length == 0) {
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                selectedScout.Father
              }`,
              method: 'DELETE',
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/users/${
                selectedScout.Father
              }`,
              method: 'PATCH',
              data: { role: null },
            });
          }
        } else if (
          typeof editAttributes.Father !== 'undefined' &&
          editAttributes.Father !== '' &&
          typeof selectedScout.Father !== 'undefined'
        ) {
          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Father
            }/scouts/${selectedScout.User_ID}`,
            method: 'DELETE',
          });
          const children = await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Father
            }/scouts`,
            method: 'GET',
          });
          if (children.data.length == 0) {
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                selectedScout.Father
              }`,
              method: 'DELETE',
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/users/${
                selectedScout.Father
              }`,
              method: 'PATCH',
              data: { role: null },
            });
          }
          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              editAttributes.Father
            }/scouts`,
            method: 'POST',
            data: { scout_id: selectedScout.User_ID.toString() },
          });
        }
      }

      if (editAttributes.Mother != selectedScout.Mother) {
        if (typeof selectedScout.Mother === 'undefined') {
          if (
            parents.some((parent) => parent.User_ID == editAttributes.Mother)
          ) {
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                editAttributes.Mother
              }/scouts`,
              method: 'POST',
              data: { scout_id: selectedScout.User_ID.toString() },
            });
          } else if (
            users.some((user) => user.User_ID == editAttributes.Mother)
          ) {
            console.log('dssdsa?');
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents`,
              method: 'POST',
              data: { User_ID: editAttributes.Mother, gender: 'Female' },
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/users/${
                editAttributes.Mother
              }`,
              method: 'PATCH',
              data: { role: 'Parent' },
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                editAttributes.Mother
              }/scouts`,
              method: 'POST',
              data: { scout_id: selectedScout.User_ID.toString() },
            });
          }
        } else if (
          typeof editAttributes.Mother === 'undefined' ||
          editAttributes.Mother === ''
        ) {
          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Mother
            }/scouts/${selectedScout.User_ID}`,
            method: 'DELETE',
          });
          const children = await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Mother
            }/scouts`,
            method: 'GET',
          });
          if (children.data.length == 0) {
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                selectedScout.Mother
              }`,
              method: 'DELETE',
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/users/${
                selectedScout.Mother
              }`,
              method: 'PATCH',
              data: { role: null },
            });
          }
        } else if (
          typeof editAttributes.Mother !== 'undefined' &&
          editAttributes.Mother !== '' &&
          typeof selectedScout.Mother !== 'undefined'
        ) {
          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Mother
            }/scouts/${selectedScout.User_ID}`,
            method: 'DELETE',
          });
          const children = await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              selectedScout.Mother
            }/scouts`,
            method: 'GET',
          });
          if (children.data.length == 0) {
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/parents/${
                selectedScout.Mother
              }`,
              method: 'DELETE',
            });
            await apiRequest({
              url: `${import.meta.env.VITE_BASEURL}/api/users/${
                selectedScout.Mother
              }`,
              method: 'PATCH',
              data: { role: null },
            });
          }
          await apiRequest({
            url: `${import.meta.env.VITE_BASEURL}/api/parents/${
              editAttributes.Mother
            }/scouts`,
            method: 'POST',
            data: { scout_id: selectedScout.User_ID.toString() },
          });
        }
      }

      setScoutsData((prevData) =>
        prevData.map((scout) =>
          scout.User_ID === selectedScout.User_ID
            ? { ...scout, ...editAttributes }
            : scout
        )
      );
      setIsDialogOpen(false);
      setSelectedScout(null);
      fetchScouts();
    } catch (error) {
      console.error('Error updating scout:', error);
    }
  };

  return (
    <div className="p-4 rounded-2xl">
      <h2
        className="mb-4 text-3xl font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة الكشافة
      </h2>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : scoutsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد كشافة للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">الرقم التعريفي</th>
                <th className="border px-4 py-2 text-center">اسم الكشاف</th>
                <th className="border px-4 py-2 text-center">رقم الهاتف</th>
                <th className="border px-4 py-2 text-center">
                  البريد الإلكتروني
                </th>
                <th className="border px-4 py-2 text-center">الرتبة</th>
                <th className="border px-4 py-2 text-center">تاريخ الميلاد</th>
                <th className="border px-4 py-2 text-center">
                  السنة الأكاديمية
                </th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {scoutsData.map((scout) => (
                <tr key={scout.User_ID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {scout.User_ID}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {scout.Fname && scout.Lname
                      ? `${scout.Fname} ${scout.Lname}`
                      : 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {scout.Phonenum || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {scout.email || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {scout.rank || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(scout.Birthdate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {scout.academicYear || 'غير متوفر'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(scout)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedScout(scout);
                        setIsDeleteDialogOpen(true);
                      }}
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

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              تعديل {selectedScout.Fname}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xl font-medium mb-1">الرتبة</label>
                <input
                  name="rank"
                  value={editAttributes.rank}
                  onChange={handleAttributeChange}
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
                  value={editAttributes.Birthdate.split('T')[0]}
                  onChange={handleAttributeChange}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xl font-medium mb-1">
                  السنة الأكاديمية
                </label>
                <input
                  name="academicYear"
                  value={editAttributes.academicYear}
                  onChange={handleAttributeChange}
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
                  value={editAttributes.joinDate.split('T')[0]}
                  onChange={handleAttributeChange}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="PaperSubmitted"
                  checked={editAttributes.PaperSubmitted === 'true'}
                  onChange={handleAttributeChange}
                  className="mr-2 focus:ring focus:ring-secondary-color"
                />
                <label className="mr-2 text-xl">تسليم الورق</label>
              </div>
              <div>
                <label className="block text-xl font-medium mb-1">
                  الرقم التعريفي للأب
                </label>
                <input
                  name="Father"
                  onChange={handleAttributeChange}
                  value={editAttributes.Father}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xl font-medium mb-1">
                  الرقم التعريفي للأم
                </label>
                <input
                  name="Mother"
                  onChange={handleAttributeChange}
                  value={editAttributes.Mother}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
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
            <p>هل أنت متأكد أنك تريد حذف الكشاف {selectedScout.Fname}؟</p>
            <div className="flex justify-between mt-4">
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

export default ScoutsView;
