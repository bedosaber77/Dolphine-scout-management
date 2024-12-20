import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';
import axios from 'axios';
import useApi from '../hooks/useApi';

const SponsorsView = () => {
  const apiRequest = useApi();
  const { accessToken } = useAuthStore();
  const [sponsors, setSponsors] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState(null);

  const fetchSponsors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/sponsors', {
        headers: {
          accessToken: accessToken,
        },
      });
      setSponsors(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <div className="p-4">
      <h2
        className="mb-4 text-3x font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        الممولين
      </h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة ممول
      </button>

      {/* SponsorsView Table */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">اسم الممول</th>
            <th className="border px-4 py-2">رقم الهاتف</th>
            <th className="border px-4 py-2">البريد الالكتروني</th>
            <th className="border px-4 py-2">تعديل</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">
                {sponsor.Fname + ' ' + sponsor.Lname}
              </td>
              <td className="border px-4 py-2">
                {sponsor.PhoneNum ? sponsor.PhoneNum : 'N/A'}
              </td>
              <td className="border px-4 py-2">
                {sponsor.Email ? sponsor.Email : 'N/A'}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditClick(sponsor)}
                  className="bg-secondary-color text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(sponsor)}
                  className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">تأكيد الحذف</h3>
            <p>هل أنت متأكد من أنك تريد حذف هذا الممول؟</p>
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">إضافة ممول</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="fName"
                  className="block text-sm font-medium text-gray-700"
                >
                  الاسم الأول
                </label>
                <input
                  type="text"
                  name="fName"
                  value={sponsor.fName}
                  onChange={handleInputChange}
                  id="fName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="lName"
                  className="block text-sm font-medium text-gray-700"
                >
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  name="lName"
                  value={sponsor.lName}
                  onChange={handleInputChange}
                  id="lName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phoneNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  name="phoneNum"
                  value={sponsor.phoneNum}
                  onChange={handleInputChange}
                  id="phoneNum"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  البريد الالكتروني
                </label>
                <input
                  type="text"
                  name="email"
                  value={sponsor.email}
                  onChange={handleInputChange}
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">إضافة ممول</h3>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label
                  htmlFor="Fname"
                  className="block text-sm font-medium text-gray-700"
                >
                  الاسم الأول
                </label>
                <input
                  type="text"
                  name="Fname"
                  value={editingSponsor.Fname}
                  onChange={handleEditChange}
                  id="Fname"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="Lname"
                  className="block text-sm font-medium text-gray-700"
                >
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  name="Lname"
                  value={editingSponsor.Lname}
                  onChange={handleEditChange}
                  id="Lname"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="PhoneNum"
                  className="block text-sm font-medium text-gray-700"
                >
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  name="PhoneNum"
                  value={editingSponsor.PhoneNum}
                  onChange={handleEditChange}
                  id="PhoneNum"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  البريد الالكتروني
                </label>
                <input
                  type="text"
                  name="Email"
                  value={editingSponsor.Email}
                  onChange={handleEditChange}
                  id="Email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
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
