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
        SELECT material_id, material_type, material_description, minimum_stock, rop, maximum_stock 
        FROM material_db
      `;

      let countQuery = `
        SELECT COUNT(*) AS total_count 
        FROM material_db
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
          values: search ? [search, search] : [],
        });

        const materials = await query({
          query: sqlQuery,
          values,
        });

        const totalItems = totalCountResult[0].total_count;
        const totalPages = Math.ceil(totalItems / limitNum);

        return res.status(200).json({ materials, totalPages });
      } catch (error) {
        console.error("Error fetching materials:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (req.method === "POST") {
      const {
        material_id,
        material_type,
        material_description,
        minimum_stock,
        rop,
        maximum_stock,
      } = req.body;

      // Validate input
      if (!material_id || !material_type || !material_description || 
          isNaN(minimum_stock) || isNaN(rop) || isNaN(maximum_stock)) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
      }

      try {
        await query({
          query: `
            INSERT INTO material_db (material_id, material_type, material_description, minimum_stock, rop, maximum_stock) 
            VALUES (?, ?, ?, ?, ?, ?)
          `,
          values: [
            material_id,
            material_type,
            material_description,
            parseFloat(minimum_stock),
            parseFloat(rop),
            parseFloat(maximum_stock),
          ],
        });

        return res.status(201).json({
          message: "Material added successfully",
          data: {
            material_id,
            material_type,
            material_description,
            minimum_stock,
            rop,
            maximum_stock,
          },
        });
      } catch (error) {
        console.error("Error adding material:", error);
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
