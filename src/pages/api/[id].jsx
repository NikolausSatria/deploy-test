import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    // Handle DELETE request
    if (!id) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

    try {
      await query({
        query: `  
          UPDATE database_sku     
          SET deleted_at = NOW()   
          WHERE inventory_db_id = ?;  
        `,
        values: [id],
      });

      // Kemudian hapus dari inventories_db
      await query({
        query: `  
          UPDATE inventories_db   
          SET deleted_at = NOW()
          WHERE id = ?;  
        `,
        values: [id],
      });

      return res.status(200).json({
        message: "Inventory and related employee records deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    // Handle GET request
    if (!id) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

    try {
      const inventory = await query({
        query: `
          SELECT 
    idt.id,
    idt.in_out,
    idt.date_at,
    idt.lot,
    idt.dn,
    idt.po,
    idt.mo,
    CASE 
        WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty 
        ELSE idt.qty 
    END AS qty,
    idt.created_at,
    idt.deleted_at,
    ds.id AS sku_id,
    combined.id AS product_id,
    combined.description,
    combined.uom,
    e.name AS employee_name
FROM inventories_db idt
INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id
INNER JOIN employees e ON ds.employees_id = e.id
LEFT JOIN (
    SELECT 
        product_id AS id,
        CONCAT(
            product_description, '; ',
            neck_type, '; ',
            volume, ' ml; ',
            material, '; ',
            weight, ' gr; ',
            color, '; ',
            bottles_per_coli, '; ',
            coli_per_box, '; ',
            uom
        ) AS description,
        uom 
    FROM product_db
    UNION ALL
    SELECT material_id AS id, material_description AS description, '' AS uom FROM material_db
    UNION ALL
    SELECT material_id AS id, material_description AS description, '' AS uom FROM asset_db
) AS combined ON ds.product_id = combined.id
WHERE combined.id = ?
AND idt.deleted_at IS NULL
ORDER BY idt.created_at DESC;
        `,
        values: [id],
      });

      return res.status(200).json({ inventory });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Handle any HTTP method that is not GET or DELETE
  return res.status(405).json({ message: "Method Not Allowed" });
}
