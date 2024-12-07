
const SponsorHistory = () => {
  const sponsorsData = [
    { name: 'مؤسسة الخير', totalAmount: 1500 },
    { name: 'شركة النجاح', totalAmount: 3000 },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4" style={{ color: 'var(--secondary-color)' }}>تاريخ التبرعات</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">اسم المتبرع</th>
            <th className="border px-4 py-2">إجمالي المبلغ</th>
          </tr>
        </thead>
        <tbody>
          {sponsorsData.map((sponsor, index) => (
            <tr key={index} className='hover:bg-gray-100'>
              <td className="border px-4 py-2">{sponsor.name}</td>
              <td className="border px-4 py-2">{sponsor.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SponsorHistory;
