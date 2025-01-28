import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { delivery_note_no, so_no, date_at, customer_id, in_out } = req.query;

  if (!delivery_note_no || !so_no || !date_at || !customer_id || !in_out) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    if (req.method === "GET") {
      const deliveryData = await query({
        query: `
          SELECT 
            dn.delivery_note_no, 
            dn.so_no, 
            dn.license_plate_no, 
            dn.delivery_date, 
            dn.delivery_note, 
            dn.product_id, 
            combined.description, 
            dn.uom, 
            dn.attn_name,
            dn.customer_id, 
            dn.employee_id, 
            e.name,
            cd.company_name, 
            cd.phone_number, 
            cd.address,
            idt.date_at, 
            idt.po, 
            idt.qty, 
            idt.in_out, 
            idt.created_at 
          FROM delivery_note_db dn
          INNER JOIN customers_db cd ON dn.customer_id = cd.customer_id
          INNER JOIN database_sku ds ON dn.product_id = ds.product_id
          INNER JOIN inventories_db idt ON ds.inventory_db_id = idt.id
          INNER JOIN employees e ON dn.employee_id = e.id
          LEFT JOIN (
            SELECT product_id AS id, product_description AS description, 'product' AS type FROM product_db 
            UNION ALL 
            SELECT material_id AS id, material_description AS description, 'material' AS type FROM material_db 
            UNION ALL 
            SELECT material_id AS id, material_description AS description, 'asset' AS type FROM asset_db
          ) AS combined ON dn.product_id = combined.id
          WHERE dn.delivery_note_no = ? 
            AND dn.so_no = ?
            AND idt.date_at = ?
            AND dn.customer_id = ?
            AND idt.in_out = ?
        `,
        values: [delivery_note_no, so_no, date_at, customer_id, in_out],
      });
      res.status(200).json({ deliveryData });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
