const db = require('../config/DBmanager');

exports.getRankStatistics = async (req, res) => {
  try {
    const query = `SELECT "rank" AS name, 
        COUNT("rank")::float  AS value
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
    const query = `SELECT 
    m.month,
    COALESCE(d.total_deposit, 0) AS "Deposit",
    COALESCE(w.total_withdraw, 0) AS "Withdraw"
FROM 
    (SELECT DISTINCT EXTRACT(MONTH FROM "Tdate") AS month FROM "Transaction") m
LEFT JOIN 
    (
        SELECT EXTRACT(MONTH FROM "Tdate") AS month, SUM("Amount") AS total_deposit
        FROM "Transaction"
        WHERE "TransactionType" = 'Deposit'
        GROUP BY EXTRACT(MONTH FROM "Tdate")
    ) d ON m.month = d.month
LEFT JOIN 
    (
        SELECT EXTRACT(MONTH FROM "Tdate") AS month, SUM("Amount") AS total_withdraw
        FROM "Transaction"
        WHERE "TransactionType" = 'Withdraw'
        GROUP BY EXTRACT(MONTH FROM "Tdate")
    ) w ON m.month = w.month
ORDER BY 
    m.month;
`;
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
