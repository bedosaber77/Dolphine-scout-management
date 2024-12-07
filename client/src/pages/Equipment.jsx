import { useState } from 'react';

const Equipment = () => {
  // State to hold the equipment data
  const [equipmentData, setEquipmentData] = useState([
    { name: 'كاميرا', location: 'موقع 1', amount: 10 },
    { name: 'حاسوب', location: 'موقع 2', amount: 5 },
    { name: 'طابعة', location: 'موقع 3', amount: 3 },
  ]);

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentLocation, setEquipmentLocation] = useState('');
  const [equipmentAmount, setEquipmentAmount] = useState('');

  // Add a new equipment
  const handleSubmitEquipment = (e) => {
    e.preventDefault();
    setEquipmentData([
      ...equipmentData,
      { name: equipmentName, location: equipmentLocation, amount: parseInt(equipmentAmount) },
    ]);
    setIsModalOpen(false);
    setEquipmentName('');
    setEquipmentLocation('');
    setEquipmentAmount('');
  };

  // Edit equipment details
  const handleEditEquipment = (index) => {
    const equipment = equipmentData[index];
    setEquipmentName(equipment.name);
    setEquipmentLocation(equipment.location);
    setEquipmentAmount(equipment.amount.toString());
    setIsModalOpen(true);
    // Optionally, store the index to update the specific equipment
  };

  // Handle updating the equipment after editing
  const handleUpdateEquipment = (e) => {
    e.preventDefault();
    const updatedData = equipmentData.map((equipment, index) =>
      index === equipmentIndex ? { name: equipmentName, location: equipmentLocation, amount: parseInt(equipmentAmount) } : equipment
    );
    setEquipmentData(updatedData);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--secondary-color)' }}>
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
          </tr>
        </thead>
        <tbody>
          {equipmentData.map((equipment, index) => (
            <tr key={index} className='hover:bg-gray-100'>
              <td className="border px-4 py-2">{equipment.name}</td>
              <td className="border px-4 py-2">{equipment.location}</td>
              <td className="border px-4 py-2">{equipment.amount}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditEquipment(index)}
                  className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
                >
                  تعديل
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
            <h3 className="text-xl mb-4 font-bold">{equipmentName ? 'تعديل المعدات' : 'إضافة معدات'}</h3>
            <form onSubmit={equipmentName ? handleUpdateEquipment : handleSubmitEquipment}>
              <div className="mb-4">
                <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="equipmentLocation" className="block text-sm font-medium text-gray-700">
                  الموقع
                </label>
                <input
                  type="text"
                  name="equipmentLocation"
                  value={equipmentLocation}
                  onChange={(e) => setEquipmentLocation(e.target.value)}
                  id="equipmentLocation"
                   className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="equipmentAmount" className="block text-sm font-medium text-gray-700">
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
                  {equipmentName ? 'تعديل' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
