import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Equipment = () => {
  const apiRequest = useApi();

  const [equipmentData, setEquipmentData] = useState([]);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [locations, setLocations] = useState([]);

  // For delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
    const [loading, setLoading] = useState(true);


  const fetchEquipmentAndLocation = async () => {
    try {
      // Fetch locations
      setLoading(true);
      const locationsFetch = await apiRequest({
        url: 'http://localhost:3000/api/locations/',
        method: 'GET',
      });
      const locationData = locationsFetch.data;
      setLocations(locationData);

      // Fetch equipment
      const equipmentFetch = await apiRequest({
        url: 'http://localhost:3000/api/equipment/',
        method: 'GET',
      });
      const equipment = equipmentFetch.data;

      const EquipmentWithLocation = await Promise.all(
        equipment.map(async (equ) => {
          try {
            const location = locationData.find(
              (loc) => loc.Location_ID === equ.Location_ID
            );
            return {
              ...equ,
              locationName: location ? location.LocationName : 'غير متوفر',
              locationLink: location ? location.Link : null,
            };
          } catch (err) {
            console.error(
              `Error fetching location for equipment ${equ.Ename}`,
              err
            );
            return { ...equ, locationLink: 'غير متوفر' };
          }
        })
      );

      setEquipmentData(EquipmentWithLocation);
    } catch (error) {
      console.error('Error fetching equipment and locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentAndLocation();
  }, [apiRequest]);

  // State for modal and form inputs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentLocation, setEquipmentLocation] = useState('');
  const [equipmentAmount, setEquipmentAmount] = useState('');

  // Handle Adding New Equipment
  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const newEquipment = {
        name: equipmentName,
        location_id: equipmentLocation, // Use selected location ID
        quantity: equipmentAmount,
        date: new Date().toISOString().split('T')[0],
      };

      await apiRequest({
        url: 'http://localhost:3000/api/equipment/',
        method: 'POST',
        data: newEquipment,
      });

      setEquipmentData([...equipmentData, newEquipment]);
      fetchEquipmentAndLocation();
      setIsModalOpen(false);
      setEquipmentName('');
      setEquipmentLocation('');
      setEquipmentAmount('');
    } catch (error) {
      console.error('Error adding new equipment:', error);
    }
  };

  // Handle Editing Existing Equipment
  const handleEditEquipment = (equipmentId) => {
    const equipment = equipmentData.find(
      (equ) => equ.Equipment_ID === equipmentId
    );
    if (equipment) {
      setEquipmentName(equipment.Ename);
      setEquipmentLocation(equipment.Location_ID); // Store the location ID
      setEquipmentAmount(equipment.Quantity.toString());
      setEditingEquipmentId(equipmentId); // Set the ID to indicate editing mode
      setIsModalOpen(true);
    }
  };

  // Handle Updating Equipment
  const handleUpdateEquipment = async (e) => {
    e.preventDefault();

    try {
      const updatedEquipment = {
        name: equipmentName,
        location_id: equipmentLocation.toString(), // Use selected location ID
        quantity: equipmentAmount,
        date: new Date().toISOString().split('T')[0],
      };

      await apiRequest({
        url: `http://localhost:3000/api/equipment/${editingEquipmentId}`,
        method: 'PUT',
        data: { ...updatedEquipment },
      });

      setEquipmentData((prevData) =>
        prevData.map((equipment) =>
          equipment.Equipment_ID === editingEquipmentId
            ? { ...equipment, ...updatedEquipment }
            : equipment
        )
      );

      fetchEquipmentAndLocation();
      setIsModalOpen(false);
      setEditingEquipmentId(null);
      setEquipmentName('');
      setEquipmentLocation('');
      setEquipmentAmount('');
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  // Handle Delete Equipment
  const handleDeleteEquipment = async () => {
    if (equipmentToDelete) {
      try {
        await apiRequest({
          url: `http://localhost:3000/api/equipment/${equipmentToDelete}`,
          method: 'DELETE',
        });

        setEquipmentData(
          equipmentData.filter(
            (equipment) => equipment.Equipment_ID !== equipmentToDelete
          )
        );
        setIsDeleteModalOpen(false);
        setEquipmentToDelete(null);
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (equipmentId) => {
    setEquipmentToDelete(equipmentId);
    setIsDeleteModalOpen(true);
  };

  console.log('equipmentData', equipmentData);
  return (
    <div className="p-4">
      <div className="flex justify-between justify-center">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ color: 'var(--secondary-color)' }}
        >
          قائمة المعدات
        </h2>

        {/* Add Equipment Button */}
        <button
          onClick={() => {
            // Clear the form state for adding new equipment
            setEquipmentName('');
            setEquipmentLocation('');
            setEquipmentAmount('');
            setEditingEquipmentId(null); // Ensure editing ID is null
            setIsModalOpen(true);
          }}
          className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة معدات
        </button>
      </div>

      {/* Equipment Table */}
      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : equipmentData.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد معدات للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">اسم المعدات</th>
                <th className="border px-4 py-2 text-center">الموقع</th>
                <th className="border px-4 py-2 text-center">الكمية</th>
                <th className="border px-4 py-2 text-center">نعديل</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {equipmentData.map((equipment) => (
                <tr key={equipment?.Equipment_ID} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {equipment.Ename}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <a
                      href={equipment.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500"
                    >
                      {equipment.locationName}
                    </a>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {equipment.Quantity}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        handleEditEquipment(equipment.Equipment_ID)
                      }
                      className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                      style={{ background: 'var(--secondary-color)' }}
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => confirmDelete(equipment.Equipment_ID)}
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

      {/* Modal for Adding or Editing Equipment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              {editingEquipmentId ? 'تعديل المعدات' : 'إضافة معدات'}
            </h3>
            <form
              onSubmit={
                editingEquipmentId ? handleUpdateEquipment : handleAddEquipment
              }
              className="space-y-4"
            >
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="equipmentName"
                >
                  اسم المعدات
                </label>
                <input
                  type="text"
                  name="equipmentName"
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  id="equipmentName"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="equipmentLocation"
                >
                  الموقع
                </label>
                <select
                  name="equipmentLocation"
                  value={equipmentLocation}
                  onChange={(e) => setEquipmentLocation(e.target.value)}
                  id="equipmentLocation"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    اختر الموقع
                  </option>
                  {locations.map((loc) => (
                    <option key={loc.Location_ID} value={loc.Location_ID}>
                      {loc.LocationName} ({loc.City}, {loc.Government})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="equipmentAmount"
                >
                  الكمية
                </label>
                <input
                  type="number"
                  name="equipmentAmount"
                  value={equipmentAmount}
                  onChange={(e) => setEquipmentAmount(e.target.value)}
                  id="equipmentAmount"
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
                  {editingEquipmentId ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm mx-4 text-center">
            <h3
              className="text-xl mb-4 font-bold"
              style={{ color: 'var(--secondary-color)' }}
            >
              تأكيد الحذف
            </h3>
            <p>هل أنت متأكد أنك تريد حذف هذه المعدات؟</p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-red-600"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteEquipment}
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

export default Equipment;
