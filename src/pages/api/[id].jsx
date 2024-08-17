import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    // Handle any HTTP method that is not GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!id) {
    // Validate if ID is provided
    return res.status(400).json({ message: 'ID parameter is required' });
  }

  try {
    const inventory = await query({
      query: `
        SELECT 
          idt.id, idt.date_at, idt.in_out, idt.lot, idt.dn, idt.po, idt.qty, idt.created_at, 
          combined.id AS product_id, combined.description, combined.uom, e.name 
        FROM inventories_db idt 
        INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id
        INNER JOIN employees e ON ds.employees_id = e.id
        LEFT JOIN (
          SELECT 
            product_id AS id, product_description AS description, uom 
          FROM product_db 
          UNION ALL 
          SELECT 
            material_id AS id, material_description AS description, NULL AS uom 
          FROM material_db 
          UNION ALL 
          SELECT 
            material_id AS id, material_description AS description, NULL AS uom 
          FROM asset_db
        ) AS combined ON ds.product_id = combined.id 
        WHERE combined.id = ? 
        ORDER BY idt.created_at DESC
      `,
      values: [id],
    });

    return res.status(200).json({ inventory });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
