import { useState } from 'react';

const AddLeaderAccount = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [troops, setTroops] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = () => {
    // Handle the logic for creating a new leader account here
    console.log('Leader Created:', { name, phone, id, troops, isAdmin });
    alert('تم إضافة القائد بنجاح');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: 'var(--secondary-color)' }}>إضافة حساب قائد جديد</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-right text-lg mb-2">الاسم</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-right text-lg mb-2">رقم الهاتف</label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="id" className="block text-right text-lg mb-2">الرقم التعريفي</label>
        <input
          id="id"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="troops" className="block text-right text-lg mb-2">الفرقة التي يقودها</label>
        <input
          id="troops"
          type="text"
          value={troops}
          onChange={(e) => setTroops(e.target.value)}
          className="block w-full mt-1 p-2 border-gray-300 border-2 outline-[#6fc0e5] rounded-xl hover:bg-gray-200"
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          id="isAdmin"
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isAdmin" className="text-right text-lg mr-2">هل هو مدير ؟</label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
        style={{ background: 'var(--secondary-color)' }}
      >
        إضافة
      </button>
    </div>
  );
};

export default AddLeaderAccount;
