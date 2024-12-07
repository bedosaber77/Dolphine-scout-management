import { useState } from 'react';

const WithdrawRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, leaderName: 'أحمد', amount: 500, date: '2024-12-06' },
    { id: 2, leaderName: 'محمود', amount: 300, date: '2024-12-05' },
    { id: 3, leaderName: 'سارة', amount: 200, date: '2024-12-04' },
  ]);

  const handleAccept = (id) => {
    console.log(`Request ${id} accepted`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  const handleReject = (id) => {
    console.log(`Request ${id} rejected`);
    setRequests(requests.filter((request) => request.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--secondary-color)' }}>
        طلبات السحب الحالية
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-right">اسم القائد</th>
              <th className="border px-4 py-2 text-right">المبلغ</th>
              <th className="border px-4 py-2 text-right">التاريخ</th>
              <th className="border px-4 py-2 text-right">العمليات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{request.leaderName}</td>
                <td className="border px-4 py-2">{request.amount}</td>
                <td className="border px-4 py-2">{request.date}</td>
                <td className="border px-4 py-2 flex gap-x-4">
                  <button
                    className="bg-green-600 hover:bg-green-600 hover:text-white text-white py-2 px-4 rounded-lg"
                    onClick={() => handleAccept(request.id)}
                  >
                    قبول
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 hover:text-white text-white py-2 px-4 rounded-lg"
                    onClick={() => handleReject(request.id)}
                  >
                    رفض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawRequests;
