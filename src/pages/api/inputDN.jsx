import { query } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
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

      const in_out = "OUT-EXT";

      const checkCustomer = await query({
        query: "SELECT customer_id FROM customers_db WHERE customer_id = ?",
        values: [customer_id],
      });

      if (checkCustomer.length === 0) {
        await query({
          query:
            "insert into customers_db (customer_id, company_name, phone_number, address) values(?, ?, ?, ?)",
          values: [customer_id, company_name, phone_number, address],
        });
      }

      for (let form of formList) {
        const result = await query({
          query:
            "insert into inventories_db (in_out, dn,date_at, po, qty) values (?, ?, ?, ?, ?)",
          values: [in_out, dn, date_at, po, form.qty],
        });

        const insertId = result.insertId;
        await query({
          query:
            "insert into database_sku (inventory_db_id, product_id) values ( ?, ?)",
          values: [insertId, form.product_id],
        });

        await query({
          // PIC (ATTN_NAME)
          query:
            "insert into delivery_note_db (delivery_note_no, delivery_note, so_no, license_plate_no, product_id, customer_id, delivery_date,employee_id, uom, attn_name) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

      res.status(200).json({ message: "Data berhasil disimpan!" });
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menyimpan data." });
    }
  } else {
    res.status(405).end(); 
  }
}
