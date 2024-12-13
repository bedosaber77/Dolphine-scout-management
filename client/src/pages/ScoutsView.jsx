import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const ScoutsView = () => {
  const apiRequest = useApi();
  const [scoutsData, setScoutsData] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchScoutsAndUsers = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch scouts
        const scoutsFetch = await apiRequest({
          url: 'http://localhost:3000/api/scouts/',
          method: 'GET',
        });
        const scouts = scoutsFetch.data;

        console.log('Fetched scouts:', scouts);

        // Fetch user details for each scout
        const enrichedScoutsData = await Promise.all(
          scouts.map(async (scout) => {
            try {
              const userFetch = await apiRequest({
                url: `http://localhost:3000/api/users/${scout.User_ID}`,
                method: 'GET',
              });
              const user = userFetch.data;

              console.log(`User data for Scout ID ${scout.User_ID}:`, user);

              return {
                ...scout,
                userName: `${user.Fname} ${user.Lname}`, // Enriching scout data with user info
                phone: user.Phonenum,
                email: user.Email,
              };
            } catch (err) {
              console.error(
                `Error fetching user data for Scout ID ${scout.User_ID}:`,
                err
              );
              return {
                ...scout,
                userName: 'غير متوفر',
                phone: 'غير متوفر',
                email: 'غير متوفر',
              }; // Fallback for error
            }
          })
        );

        setScoutsData(enrichedScoutsData);
      } catch (error) {
        console.error('Error fetching scouts and user data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchScoutsAndUsers();
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
                <td className="border px-4 py-2">{scout.userName}</td>
                <td className="border px-4 py-2">{scout.phone}</td>
                <td className="border px-4 py-2">{scout.email}</td>
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
