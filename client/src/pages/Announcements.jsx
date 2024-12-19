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
        url: 'http://localhost:3000/api/announcements/',
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
          ? `http://localhost:3000/api/announcements/${announcementToEdit.Announcement_ID}`
          : 'http://localhost:3000/api/announcements/',
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
        url: `http://localhost:3000/api/announcements/${announcementToDelete.Announcement_ID}`,
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
      <h2
        className="mb-4 text-lg font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        الإعلانات
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

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : announcementsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا توجد مواقع لعرضها.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">نص الإعلان</th>
              <th className="border px-4 py-2">المستلمين</th>
              <th className="border px-4 py-2">الاولوية</th>
              <th className="border px-4 py-2">التاريخ</th>
              <th className="border px-4 py-2">تعديل</th>
              <th className="border px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {announcementsData.map((announcement) => (
              <tr
                key={announcement.Announcement_ID}
                className="hover:bg-gray-100"
              >
                <td className="border px-4 py-2">{announcement.Content}</td>
                <td
                  className="border px-4 py-2"
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
                <td className="border px-4 py-2">{announcement.Priority}</td>
                <td className="border px-4 py-2">{announcement.CreateDate}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                    style={{ background: 'var(--secondary-color)' }}
                  >
                    تعديل
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(announcement)}
                    className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">تأكيد الحذف</h3>
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">
              {isEditMode ? 'تعديل' : 'إضافة'} إعلان
            </h3>
            <textarea
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows="6"
              placeholder="اكتب إعلانك هنا..."
            />
            <div className="mb-4">
              <label className="block mb-2 font-medium">المستلمون</label>
              {['scout', 'parent', 'leader'].map((recipient) => (
                <label
                  key={recipient}
                  className="inline-flex items-center gap-x-2"
                >
                  <input
                    type="checkbox"
                    name={recipient}
                    checked={recipients[recipient]}
                    onChange={handleCheckboxChange}
                  />
                  {recipient === 'scout'
                    ? 'الكشافة'
                    : recipient === 'parent'
                    ? 'أولياء الأمور'
                    : 'القادة'}
                </label>
              ))}
            </div>
            <div className="mb-4">
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
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
      )}
    </div>
  );
};

export default Announcements;
