import { useState } from 'react';

const Locations = () => {
  // State to hold the locations data
  const [locationsData, setLocationsData] = useState([
    { name: 'موقع 1', url: 'https://example.com/location1' },
    { name: 'موقع 2', url: 'https://example.com/location2' },
  ]);

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationURL, setLocationURL] = useState('');

  // Add a new location
  const handleSubmitLocation = (e) => {
    e.preventDefault();
    setLocationsData([...locationsData, { name: locationName, url: locationURL }]);
    setIsModalOpen(false);
    setLocationName('');
    setLocationURL('');
  };

  // Delete a location
  const handleDelete = (locationName) => {
    setLocationsData(locationsData.filter((location) => location.name !== locationName));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--secondary-color)' }}>
        قائمة المواقع
      </h2>

      {/* Add Location Button */}
      <button
        onClick={() => setIsModalOpen(true)}
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
            <th className="border px-4 py-2">رابط الموقع</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {locationsData.map((location, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{location.name}</td>
              <td className="border px-4 py-2">
                <a href={location.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {location.url}
                </a>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(location.name)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Location */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">إضافة موقع</h3>
            <form onSubmit={handleSubmitLocation}>
              <div className="mb-4">
                <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="locationURL" className="block text-sm font-medium text-gray-700">
                  رابط الموقع
                </label>
                <input
                  type="url"
                  name="locationURL"
                  value={locationURL}
                  onChange={(e) => setLocationURL(e.target.value)}
                  id="locationURL"
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
                  إضافة
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
