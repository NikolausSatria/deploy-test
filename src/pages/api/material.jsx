import { query } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    let sqlQuery = `
      SELECT material_id, material_type, material_description, minimum_stock, rop, maximum_stock 
      FROM material_db
    `;

    let countQuery = `
      SELECT COUNT(*) as total_count 
      FROM material_db
    `;
    let values = [];

    if (search) {
      sqlQuery += ` 
        WHERE material_description LIKE CONCAT('%', ?, '%') 
        OR material_id LIKE CONCAT('%', ?, '%')
      `;
      countQuery += ` 
        WHERE material_description LIKE CONCAT('%', ?, '%') 
        OR material_id LIKE CONCAT('%', ?, '%')
      `;
      values.push(search, search);
    }

    sqlQuery += ` 
      ORDER BY material_id 
      LIMIT ? OFFSET ?
    `;
    values.push(parseInt(limit), parseInt(offset));

    try {
      const totalCountResult = await query({
        query: countQuery,
        values: search ? [search, search] : [],
      });
      
      const sku_material = await query({
        query: sqlQuery,
        values: values,
      });

      const totalItems = totalCountResult[0].total_count;
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({ materials: sku_material, totalPages: totalPages });

    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const {
      material_id,
      material_type,
      material_description,
      minimum_stock,
      rop,
      maximum_stock
    } = req.body;

    if (!material_id || !material_type || !material_description || !minimum_stock || !rop || !maximum_stock) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const addData = await query({
        query: `
          INSERT INTO material_db (material_id, material_type, material_description, minimum_stock, rop, maximum_stock) 
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        values: [
          material_id,
          material_type,
          material_description,
          minimum_stock,
          rop,
          maximum_stock,
        ],
      });

      res.status(200).json({
        response: {
          message: "Material added successfully",
          data: {
            material_id,
            material_type,
            material_description,
            minimum_stock,
            rop,
            maximum_stock,
          },
        },
      });
    } catch (error) {
      console.error('Error adding material:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
