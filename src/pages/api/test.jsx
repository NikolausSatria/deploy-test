import mysql from "mysql2/promise";

// database connection
export default async function handler(req, res){
    const dbconnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
    });
    try {
        
        const query = "SELECT product_id as id FROM product_db UNION ALL SELECT material_id FROM material_db";
        const value =[]
        const [data] = await dbconnection.execute(query, value)
        dbconnection.end();

        res.status(200).json({results: data});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    // res.status(200).json({status: "berhasil konek"});
}