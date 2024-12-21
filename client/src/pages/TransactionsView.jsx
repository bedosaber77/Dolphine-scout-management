import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useEffect } from 'react';
import axios from 'axios';
import useApi from '../hooks/useApi';

const Transactions = () => {
  const apiRequest = useApi();
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaders = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/sponsors', {
        headers: {
          accessToken: accessToken, // Ensure accessToken is defined
        },
      });
      setSponsors(response.data); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
    <div className="p-4 rounded-2xl">
      <div className="flex justify-between">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ color: 'var(--secondary-color)' }}
        >
          قائمة المعاملات
        </h2>
        <h3
          className="mb-4 pr-5 pl-5 text-3x font-bold shadow-md rounded-2xl"
          style={{ color: 'var(--secondary-color)' }}
        >
          الرصيد الإجمالي: {totalBalance.toLocaleString('ar-EG')} جنيه
        </h3>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-secondary-color text-white hover:text-white px-4 py-2 rounded-lg"
          style={{ background: 'var(--secondary-color)' }}
        >
          إضافة معاملة
        </button>
      </div>
      {loading ? (
        <p className="mt-4 text-center text-gray-500">جاري تحميل البيانات...</p>
      ) : transaction.length === 0 ? (
        <p className="mt-4 text-center text-gray-500">لا يوجد معاملات للعرض</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 mt-4">
            <thead
              className="sticky top-0 z-10"
              style={{ color: 'var(--secondary-color)' }}
            >
              <tr>
                <th className="border px-4 py-2 text-center">وصف المعاملة</th>
                <th className="border px-4 py-2 text-center">صادر/وارد</th>
                <th className="border px-4 py-2 text-center">المبلغ</th>
                <th className="border px-4 py-2 text-center">
                  اسم صاحب العملية
                </th>
                <th className="border px-4 py-2 text-center">طريفة الدفع</th>
                <th className="border px-4 py-2 text-center">التاريخ</th>
                <th className="border px-4 py-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">
                    {transaction.Purpose}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {transaction.TransactionType}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {transaction.Amount.toLocaleString('ar-EG')}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {transaction.ScoutLeader_ID
                      ? leaders.find(
                          (leader) =>
                            leader.User_ID === transaction.ScoutLeader_ID
                        )?.Fname +
                        ' ' +
                        leaders.find(
                          (leader) =>
                            leader.User_ID === transaction.ScoutLeader_ID
                        )?.Lname
                      : transaction.Sponsor_ID
                      ? sponsors.find(
                          (sponsor) =>
                            sponsor.Sponsor_ID === transaction.Sponsor_ID
                        )?.Fname +
                        ' ' +
                        sponsors.find(
                          (sponsor) =>
                            sponsor.Sponsor_ID === transaction.Sponsor_ID
                        )?.Lname
                      : 'N/A'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {transaction.PaymentMethod}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    {new Date(transaction.Tdate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(transaction)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
            <h3
              className="text-2xl font-semibold mb-4 text-center"
              style={{ color: 'var(--secondary-color)' }}
            >
              إضافة معاملة
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="purpose"
                >
                  الوصف
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={transaction.purpose}
                  onChange={handleInputChange}
                  id="purpose"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="method"
                >
                  طريقة الدفع
                </label>
                <select
                  name="method"
                  value={transaction.method}
                  onChange={handleInputChange}
                  id="method"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Visa">Visa</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="type"
                >
                  نوع المعاملة
                </label>
                <select
                  name="type"
                  value={transaction.type}
                  onChange={handleInputChange}
                  id="type"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="Deposit">ايداع</option>
                  <option value="Withdraw">سحب</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="amount"
                >
                  المبلغ
                </label>
                <input
                  type="number"
                  name="amount"
                  value={transaction.amount}
                  onChange={handleInputChange}
                  id="amount"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-secondary-color focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="leader_id"
                >
                  اسم القائد
                </label>
                <select
                  name="leader_id"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="">اختر قائدًا</option>
                  {leaders.map((leader) => (
                    <option key={leader.User_ID} value={leader.User_ID}>
                      {leader.Fname} {leader.Lname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="sponsor_id"
                >
                  اسم الممول
                </label>
                <select
                  name="sponsor_id"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring focus:ring-secondary-color focus:outline-none"
                >
                  <option value="">اختر ممولًا</option>
                  {sponsors.map((sponsor) => (
                    <option key={sponsor.Sponsor_ID} value={sponsor.Sponsor_ID}>
                      {sponsor.Fname} {sponsor.Lname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-xl font-medium mb-1"
                  htmlFor="date"
                >
                  التاريخ
                </label>
                <input
                  type="date"
                  name="date"
                  value={transaction.date}
                  onChange={handleInputChange}
                  id="date"
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
