import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';
import axios from 'axios';
import useApi from '../hooks/useApi';

const Transactions = () => {
  const apiRequest = useApi();
  const { accessToken } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

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

  const fetchLeaders = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/scoutleaders',
        {
          headers: {
            accessToken: accessToken, // Ensure accessToken is defined
          },
        }
      );
      setLeaders(response.data); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSponsors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/sponsors', {
        headers: {
          accessToken: accessToken, // Ensure accessToken is defined
        },
      });
      setSponsors(response.data); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLeaders();
    fetchSponsors();
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

  const handleDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiRequest({
        url: `http://localhost:3000/api/transactions/${transactionToDelete.Transaction_ID}`,
        method: 'DELETE',
      });
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error(error);
    }
    fetchData();
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(transaction);
    console.log('transaction');
    await axios.post(
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
            <th className="border px-4 py-2">حذف</th>
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
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(transaction)}
                  className="bg-red-500 text-white hover:text-white px-4 py-2 rounded-lg"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">تأكيد الحذف</h3>
            <p>هل أنت متأكد من أنك تريد حذف هذه العملية؟</p>
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
                <select
                  name="leader_id"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="">اختر قائدًا</option>
                  {leaders.map((leader) => (
                    <option key={leader.User_ID} value={leader.User_ID}>
                      {leader.Fname} {leader.Lname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="sponsor_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  كود الممول
                </label>
                <select
                  name="sponsor_id"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="">اختر ممولًا</option>
                  {sponsors.map((sponsor) => (
                    <option key={sponsor.Sponsor_ID} value={sponsor.Sponsor_ID}>
                      {sponsor.Fname} {sponsor.Lname}
                    </option>
                  ))}
                </select>
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
