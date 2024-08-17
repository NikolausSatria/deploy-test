import { query } from "@/libs/db";

export default async function handler(req, res) {
  try {
    const { method, query: reqQuery, body } = req;
    
    if (method === "GET") {
      const { search, page = 1, limit = 25 } = reqQuery;
      const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const values = [];
      let sqlQuery = `
        SELECT product_id, product_description, nect_type, volume, material, weight, color, bottles_per_coli, coli_per_box, uom 
        FROM product_db
      `;
      let countQuery = `
        SELECT COUNT(*) AS total_count FROM product_db
      `;

      if (search) {
        sqlQuery += ` WHERE product_description LIKE CONCAT('%', ?, '%') OR product_id LIKE CONCAT('%', ?, '%')`;
        countQuery += ` WHERE product_description LIKE CONCAT('%', ?, '%') OR product_id LIKE CONCAT('%', ?, '%')`;
        values.push(search, search);
      }

      sqlQuery += ` ORDER BY product_id LIMIT ? OFFSET ?`;
      values.push(parseInt(limit, 10), offset);

      try {
        const totalCountResult = await query({
          query: countQuery,
          values: search ? [search, search] : [],
        });

        const sku_product = await query({
          query: sqlQuery,
          values,
        });

        const totalItems = totalCountResult[0].total_count;
        const totalPages = Math.ceil(totalItems / parseInt(limit, 10));

        return res.status(200).json({ sku_product, totalPages });
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    if (method === "POST") {
      const {
        product_id,
        product_description,
        neck_type,
        volume,
        material,
        weight,
        color,
        bottles_per_coli,
        coli_per_box,
        uom,
      } = body;

      const processedValues = [
        product_id,
        product_description,
        neck_type || null,
        volume || null,
        material,
        weight || null,
        color,
        bottles_per_coli || null, 
        coli_per_box || null, 
        uom || null,
      ];

      try {
        await query({
          query: "INSERT INTO product_db (product_id, product_description, nect_type, volume, material, weight, color, bottles_per_coli, coli_per_box, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          // query: "INSERT INTO product_db (product_id, product_description, neck_type, volume, material, weight, color, bottles_per_coli, coli_per_box, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          values: processedValues,
        });

        return res.status(201).json({ message: "Product added successfully", data: body });
      } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
