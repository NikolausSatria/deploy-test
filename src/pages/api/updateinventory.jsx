import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;
  const { in_out, date_at, lot, dn, po, mo, qty, employees_id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  try {
    if (req.method === "GET") {
      const inventory = await query({
        query: `
          SELECT idt.id, idt.date_at, idt.in_out, idt.lot, idt.dn, idt.po, idt.qty, idt.created_at, combined.id AS product_id, combined.description, combined.uom, e.name
          FROM inventories_db idt 
          INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id
          INNER JOIN employees e ON ds.employees_id = e.id
          LEFT JOIN (
            SELECT product_id AS id, product_description AS description, uom FROM product_db 
            UNION ALL 
            SELECT material_id AS id, material_description AS description, NULL AS uom FROM material_db 
            UNION ALL 
            SELECT material_id AS id, material_description AS description, NULL AS uom FROM asset_db
          ) AS combined ON ds.product_id = combined.id 
          WHERE idt.id = ? 
          ORDER BY idt.created_at DESC
        `,
        values: [id],
      });
      res.status(200).json({ inventory });
    } else if (req.method === "PUT") {
      if (!in_out || !date_at || !qty) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      await query({
        query: `
          UPDATE database_sku SET employees_id = ? WHERE inventory_db_id = ?
        `,
        values: [employees_id, id],
      });

      await query({
        query: `
          UPDATE inventories_db
          SET in_out = ?, date_at = ?, lot = ?, dn = ?, po = ?, mo = ?, qty = ?, created_at = NOW()
          WHERE id = ?
        `,
        values: [in_out, date_at, lot, dn, po, mo, qty, id],
      });

      res.status(200).json({ message: "Inventory updated successfully" });
    } else if (req.method === "DELETE") {
      await query({
        query: `
          DELETE FROM database_sku WHERE inventory_db_id = ?
        `,
        values: [id],
      });

      const result = await query({
        query: `
          DELETE FROM inventories_db WHERE id = ?
        `,
        values: [id],
      });

      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Data deleted successfully" });
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
