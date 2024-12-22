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
        url: `${import.meta.env.VITE_BASEURL}/api/locations/`,
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
        url: `${import.meta.env.VITE_BASEURL}/api/locations/`,
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
        url: `${import.meta.env.VITE_BASEURL}/api/locations/${locationToEdit.Location_ID}`,
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
  //       url: `${import.meta.env.VITE_BASEURL}/api/locations/${Location_ID}`,
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
         url: `${import.meta.env.VITE_BASEURL}/api/locations/${locationToDelete.Location_ID}`,
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
      <div className="flex justify-between justify-center">
        <h2
          className="mb-4 text-3xl font-bold"
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
      </div>

      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : locationsData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد مواقع لعرضها</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">اسم الموقع</th>
                <th className="border px-4 py-2 text-center">المدينة</th>
                <th className="border px-4 py-2 text-center">المحافظة</th>
                <th className="border px-4 py-2 text-center">رابط الموقع</th>
                <th className="border px-4 py-2 text-center">تعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {locationsData.map((location) => (
                <tr key={location.Location_ID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {location.LocationName}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {location.City}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {location.Government}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <a
                      href={location.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {shortenLink(location.Link)}
                    </a>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(location)}
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(location)}
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4 text-center">
            <h3
              className="text-xl mb-4 font-bold"
              style={{ color: 'var(--secondary-color)' }}
            >
              تأكيد الحذف
            </h3>
            <p>
              هل أنت متأكد من أنك تريد حذف موقع {locationToDelete.LocationName}{' '}
              ؟
            </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              {locationToEdit ? 'تعديل' : 'إضافة'} موقع
            </h3>
            <form
              onSubmit={locationToEdit ? handleEditLocation : handleAddLocation}
              className="space-y-4"
            >
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="locationName"
                >
                  اسم الموقع
                </label>
                <input
                  type="text"
                  name="locationName"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  id="locationName"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="city"
                >
                  المدينة
                </label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  id="city"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="government"
                >
                  المحافظة
                </label>
                <input
                  type="text"
                  name="government"
                  value={government}
                  onChange={(e) => setGovernment(e.target.value)}
                  id="government"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="link"
                >
                  رابط الموقع
                </label>
                <input
                  type="url"
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  id="link"
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
