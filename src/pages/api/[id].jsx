import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};
export default async function handler(req, res) {
  const {id} = req.query;
  try {
    if (req.method === "GET") {
      const inventory = await query({
        query:
          `SELECT idt.id, idt.date_at, idt.in_out, idt.lot, idt.dn, idt.po, idt.qty, idt.created_at, combined.id as product_id, combined.description, combined.uom, e.name FROM inventories_db idt 
          INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id
          INNER JOIN employees e ON ds.employees_id = e.id
          LEFT JOIN( SELECT product_id as id, product_description as description, uom from product_db 
            UNION ALL SELECT material_id as id, material_description as description, NULL as uom from material_db 
            UNION ALL SELECT material_id as id, material_description as description, NULL as uom from asset_db) AS combined ON ds.product_id = combined.id 
            WHERE combined.id = ? 
            ORDER BY idt.created_at 
            DESC`,
        values: [id],
      });
      res.status(200).json({ inventory: inventory });
    } 
    
    else {
      // Handle any other HTTP method
      res.status(405).end();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
