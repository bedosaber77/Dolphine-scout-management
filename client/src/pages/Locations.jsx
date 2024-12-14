import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Locations = () => {
  const apiRequest = useApi();

  const [locationsData, setLocationsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [government, setGovernment] = useState('');
  const [link, setLink] = useState('');
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [loading, setLoading] = useState(true); // For loading indicator

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const locationsFetch = await apiRequest({
        url: 'http://localhost:3000/api/locations/',
        method: 'GET',
      });
      setLocationsData(locationsFetch.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiRequest]);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    const newLocation = {
      name: locationName,
      city: city,
      government: government,
      link: link,
    };
    try {
      await apiRequest({
        url: 'http://localhost:3000/api/locations/',
        method: 'POST',
        data: newLocation,
      });
      fetchData(); // Refresh data
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditLocation = async (e) => {
    e.preventDefault();
    const updatedLocation = {
      name: locationName,
      city: city,
      government: government,
      link: link,
    };
    try {
      await apiRequest({
        url: `http://localhost:3000/api/locations/${locationToEdit.Location_ID}`,
        method: 'PUT',
        data: updatedLocation,
      });
      fetchData(); // Refresh data
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDelete = async (Location_ID) => {
  //   try {
  //     await apiRequest({
  //       url: `http://localhost:3000/api/locations/${Location_ID}`,
  //       method: 'DELETE',
  //     });
  //     fetchData(); // Refresh data
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

   const handleDelete = (location) => {
     setLocationToDelete(location);
     setIsDeleteDialogOpen(true);
   };

   const confirmDelete = async () => {
     try {
       await apiRequest({
         url: `http://localhost:3000/api/locations/${locationToDelete.Location_ID}`,
         method: 'DELETE',
       });
       setLocationsData(
         locationsData.filter(
           (loc) => loc.Location_ID !== locationToDelete.Location_ID
         )
       );
       fetchData();
       setIsDeleteDialogOpen(false);
       setLocationToDelete(null);
     } catch (error) {
       console.error(error);
     }
   };

  const resetForm = () => {
    setLocationName('');
    setCity('');
    setGovernment('');
    setLink('');
    setLocationToEdit(null);
  };

  const handleEdit = (location) => {
    setLocationName(location.LocationName);
    setCity(location.City);
    setGovernment(location.Government);
    setLink(location.Link);
    setLocationToEdit(location);
    setIsModalOpen(true);
  };

  const shortenLink = (url) => {
    const maxLength = 20;
    return url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;
  };

  return (
    <div className="p-4">
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة المواقع
      </h2>

      <button
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة موقع
      </button>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : locationsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا توجد مواقع لعرضها.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">اسم الموقع</th>
              <th className="border px-4 py-2">المدينة</th>
              <th className="border px-4 py-2">المحافظة</th>
              <th className="border px-4 py-2">رابط الموقع</th>
              <th className="border px-4 py-2">تعديل</th>
              <th className="border px-4 py-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {locationsData.map((location) => (
              <tr key={location.Location_ID} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{location.LocationName}</td>
                <td className="border px-4 py-2">{location.City}</td>
                <td className="border px-4 py-2">{location.Government}</td>
                <td className="border px-4 py-2">
                  <a
                    href={location.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {shortenLink(location.Link)}
                  </a>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(location)}
                    className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                    style={{ background: 'var(--secondary-color)' }}
                  >
                    تعديل
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(location)}
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
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">تأكيد الحذف</h3>
            <p>هل أنت متأكد من أنك تريد حذف هذا الموقع</p>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">
              {locationToEdit ? 'تعديل' : 'إضافة'} موقع
            </h3>
            <form
              onSubmit={locationToEdit ? handleEditLocation : handleAddLocation}
            >
              <div className="mb-4">
                <label
                  htmlFor="locationName"
                  className="block text-sm font-medium text-gray-700"
                >
                  اسم الموقع
                </label>
                <input
                  type="text"
                  name="locationName"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  id="locationName"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  المدينة
                </label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  id="city"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="government"
                  className="block text-sm font-medium text-gray-700"
                >
                  المحافظة
                </label>
                <input
                  type="text"
                  name="government"
                  value={government}
                  onChange={(e) => setGovernment(e.target.value)}
                  id="government"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="link"
                  className="block text-sm font-medium text-gray-700"
                >
                  رابط الموقع
                </label>
                <input
                  type="url"
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  id="link"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
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
                  {locationToEdit ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
