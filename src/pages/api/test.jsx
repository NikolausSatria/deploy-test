import mysql from 'mysql2/promise';

// database connection
export default async function handler(req, res) {
    let dbconnection;

    try {
        // Membuat koneksi ke database
        dbconnection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
        });

        // Melakukan query ke database
        const query = "SELECT id, name FROM test_table LIMIT 10";
        const [data] = await dbconnection.execute(query);

        // Mengirimkan response dengan data dari database
        res.status(200).json({ results: data });
    } catch (error) {
        // Menangani error dan mengirimkan response dengan status 500
        res.status(500).json({ error: error.message });
    } finally {
        // Menutup koneksi database jika sudah terbuka
        if (dbconnection) {
            await dbconnection.end();
        }
    }
}
