import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const ScoutsView = () => {
  const apiRequest = useApi();
  const [scoutsData, setScoutsData] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchScouts = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch scouts from the backend (already enriched with user data)
        const scoutsFetch = await apiRequest({
          url: 'http://localhost:3000/api/scouts/',
          method: 'GET',
        });
        const scouts = scoutsFetch.data;

        console.log('Fetched scouts:', scouts);

        setScoutsData(scouts);
      } catch (error) {
        console.error('Error fetching scouts data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchScouts();
  }, [apiRequest]);

  return (
    <div className="p-4">
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: 'var(--secondary-color)' }}
      >
        قائمة الكشافة
      </h2>

      {loading ? (
        <p>Loading scouts...</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">اسم الكشاف</th>
              <th className="border px-4 py-2">رقم الهاتف</th>
              <th className="border px-4 py-2">البريد الإلكتروني</th>
              <th className="border px-4 py-2">الرقم التعريفي</th>
            </tr>
          </thead>
          <tbody>
            {scoutsData.map((scout) => (
              <tr key={scout.User_ID} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  {scout.Fname && scout.Lname
                    ? `${scout.Lname} ${scout.Fname}`
                    : 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {scout.Phonenum || 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">
                  {scout.email || 'غير متوفر'}
                </td>
                <td className="border px-4 py-2">{scout.User_ID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScoutsView;
