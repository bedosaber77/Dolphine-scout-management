const createCalendar = (attendance) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const rows = [];
  let cells = [];
  let currentEvent = 0;

  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<td key={`empty-${i}`} className="bg-gray-100"></td>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;

    let circleClass = ''; // Default for today
    let hoverDetails = '';
    let navigateUrl = '#';
    let eventFound = false;
    //fdf

    if (
      currentEvent < attendance.length &&
      attendance[currentEvent].date === formattedDate
    ) {
      eventFound = true;
      hoverDetails = attendance[currentEvent].hasAttended
        ? 'Attended Event'
        : 'Missed Event';
      circleClass = attendance[currentEvent].hasAttended
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white';
      navigateUrl = `/events/${attendance[currentEvent].id}`;
      currentEvent++;
    }

    const isToday =
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;

    cells.push(
      <td key={day} className="h-16 w-16 text-center relative">
        <div
          className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-110
${circleClass}`}
          style={{ backgroundColor: isToday ? 'var(--secondary-color)' : '' }}
          title={hoverDetails}
          onClick={() => {
            if (eventFound) {
              window.location.href = navigateUrl;
            }
          }}
        >
          {day}
        </div>
        {eventFound && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition">
            {hoverDetails}
          </div>
        )}
      </td>
    );

    if ((cells.length + firstDayOfMonth) % 7 === 0) {
      rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
      cells = [];
    }
  }

  if (cells.length) {
    while (cells.length < 7) {
      cells.push(
        <td key={`empty-end-${cells.length}`} className="bg-gray-100"></td>
      );
    }
    rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
  }

  return rows;
};

// eslint-disable-next-line react/prop-types
const Calendar = ({ attendance }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="w-1/7 text-gray-500">الاحد</th>
            <th className="w-1/7 text-gray-500">الاثنين</th>
            <th className="w-1/7 text-gray-500">الثلاثاء</th>
            <th className="w-1/7 text-gray-500">الاربعاء</th>
            <th className="w-1/7 text-gray-500">الخميس</th>
            <th className="w-1/7 text-gray-500">الجمعة</th>
            <th className="w-1/7 text-gray-500">السبت</th>
          </tr>
        </thead>
        <tbody>{createCalendar(attendance)}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
