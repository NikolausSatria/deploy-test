import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { delivery_note_no } = req.query;

  if (!delivery_note_no) {
    return res.status(400).json({ error: "Missing required query parameter: delivery_note_no" });
  }

  try {
    if (req.method === "GET") {
      const deliveryData = await query({
        query: `
          SELECT 
            dn.delivery_note_no, 
            dn.so_no,
            dn.po,
            dn.license_plate_no, 
            dn.delivery_date, 
            dn.delivery_note, 
            dnd.product_id, 
            p.product_description AS product_name,
            dnd.uom_id, 
            u.name AS uom, 
            dnd.qty, 
            dn.attn_name,
            dn.customer_id, 
            dn.employee_id, 
            e.name AS employee_name,
            c.company_name, 
            c.phone_number, 
            c.address
          FROM delivery_note_db dn
          INNER JOIN customers_db c ON dn.customer_id = c.customer_id
          INNER JOIN employees e ON dn.employee_id = e.id
          INNER JOIN delivery_note_details dnd ON dn.id = dnd.delivery_note_id
          INNER JOIN product_db p ON dnd.product_id = p.product_id
          INNER JOIN uom_db u ON dnd.uom_id = u.id
          WHERE dn.delivery_note_no = ?;
        `,
        values: [delivery_note_no],
      });

      if (deliveryData.length === 0) {
        return res.status(404).json({ error: "Delivery Note not found" });
      }

      res.status(200).json({ deliveryData });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
