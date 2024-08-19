import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page = 1, limit = 25, allData } = req.query;
    const offset = (page - 1) * parseInt(limit);

    let sqlQuery = `
      SELECT idt.date_at, 
             SUM(CASE 
                 WHEN idt.in_out LIKE 'IN%' THEN idt.qty 
                 WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty 
                 ELSE 0 
               END) AS qty, 
             idt.in_out, 
             ad.material_id AS id, 
             ad.material_description AS description, 
             'material' AS type 
      FROM inventories_db idt 
      INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id 
      INNER JOIN asset_db ad ON ds.product_id = ad.material_id
    `;

    let countQuery = `
      SELECT COUNT(*) AS total_count 
      FROM (
        SELECT ad.material_description 
        FROM inventories_db idt 
        INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id 
        INNER JOIN asset_db ad ON ds.product_id = ad.material_id
      ) AS combine
    `;

    let values = [];

    if (search) {
      sqlQuery += ` WHERE ad.material_description LIKE CONCAT('%', ?, '%')`;
      countQuery += ` WHERE combine.material_description LIKE CONCAT('%', ?, '%')`;
      values.push(search);
    }

    if (allData !== 'true') {
      sqlQuery += `
        GROUP BY ds.product_id 
        ORDER BY idt.date_at DESC 
        LIMIT ? OFFSET ?
      `;
      values.push(parseInt(limit), parseInt(offset));
    } else {
      sqlQuery += `
        GROUP BY ds.product_id 
        ORDER BY idt.date_at DESC
      `;
    }

    try {
      let totalItems = 0;
      let totalPages = 0;

      // Fetch asset_inventory
      const asset_inventory = await query({
        query: sqlQuery,
        values: values,
      });

      if (allData !== "true") {
        // Fetch total count for pagination
        const totalCountResult = await query({
          query: countQuery,
          values: search ? [search] : [],
        });
        totalItems = totalCountResult[0].total_count;
        totalPages = Math.ceil(totalItems / limit);
      } else {
        totalItems = asset_inventory.length;
        totalPages = 1;
      }

      res.status(200).json({ asset_inventory: asset_inventory, totalPages: totalPages });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Error when trying to fetch data from the database" });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
