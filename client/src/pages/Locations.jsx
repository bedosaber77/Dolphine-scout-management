import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Locations = () => {
  const apiRequest = useApi();

  const [locationsData, setLocationsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [government, setGovernment] = useState('');
  const [link, setLink] = useState('');
  const [locationToEdit, setLocationToEdit] = useState(null); // For editing a location

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsFetch = await apiRequest({
          url: 'http://localhost:3000/api/locations/',
          method: 'GET',
        });
        console.log("location :",locationsFetch.data)
        setLocationsData(locationsFetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);

  // Handle adding a new location
  const handleAddLocation = async (e) => {
    e.preventDefault();
    const newLocation = {
      LocationName: locationName,
      City: city,
      Government: government,
      Link: link,
    };
    try {
      const response = await apiRequest({
        url: 'http://localhost:3000/api/locations/',
        method: 'POST',
        data: newLocation,
      });
      setLocationsData([...locationsData, response.data]);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle editing an existing location
  const handleEditLocation = async (e) => {
    e.preventDefault();
    const updatedLocation = {
      LocationName: locationName,
      City: city,
      Government: government,
      Link: link,
    };
    try {
      const response = await apiRequest({
        url: `http://localhost:3000/api/locations/${locationToEdit.Location_ID}`,
        method: 'PUT',
        data: updatedLocation,
      });
      setLocationsData(
        locationsData.map((location) =>
          location.Location_ID === locationToEdit.Location_ID
            ? { ...location, ...updatedLocation }
            : location
        )
      );
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle deleting a location
  const handleDelete = async (Location_ID) => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/locations/${Location_ID}`,
        method: 'DELETE',
      });
      setLocationsData(
        locationsData.filter((location) => location.Location_ID !== Location_ID)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setLocationName('');
    setCity('');
    setGovernment('');
    setLink('');
    setLocationToEdit(null);
  };

  // Handle editing a location
  const handleEdit = (location) => {
    setLocationName(location.LocationName);
    setCity(location.City);
    setGovernment(location.Government);
    setLink(location.Link);
    setLocationToEdit(location);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة المواقع
      </h2>

      {/* Add Location Button */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          resetForm(); // Ensure the form is reset when adding a new location
        }}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة موقع
      </button>

      {/* Locations Table */}
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
                  {location.Link}
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
                  onClick={() => handleDelete(location.Location_ID)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding/Editing Location */}
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
