import { query } from "@/libs/db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { search, page = 1, limit = 25 } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        return res.status(400).json({ error: "Invalid page or limit" });
      }

      const offset = (pageNum - 1) * limitNum;
      const values = [];
      let sqlQuery = `
        SELECT material_id, asset_number, material_type, material_description 
        FROM asset_db
      `;

      let countQuery = `
        SELECT COUNT(*) AS total_count 
        FROM asset_db
      `;

      if (search) {
        sqlQuery += ` WHERE material_description LIKE CONCAT('%', ?, '%') 
                      OR material_id LIKE CONCAT('%', ?, '%')`;
        countQuery += ` WHERE material_description LIKE CONCAT('%', ?, '%') 
                        OR material_id LIKE CONCAT('%', ?, '%')`;
        values.push(search, search);
      }

      sqlQuery += ` ORDER BY material_id LIMIT ${limitNum} OFFSET ${offset}`;

      try {
        const totalCountResult = await query({
          query: countQuery,
          values: search ? values : [],
        });

        const assets = await query({
          query: sqlQuery,
          values,
        });

        const totalItems = totalCountResult[0].total_count;
        const totalPages = Math.ceil(totalItems / limitNum);

        return res.status(200).json({ assets, totalPages });
      } catch (error) {
        console.error("Error fetching assets:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (req.method === "POST") {
      const { material_id, asset_number, material_type, material_description } = req.body;

      if (!material_id || !asset_number || !material_type || !material_description) {
        return res.status(400).json({ error: "All fields are required" });
      }

      try {
        await query({
          query: "INSERT INTO asset_db (material_id, asset_number, material_type, material_description) VALUES (?, ?, ?, ?)",
          values: [material_id, asset_number, material_type, material_description],
        });

        return res.status(201).json({
          message: "Asset created successfully",
          data: { material_id, asset_number, material_type, material_description },
        });
      } catch (error) {
        console.error("Error inserting asset:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
