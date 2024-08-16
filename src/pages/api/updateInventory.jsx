import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};
export default async function handler(req, res) {
  const { id } = req.query;
  const in_out = req.body.in_out;
  const date_at = req.body.date_at;
  const lot = req.body.lot;
  const dn = req.body.dn;
  const po = req.body.po;
  const mo = req.body.mo;
  const qty = req.body.qty;
  const employees_id = req.body.employees_id;

  try {
    if (req.method === "GET") {
      const inventory = await query({
        query: `SELECT idt.id, idt.date_at, idt.in_out, idt.lot, idt.dn, idt.po, idt.qty, idt.created_at, combined.id as product_id, combined.description, combined.uom, e.name FROM inventories_db idt 
          INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id
          INNER JOIN employees e ON ds.employees_id = e.id
          LEFT JOIN( SELECT product_id as id, product_description as description, uom from product_db 
            UNION ALL SELECT material_id as id, material_description as description, NULL as uom from material_db 
            UNION ALL SELECT material_id as id, material_description as description, NULL as uom from asset_db) AS combined ON ds.product_id = combined.id 
            WHERE idt.id = ? 
            ORDER BY idt.created_at 
            DESC`,
        values: [id],
      });
      res.status(200).json({ inventory: inventory });
    } else if (req.method === "PUT") {
      // Update query database

      const updateDatabaseSku = await query({
        query: `
        UPDATE database_sku SET employees_id = ? WHERE inventory_db_id = ?
        `,
        values: [employees_id, id],
      });

      const updateInventories = await query({
        query: `
          UPDATE inventories_db
          SET in_out = ?, date_at = ?, lot = ?, dn = ?, po = ?, mo = ?, qty = ?, created_at = NOW()
          WHERE id = ?
          `,
        values: [in_out, date_at, lot, dn, po, mo, qty, id],
      });


      return res.status(200).json({
        inventory: updateInventories,
        employee: updateDatabaseSku,
      });
    } else if (req.method === "DELETE") {
      // Delete Data

      await query({
        query: `
        DELETE FROM database_sku WHERE inventory_db_id = ?
        `,
        values: [id],
      });

      const deleteData = await query({
        query: `
          DELETE FROM inventories_db
          WHERE id = ?
          `,
        values: [id],
      });
      if (deleteData.affectedRows > 0) {
        res.status(200).json({ message: "Data deleted successfully" });
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    } else {
      // Handle any other HTTP method
      res.status(405).end();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
