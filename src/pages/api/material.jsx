import { query } from "@/libs/db";

export default async function handler(req, res) {
  try {
    let message;
    if (req.method === "GET") {
      const { search, page = 1, limit = 25 } = req.query;
      const offset = (page - 1) * parseInt(limit);

      let sqlQuery = `
      SELECT material_id, material_type, material_description, minimum_stock,rop,maximum_stock FROM material_db
      `;

      let countQuery = `
      select count(*) as total_count from material_db
      `;
      let values = [];

      if (search) {
        sqlQuery += ` WHERE material_description LIKE CONCAT('%', ?, '%') OR material_id LIKE CONCAT('%', ?, '%')`;
        countQuery += `  WHERE material_description LIKE CONCAT('%', ?, '%') OR material_id LIKE CONCAT('%', ?, '%')`;
        values.push(search, search);
      }

      sqlQuery += ` ORDER BY material_id LIMIT ? OFFSET ?`;
      values.push(parseInt(limit), parseInt(offset));

      try {
        const totalCountResult = await query({
          query: countQuery,
          values: search ? [search, search] : []
        });
        const sku_material = await query({
          query: sqlQuery,
          values: values
        });

        console.log(sku_material)

        const totalItems = totalCountResult[0].total_count;
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({ materials: sku_material, totalPages: totalPages });

      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }

    }

    if (req.method === "POST") {
      const material_id = req.body.material_id;
      const material_type = req.body.material_type;
      const material_description = req.body.material_description;
      const minimum_stock = req.body.minimum_stock;
      const rop = req.body.rop;
      const maximum_stock = req.body.maximum_stock;

      const addData = await query({
        query:
          "INSERT INTO material_db (material_id,material_type,material_description,minimum_stock,rop,maximum_stock) VALUES (?,?,?,?,?,?)",
        values: [
          material_id,
          material_type,
          material_description,
          minimum_stock,
          rop,
          maximum_stock,
        ],
      });
      let data = {
        material_id: material_id,
        material_type: material_type,
        material_description: material_description,
        minimum_stock: minimum_stock,
        rop: rop,
        maximum_stock: maximum_stock,
      };
      res.status(200).json({
        response: {
          message: message,
          data: data,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// catatan: harus diberikan pengaman
