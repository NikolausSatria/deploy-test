import { query, getConnection } from "@/libs/db";  
  
export default async function handler(req, res) {  
  if (req.method === "POST") {  
    const {  
      formList,  
      date_at,  
      po,  
      dn,  
      so,  
      phone_number,  
      license_plate_no,  
      customer_id,  
      delivery_note,  
      company_name,  
      address,  
      uom,  
      employee_id,  
      pic  
    } = req.body;  
  
    if (!formList || !date_at || !po || !dn || !so || !phone_number || !license_plate_no || !customer_id || !delivery_note || !company_name || !address || !uom || !employee_id || !pic) {  
      return res.status(400).json({ message: "Missing required fields: " + JSON.stringify(req.body) });  
    }  
  
    const in_out = "OUT-EXT";  
  
    // Mendapatkan koneksi dari pool  
    const connection = await getConnection(); // Menggunakan fungsi getConnection  
    try {  
      // Start a transaction  
      await connection.beginTransaction(); // Menggunakan beginTransaction  
  
      // Check and insert customer if necessary  
      const checkCustomer = await connection.query("SELECT customer_id FROM customers_db WHERE customer_id = ?", [customer_id]);  
  
      if (checkCustomer[0].length === 0) {  
        await connection.query("INSERT INTO customers_db (customer_id, company_name, phone_number, address) VALUES (?, ?, ?, ?)", [customer_id, company_name, phone_number, address]);  
      }  
  
      for (const form of formList) {  
        // Insert into inventories_db  
        const result = await connection.query("INSERT INTO inventories_db (in_out, dn, date_at, po, qty) VALUES (?, ?, ?, ?, ?)", [in_out, dn, date_at, po, form.qty]);  
  
        const insertId = result[0].insertId;  
  
        // Insert into database_sku  
        await connection.query("INSERT INTO database_sku (inventory_db_id, product_id, employees_id) VALUES (?, ?, ?)", [insertId, form.product_id, employee_id]);  
  
        // Insert into delivery_note_db  
        await connection.query("INSERT INTO delivery_note_db (delivery_note_no, delivery_note, so_no, license_plate_no, product_id, customer_id, delivery_date, employee_id, uom, attn_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [dn, delivery_note, so, license_plate_no, form.product_id, customer_id, date_at, employee_id, uom, pic]);  
      }  
  
      // Commit transaction  
      await connection.commit(); // Menggunakan commit  
  
      res.status(200).json({ message: "Data berhasil disimpan!" });  
    } catch (error) {  
      console.error("Error saat menyimpan data:", error);  
      // Rollback transaction in case of error  
      await connection.rollback(); // Menggunakan rollback  
      res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data." });  
    } finally {  
      connection.release(); // Pastikan koneksi selalu dilepaskan  
    }  
  } else {  
    res.status(405).end();   
  }  
}  
