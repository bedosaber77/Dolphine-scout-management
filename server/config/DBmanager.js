const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  // host: 'localhost',
  // port: process.env.DBPORT || 5432,
  // user: process.env.DBUSER || 'postgres',
  // password: process.env.DBPASS || '1234',
  // database: process.env.DBNAME || 'Db project',
});

const connect = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.log('Error connecting to the database', error);
  }
};

const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.log('Error executing query', error);
    throw error;
  }
};
const testQuery = async (req, res) => {
  try {
    const result = await pool.query('SELECT version();');
    res.status(200).send(result.rows[0].version);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal Server Error');
  }
};
module.exports = {
  connect,
  query,
  testQuery,
};
