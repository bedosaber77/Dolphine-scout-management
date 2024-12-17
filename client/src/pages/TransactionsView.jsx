import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const Transactions = () => {
  const apiRequest = useApi();

  const [transactionsData, setTransactionsData] = useState([]);
  // const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsFetch = await apiRequest({
          url: 'http://localhost:3000/api/transactions/',
          method: 'GET',
        });
        // const atchievementFetch = await apiRequest({
        //   url: 'http://localhost:3000/api/achievements/',
        //   method: 'GET',
        // });
        console.log('trans', transactionsFetch);
        // console.log(atchievementFetch);
        setTransactionsData(transactionsFetch.data);
        // setAchievements(atchievementFetch.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [apiRequest]);


  const totalBalance = 1000; // Example total balance

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transaction, setTransaction] = useState({
    name: '',
    type: 'وارد', // default type
    amount: '',
    date: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission (e.g., adding the transaction to the data)
    transactionsData.push(transaction);
    setIsModalOpen(false); // Close the modal after submitting
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--secondary-color)' }}>
        الرصيد الإجمالي: {totalBalance} جنيه
      </h2>

      {/* Add Transaction Button */}
      <button
        onClick={() => setIsModalOpen(true)}
             className="mb-4 bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
                  style={{ background: 'var(--secondary-color)' }}
      >
        إضافة معاملة
      </button>

      {/* Transactions Table */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">اسم المتبرع/القائد</th>
            <th className="border px-4 py-2">صادر/وارد</th>
            <th className="border px-4 py-2">المبلغ</th>
            <th className="border px-4 py-2">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {transactionsData.map((transaction, index) => (
            <tr key={index} className='hover:bg-gray-100'>
              <td className="border px-4 py-2">{transaction.name}</td>
              <td className="border px-4 py-2">{transaction.type}</td>
              <td className="border px-4 py-2">{transaction.amount}</td>
              <td className="border px-4 py-2">{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-1/3">
            <h3 className="text-xl mb-4 font-bold">إضافة معاملة</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  اسم المتبرع/القائد
                </label>
                <input
                  type="text"
                  name="name"
                  value={transaction.name}
                  onChange={handleInputChange}
                  id="name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  نوع المعاملة
                </label>
                <select
                  name="type"
                  value={transaction.type}
                  onChange={handleInputChange}
                  id="type"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="وارد">وارد</option>
                  <option value="صادر">صادر</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  المبلغ
                </label>
                <input
                  type="number"
                  name="amount"
                  value={transaction.amount}
                  onChange={handleInputChange}
                  id="amount"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  التاريخ
                </label>
                <input
                  type="date"
                  name="date"
                  value={transaction.date}
                  onChange={handleInputChange}
                  id="date"
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
    </div>
  );
};

export default Transactions;
