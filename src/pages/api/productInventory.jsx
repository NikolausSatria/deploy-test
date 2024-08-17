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
             SUM(CASE WHEN idt.in_out LIKE 'IN%' THEN idt.qty WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty ELSE 0 END) AS qty, 
             idt.in_out, 
             pd.product_id AS id, 
             pd.product_description AS description, 
             'product' AS type 
      FROM inventories_db idt 
      INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id 
      INNER JOIN product_db pd ON ds.product_id = pd.product_id 
    `;

    let countQuery = `
      SELECT COUNT(*) AS total_count 
      FROM (
        SELECT idt.date_at, 
               SUM(CASE WHEN idt.in_out LIKE 'IN%' THEN idt.qty WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty ELSE 0 END) AS qty, 
               idt.in_out, 
               pd.product_id AS id, 
               pd.product_description AS description, 
               'product' AS type 
        FROM inventories_db idt 
        INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id 
        INNER JOIN product_db pd ON ds.product_id = pd.product_id 
        ${search ? `WHERE pd.product_description LIKE CONCAT('%', ?, '%')` : ''}
        GROUP BY ds.product_id
      ) AS combine
    `;

    let values = [];
    if (search) {
      values.push(search);
    }

    if (allData !== "true") {
      sqlQuery += `
        GROUP BY ds.product_id 
        ORDER BY idt.created_at DESC 
        LIMIT ? OFFSET ?
      `;
      values.push(parseInt(limit), parseInt(offset));
    } else {
      sqlQuery += `
        GROUP BY ds.product_id 
        ORDER BY idt.created_at DESC
      `;
    }

    try {
      const product_inventory = await query({
        query: sqlQuery,
        values: values,
      });

      let totalItems = 0;
      let totalPages = 0;

      if (allData !== "true") {
        const totalCountResult = await query({
          query: countQuery,
          values: search ? [search] : [],
        });
        totalItems = totalCountResult[0].total_count;
        totalPages = Math.ceil(totalItems / limit);
      } else {
        totalItems = product_inventory.length;
        totalPages = 1;
      }

      res.status(200).json({ product_inventory, totalPages });
    } catch (error) {
      console.error("Error fetching product inventory:", error);
      res.status(500).json({ message: "Error when trying to fetch data from the database" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
