const createTable = (props) => {
      
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const rows = [];
    let cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<td key={`empty-${i}`}></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(
        <td key={day}>
          <div>{day}</div>
          {props[day] && <div className="event">{props[day]}</div>}
        </td>
      );

      if ((cells.length + firstDay) % 7 === 0) {
        rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
        cells = [];
      }
    }

    if (cells.length) {
      while (cells.length < 7) {
        cells.push(<td key={`empty-end-${cells.length}`}></td>);
      }
      rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
    }

    return rows;
};
  
export default createTable;
