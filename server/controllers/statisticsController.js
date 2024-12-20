const db = require('../config/DBmanager');

exports.getRankStatistics = async (req, res) => {
  try {
    const query = `SELECT "rank", 
        COUNT("rank")::float / COUNT(*) OVER () AS proportion
        FROM "Scout"
        GROUP BY "rank";`;
    const params = [];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'no scouts found' });
    }
    return res.json(result.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTransactionsStatistics = async (req, res) => {
  try {
    const query = `SELECT EXTRACT(MONTH FROM "Tdate") AS month,"TransactionType", SUM("Amount")
    FROM "Transaction"
    where "Status" = 'Completed'
    GROUP BY EXTRACT(MONTH FROM "Tdate"),"TransactionType";;`;
    const params = [];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'no transactions found' });
    }
    return res.json(result.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getEventsAttendanceStatistics = async (req, res) => {
  try {
    const query = `select "Ename",Count("Ename") 
        from "EventAttendance" ea
        join 
            "Event" e
            on e."Event_ID" = ea."Event_ID"
        group by e."Ename";`;
    const params = [];
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'no events found' });
    }
    return res.json(result.rows);
  } catch (error) {
    console.log('Error executing query', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
