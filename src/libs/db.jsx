import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: 50,
});

export async function query({ query, values = [] }) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    throw Error(error.message);
  } finally {
    connection.release();
  }
}
