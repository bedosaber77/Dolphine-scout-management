import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';
import axios from 'axios';
import useApi from '../hooks/useApi';

const SponsorsView = () => {
  const apiRequest = useApi();
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();
  const [sponsors, setSponsors] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState(null);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/sponsors', {
        headers: {
          accessToken: accessToken,
        },
      });
      setSponsors(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = (sponsor) => {
    setSponsorToDelete(sponsor);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (sponsor) => {
    console.log('Editing sponsor:', sponsor);
    setEditingSponsor(sponsor);
    setIsEditModalOpen(true);
  };

  const confirmDelete = async () => {
    console.log('Deleting sponsor:', sponsorToDelete);
    try {
      await apiRequest({
        url: `http://localhost:3000/api/sponsors/${sponsorToDelete.Sponsor_ID}`,
        method: 'DELETE',
      });
      setIsDeleteDialogOpen(false);
      setSponsorToDelete(null);
    } catch (error) {
      console.error(error);
    }
    fetchSponsors();
  };

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sponsor, setSponsor] = useState({
    fName: '',
    lName: '',
    phoneNum: '',
    email: '',
  });

  const [editingSponsor, setEditingSponsor] = useState({
    Fname: '',
    Lname: '',
    PhoneNum: '',
    Email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input event
    setSponsor((prev) => ({
      ...prev,
      [name]: value, // Dynamically set the state based on input name
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input event
    setEditingSponsor((prev) => ({
      ...prev,
      [name]: value, // Dynamically set the state based on input name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sponsor.phoneNum = sponsor.phoneNum ? sponsor.phoneNum : 'N/A';
    await axios.post(
      'http://localhost:3000/api/sponsors',
      JSON.stringify(sponsor),
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: accessToken,
        },
      }
    );
    // Add the new sponsor to the SponsorsView array
    fetchSponsors();
    setIsModalOpen(false); // Close the modal after submitting
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    editingSponsor.PhoneNum = editingSponsor.PhoneNum
      ? editingSponsor.PhoneNum
      : 'N/A';
    const sponsor = {
      fName: editingSponsor.Fname,
      lName: editingSponsor.Lname,
      phoneNum: editingSponsor.PhoneNum,
      email: editingSponsor.Email,
    };
    await axios.put(
      `http://localhost:3000/api/sponsors/${editingSponsor.Sponsor_ID}`,
      JSON.stringify(sponsor),
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: accessToken,
        },
      }
    );
    // Add the new sponsor to the SponsorsView array
    fetchSponsors();
    setIsEditModalOpen(false); // Close the modal after submitting
  };

  return (
    <div className="p-4 rounded-2xl">
      <div className="flex justify-between">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ color: 'var(--secondary-color)' }}
        >
          قائمة الممولين
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة ممول
        </button>
      </div>

      {/* SponsorsView Table */}
      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : sponsors.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد ممولين للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">اسم الممول</th>
                <th className="border px-4 py-2 text-center">رقم الهاتف</th>
                <th className="border px-4 py-2 text-center">
                  البريد الالكتروني
                </th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((sponsor, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {sponsor.Fname + ' ' + sponsor.Lname}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {sponsor.PhoneNum ? sponsor.PhoneNum : 'N/A'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {sponsor.Email ? sponsor.Email : 'N/A'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEditClick(sponsor)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(sponsor)}
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

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">تأكيد الحذف</h3>
            <p>هل أنت متأكد من أنك تريد حذف الممول {sponsorToDelete.Fname}؟</p>
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

      {/* Modal for Adding Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              إضافة ممول
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="fName"
                >
                  الاسم الأول
                </label>
                <input
                  type="text"
                  name="fName"
                  value={sponsor.fName}
                  onChange={handleInputChange}
                  id="fName"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="lName"
                >
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  name="lName"
                  value={sponsor.lName}
                  onChange={handleInputChange}
                  id="lName"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="phoneNum"
                >
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  name="phoneNum"
                  value={sponsor.phoneNum}
                  onChange={handleInputChange}
                  id="phoneNum"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="email"
                >
                  البريد الالكتروني
                </label>
                <input
                  type="text"
                  name="email"
                  value={sponsor.email}
                  onChange={handleInputChange}
                  id="email"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
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

      {/* Edit Modal */}
      {isEditModalOpen && editingSponsor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              تعديل {editingSponsor.Fname}
            </h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Fname"
                >
                  الاسم الأول
                </label>
                <input
                  type="text"
                  name="Fname"
                  value={editingSponsor.Fname}
                  onChange={handleEditChange}
                  id="Fname"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Lname"
                >
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  name="Lname"
                  value={editingSponsor.Lname}
                  onChange={handleEditChange}
                  id="Lname"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="PhoneNum"
                >
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  name="PhoneNum"
                  value={editingSponsor.PhoneNum}
                  onChange={handleEditChange}
                  id="PhoneNum"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="Email"
                >
                  البريد الالكتروني
                </label>
                <input
                  type="text"
                  name="Email"
                  value={editingSponsor.Email}
                  onChange={handleEditChange}
                  id="Email"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
    </div>
  );
};

export default SponsorsView;
