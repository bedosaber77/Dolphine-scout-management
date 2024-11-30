const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connect = async () => {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
};

const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.log("Error executing query", error);
  }
};
const testQuery = async () => {
  const result = await query("SELECT NOW()");
  console.log(result.rows[0]);
};
module.exports = {
  connect,
  query,
  testQuery,
};
