import { getConnection } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search } = req.query;
    const connection = await getConnection();

    try {
      let query = "SELECT id, name FROM uom_db";
      let queryParams = [];

      if (search) {
        query += " WHERE name LIKE ?";
        queryParams.push(`%${search}%`);
      }

      const [rows] = await connection.query(query, queryParams);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching UOMs:", error);
      res.status(500).json({ message: "Error retrieving UOM data" });
    } finally {
      connection.release();
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
