import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import useAuthStore from '../store/authStore';

const Announcements = () => {
  const apiRequest = useApi();
  const user = useAuthStore((state) => state.user);

  const [announcementsData, setAnnouncementsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [announcementContent, setAnnouncementContent] = useState('');
  const [priority, setPriority] = useState('High');
  const [visibility, setVisibility] = useState('');
  const [recipients, setRecipients] = useState({
    scout: false,
    parent: false,
    leader: false,
  });
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const announcementsFetch = await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/announcements/`,
        method: 'GET',
      });
      setAnnouncementsData(announcementsFetch.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiRequest]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedRecipients = { ...recipients, [name]: checked };

    setRecipients(updatedRecipients);

    const vis = [
      updatedRecipients.scout && 'S',
      updatedRecipients.parent && 'P',
      updatedRecipients.leader && 'L',
    ]
      .filter(Boolean)
      .join('');
    setVisibility(vis);
  };

  const handleAddAnnouncement = async () => {
    if (!announcementContent.trim()) {
      alert('يرجى كتابة نص الإعلان قبل الإرسال');
      return;
    }

    const vis = [
      recipients.scout && 'S',
      recipients.parent && 'P',
      recipients.leader && 'L',
    ]
      .filter(Boolean)
      .join('');

    if (!vis) {
      alert('يرجى تحديد المستلمين للإعلان');
      return;
    }

    const newAnnouncement = {
      content: announcementContent,
      date: new Date().toISOString(),
      priority: priority ? priority : 'High',
      leader_id: '3',
      // leader_id: user.User_ID.toString(),
      visibility: vis,
    };

    try {
      console.log(newAnnouncement);
      const response = await apiRequest({
        url: announcementToEdit
          ? `${import.meta.env.VITE_BASEURL}/api/announcements/${
              announcementToEdit.Announcement_ID
            }`
          : `${import.meta.env.VITE_BASEURL}/api/announcements/`,
        method: announcementToEdit ? 'PUT' : 'POST',
        data: newAnnouncement,
      });

      if (isEditMode && announcementToEdit) {
        setAnnouncementsData((prev) =>
          prev.map((a) =>
            a.id === announcementToEdit.id ? response.data.Announcement : a
          )
        );
      } else {
        setAnnouncementsData((prev) => [...prev, response.data.Announcement]);
      }

      fetchData();
      setIsModalOpen(false);
      setIsEditMode(false);
      resetForm();
    } catch (error) {
      console.error(error);
      alert('فشل الإرسال. يرجى المحاولة لاحقًا.');
    }
  };

  const handleEdit = (announcement) => {
    setAnnouncementContent(announcement.Content);

    const recipientStates = {
      scout: announcement.Visibility.includes('S'),
      parent: announcement.Visibility.includes('P'),
      leader: announcement.Visibility.includes('L'),
    };
    setRecipients(recipientStates);
    setVisibility(announcement.Visibility);
    setPriority(announcement.Priority);
    setAnnouncementToEdit(announcement);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const handleDelete = (announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `${import.meta.env.VITE_BASEURL}/api/announcements/${
          announcementToDelete.Announcement_ID
        }`,
        method: 'DELETE',
      });
      setAnnouncementsData(
        announcementsData.filter(
          (ann) => ann.Announcement_ID !== announcementToDelete.Announcement_ID
        )
      );
      setIsDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setAnnouncementContent('');
    setRecipients({ scout: false, parent: false, leader: false });
    setVisibility('');
    setPriority('');
    setAnnouncementToEdit(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between justify-center">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ color: 'var(--secondary-color)' }}
        >
          قائمة الاعلانات
        </h2>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة إعلان
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : announcementsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا توجد اعلانات للعرض.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">نص الإعلان</th>
                <th className="border px-4 py-2 text-center">المستلمين</th>
                <th className="border px-4 py-2 text-center">الاولوية</th>
                <th className="border px-4 py-2 text-center">التاريخ</th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {announcementsData.map((announcement) => (
                <tr
                  key={announcement.Announcement_ID}
                  className="hover:bg-gray-100"
                >
                  <td className="border px-4 py-2 text-center">
                    {announcement.Content}
                  </td>
                  <td
                    className="border px-4 py-2 text-center"
                    style={{
                      width: '100px',
                    }}
                  >
                    {announcement.Visibility.split('').map((char, index) => {
                      const label =
                        char === 'S'
                          ? 'الكشافة'
                          : char === 'P'
                          ? 'أولياء الأمور'
                          : char === 'L'
                          ? 'القادة'
                          : '';
                      return <p key={index}>{label}</p>;
                    })}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {announcement.Priority}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(announcement.CreateDate).toLocaleDateString(
                      'ar-EG',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(announcement)}
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

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4 text-center">
            <h3
              className="text-xl mb-4 font-bold"
              style={{ color: 'var(--secondary-color)' }}
            >
              تأكيد الحذف
            </h3>
            <p>هل أنت متأكد من أنك تريد حذف هذا الإعلان؟</p>
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

      {/* Modal for Adding/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              {isEditMode ? 'تعديل' : 'إضافة'} إعلان
            </h3>
            <div className="space-y-4">
              <textarea
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                rows="6"
                placeholder="اكتب إعلانك هنا..."
              />
              <div>
                <label className="block text-xl font-medium mb-1">
                  المستلمون
                </label>
                {['scout', 'parent', 'leader'].map((recipient) => (
                  <label key={recipient} className="mr- text-xl">
                    <input
                      type="checkbox"
                      name={recipient}
                      checked={recipients[recipient]}
                      onChange={handleCheckboxChange}
                      className="mr-2 ml-2 focus:ring focus:ring-secondary-color"
                    />
                    {recipient === 'scout'
                      ? 'الكشافة'
                      : recipient === 'parent'
                      ? 'أولياء الأمور'
                      : 'القادة'}
                  </label>
                ))}
              </div>
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="priority"
                >
                  الاولوية
                </label>
                <select
                  name="priority"
                  value={priority}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setPriority(e.target.value);
                  }}
                  id="priority"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                >
                  <option value="High">عالية</option>
                  <option value="Medium">متوسطة</option>
                  <option value="Low">منخفضة</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddAnnouncement}
                  type="submit"
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  {isEditMode ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
