import { query } from "@/libs/db";

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
      return res.status(400).json({ message: "Missing required fields" });
    }

    const in_out = "OUT-EXT";

    try {
      // Start a transaction
      await query("START TRANSACTION");

      // Check and insert customer if necessary
      const checkCustomer = await query({
        query: "SELECT customer_id FROM customers_db WHERE customer_id = ?",
        values: [customer_id],
      });

      if (checkCustomer.length === 0) {
        await query({
          query:
            "INSERT INTO customers_db (customer_id, company_name, phone_number, address) VALUES (?, ?, ?, ?)",
          values: [customer_id, company_name, phone_number, address],
        });
      }

      for (let form of formList) {
        // Insert into inventories_db
        const result = await query({
          query:
            "INSERT INTO inventories_db (in_out, dn, date_at, po, qty) VALUES (?, ?, ?, ?, ?)",
          values: [in_out, dn, date_at, po, form.qty],
        });

        const insertId = result.insertId;

        // Insert into database_sku
        await query({
          query:
            "INSERT INTO database_sku (inventory_db_id, product_id) VALUES (?, ?)",
          values: [insertId, form.product_id],
        });

        // Insert into delivery_note_db
        await query({
          query:
            "INSERT INTO delivery_note_db (delivery_note_no, delivery_note, so_no, license_plate_no, product_id, customer_id, delivery_date, employee_id, uom, attn_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          values: [
            dn,
            delivery_note,
            so,
            license_plate_no,
            form.product_id,
            customer_id,
            date_at,
            employee_id,
            uom,
            pic
          ],
        });
      }

      // Commit transaction
      await query("COMMIT");

      res.status(200).json({ message: "Data berhasil disimpan!" });
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      // Rollback transaction in case of error
      await query("ROLLBACK");
      res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data." });
    }
  } else {
    res.status(405).end(); 
  }
}
