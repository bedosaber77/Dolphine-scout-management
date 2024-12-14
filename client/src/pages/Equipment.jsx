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

  useEffect(() => {
    const fetchEquipmentAndLocation = async () => {
      try {
        // Fetch locations
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
                locationLink: location ? location.LocationName : 'غير متوفر',
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
      }
    };

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
        date:new Date().toISOString().split('T')[0],
      };

      await apiRequest({
        url: 'http://localhost:3000/api/equipment/',
        method: 'POST',
        data: newEquipment,
      });

      setEquipmentData([...equipmentData, newEquipment]);
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
      setEditingEquipmentId(equipmentId);
      setIsModalOpen(true);
    }
  };

  // Handle Updating Equipment
  const handleUpdateEquipment = async (e) => {
    e.preventDefault();

    try {
      const updatedEquipment = {
        name: equipmentName,
        location_id: equipmentLocation, // Use selected location ID
        quantity: equipmentAmount
      };

      await apiRequest({
        url: `http://localhost:3000/api/equipment/${editingEquipmentId}`,
        method: 'PUT',
        data: updatedEquipment,
      });

      setEquipmentData((prevData) =>
        prevData.map((equipment) =>
          equipment.Equipment_ID === editingEquipmentId
            ? { ...equipment, ...updatedEquipment }
            : equipment
        )
      );

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
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة المعدات
      </h2>

      {/* Add Equipment Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة معدات
      </button>

      {/* Equipment Table */}
      <table className="min-w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">اسم المعدات</th>
            <th className="border px-4 py-2">الموقع</th>
            <th className="border px-4 py-2">الكمية</th>
            <th className="border px-4 py-2">نعديل</th>
            <th className="border px-4 py-2">حذف</th>
          </tr>
        </thead>
        <tbody>
          {equipmentData.map((equipment) => (
            <tr key={equipment?.Equipment_ID} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{equipment.Ename}</td>
              <td className="border px-4 py-2">{equipment.locationLink}</td>
              <td className="border px-4 py-2">{equipment.Quantity}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditEquipment(equipment.Equipment_ID)}
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => confirmDelete(equipment.Equipment_ID)}
                  className="bg-red-600 text-white hover:text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding or Editing Equipment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">
              {editingEquipmentId ? 'تعديل المعدات' : 'إضافة معدات'}
            </h3>
            <form
              onSubmit={
                editingEquipmentId ? handleUpdateEquipment : handleAddEquipment
              }
            >
              <div className="mb-4">
                <label
                  htmlFor="equipmentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  اسم المعدات
                </label>
                <input
                  type="text"
                  name="equipmentName"
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  id="equipmentName"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="equipmentLocation"
                  className="block text-sm font-medium text-gray-700"
                >
                  الموقع
                </label>
                <select
                  name="equipmentLocation"
                  value={equipmentLocation}
                  onChange={(e) => setEquipmentLocation(e.target.value)}
                  id="equipmentLocation"
                  className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
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

              <div className="mb-4">
                <label
                  htmlFor="equipmentAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  الكمية
                </label>
                <input
                  type="number"
                  name="equipmentAmount"
                  value={equipmentAmount}
                  onChange={(e) => setEquipmentAmount(e.target.value)}
                  id="equipmentAmount"
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
                  {editingEquipmentId ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">هل أنت متأكد من الحذف؟</h3>
            <p className="mb-4">سيتم حذف المعدات بشكل دائم.</p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteEquipment}
                className="bg-red-600 text-white hover:text-white px-4 py-2 rounded-lg"
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