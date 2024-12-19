import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
  const { accessToken } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/transactions',
        {
          headers: {
            accessToken: accessToken, // Ensure accessToken is defined
          },
        }
      );
      setTransactions(response.data); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let Balance = transactions.reduce(
      (acc, transaction) =>
        transaction.TransactionType === 'Deposit'
          ? acc + transaction.Amount
          : acc - transaction.Amount,
      0
    );
    setTotalBalance(Balance);
  }, [transactions]);

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transaction, setTransaction] = useState({
    purpose: '',
    method: 'Cash', // default type
    type: 'Deposit', // default type
    amount: '',
    date: '',
    sponsor_id: null,
    leader_id: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input event
    setTransaction((prev) => ({
      ...prev,
      [name]: value, // Dynamically set the state based on input name
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(transaction);
    console.log('transaction');
    axios.post(
      'http://localhost:3000/api/transactions',
      JSON.stringify(transaction),
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: accessToken,
        },
      }
    );
    // Add the new transaction to the transactions array
    fetchData();
    setTotalBalance(totalBalance + transaction.amount);
    setIsModalOpen(false); // Close the modal after submitting
  };

  return (
    <div className="p-4">
      <h2
        className="mb-4 text-lg font-bold"
        style={{ color: 'var(--secondary-color)' }}
      >
        الرصيد الإجمالي: {totalBalance} جنيه
      </h2>

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
            <th className="border px-4 py-2">وصف المعاملة</th>
            <th className="border px-4 py-2">صادر/وارد</th>
            <th className="border px-4 py-2">المبلغ</th>
            <th className="border px-4 py-2">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{transaction.Purpose}</td>
              <td className="border px-4 py-2">
                {transaction.TransactionType}
              </td>
              <td className="border px-4 py-2">{transaction.Amount}</td>
              <td className="border px-4 py-2">
                {new Date(transaction.Tdate).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </td>
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
                <label
                  htmlFor="purpose"
                  className="block text-sm font-medium text-gray-700"
                >
                  الوصف
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={transaction.purpose}
                  onChange={handleInputChange}
                  id="purpose"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="method"
                  className="block text-sm font-medium text-gray-700"
                >
                  طريقة الدفع
                </label>
                <select
                  name="method"
                  value={transaction.method}
                  onChange={handleInputChange}
                  id="method"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="Cash">Cash</option>
                  <option value="Visa">Visa</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  نوع المعاملة
                </label>
                <select
                  name="type"
                  value={transaction.type}
                  onChange={handleInputChange}
                  id="type"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="Deposit">ايداع</option>
                  <option value="Withdraw">سحب</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="leader_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  كود القائد
                </label>
                <input
                  type="number"
                  name="leader_id"
                  value={transaction.leader_id}
                  onChange={handleInputChange}
                  id="leader_id"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="sponsor_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  كود الممول
                </label>
                <input
                  type="number"
                  name="sponsor_id"
                  value={transaction.sponsor_id}
                  onChange={handleInputChange}
                  id="sponsor_id"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
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
