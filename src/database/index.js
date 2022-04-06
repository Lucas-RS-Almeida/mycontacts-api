const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect();

exports.query = async (query, values) => {
  const { rows } = await pool.query(query, values);
  return rows;
};
