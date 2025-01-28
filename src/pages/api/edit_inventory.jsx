import { query } from "@/libs/db"; // Pastikan untuk mengimpor query dari library Anda  
  
export const config = {  
  api: {  
    externalResolver: true,  
  },  
};  
  
export default async function handler(req, res) {  
  const { id } = req.query;  
  
  if (!id || isNaN(id)) {  
    return res.status(400).json({ message: "ID parameter is required" });  
  }  
  
  if (req.method === "GET") {  
    try {  
      const inventory = await query({  
        query: `  
          SELECT   
            idt.id, idt.date_at, idt.in_out, idt.lot, idt.dn, idt.po, idt.mo, idt.qty, idt.created_at,   
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
          WHERE idt.id = ?   
        `,  
        values: [id],  
      });  
  
      return res.status(200).json({ inventory });  
    } catch (error) {  
      console.error("Error fetching data:", error);  
      return res.status(500).json({ error: "Internal Server Error" });  
    }  
  } else if (req.method === "PUT") {  
    const { in_out, date_at, lot, dn, po, mo, qty } = req.body;  
  
    if (!in_out || !date_at || !qty) {  
      return res.status(400).json({ message: "Missing required fields" });  
    }  
  
    try {  
      await query({  
        query: `  
          UPDATE inventories_db   
          SET in_out = ?, date_at = ?, lot = ?, dn = ?, po = ?, mo = ?, qty = ?   
          WHERE id = ?  
        `,  
        values: [in_out, date_at, lot || null, dn || null, po || null, mo || null, qty, id],  
      });  
  
      return res.status(200).json({ message: "Inventory updated successfully" });  
    } catch (error) {  
      console.error("Error updating inventory:", error);  
      return res.status(500).json({ error: "Internal Server Error" });  
    }  
  } else {  
    return res.status(405).json({ message: "Method Not Allowed" });  
  }  
}  
