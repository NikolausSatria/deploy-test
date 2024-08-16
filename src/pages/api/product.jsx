import { query } from "@/libs/db";
import { Offside } from "next/font/google";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { search, page = 1, limit = 25 } = req.query;
      const offset = (page - 1) * parseInt(limit);
      let sqlQuery = `
    SELECT product_id, product_description, neck_type, volume, material, weight, color, bottles_per_coli, coli_per_box, uom FROM product_db
  `;

      let countQuery = `
  select count(*) as total_count from product_db
  `;

      let values = [];

      if (search) {
        sqlQuery += ` WHERE product_description LIKE CONCAT('%', ?, '%') OR product_id LIKE CONCAT('%', ?, '%')`;
        countQuery += `  WHERE product_description LIKE CONCAT('%', ?, '%') OR product_id LIKE CONCAT('%', ?, '%')`;
        values.push(search, search);
      }

      sqlQuery += ` ORDER BY product_id LIMIT ? OFFSET ?`;
      values.push(parseInt(limit), parseInt(offset));

      try {
        const totalCountResult = await query({
          query: countQuery,
          values: search ? [search, search] : [],
        });
        const sku_product = await query({
          query: sqlQuery,
          values: values,
        });

        const totalItems = totalCountResult[0].total_count;
        const totalPages = Math.ceil(totalItems / limit);

        return res.status(200).json({ sku_product, totalPages: totalPages });
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    if (req.method === "POST") {
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
      } = req.body;

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

      const addData = await query({
        query:
          "INSERT INTO product_db (product_id,product_description,neck_type,volume,material,weight,color,bottles_per_coli,coli_per_box, uom) VALUES (?,?,?,?,?,?,?,?,?,?)",
        values: processedValues,
      });
      // const data = {
      //   product_id,
      //   product_description,
      //   neck_type,
      //   volume,
      //   material,
      //   weight,
      //   color,
      //   bottles_per_coli,
      //   coli_per_box,
      //   uom,
      // };
      return res
        .status(201)
        .json({ message: "Product added successfully", data: req.body });
    }
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// catatan: harus diberikan pengaman
