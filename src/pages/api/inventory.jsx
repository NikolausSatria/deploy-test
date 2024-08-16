import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
};
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page = 1, limit = 25, allData } = req.query;
    const offset = (page - 1) * limit;

    let sqlQuery = `
    SELECT idt.date_at,SUM(CASE WHEN idt.in_out LIKE 'IN%' THEN idt.qty WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty ELSE 0 END) as qty, idt.in_out, combined.id, combined.description, combined.type FROM inventories_db idt INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id LEFT JOIN( SELECT product_id as id, product_description as description, 'product' as type from product_db UNION ALL SELECT material_id as id, material_description as description, 'material' as type from material_db UNION ALL SELECT material_id as id, material_description as description, 'asset' as type from asset_db) AS combined ON ds.product_id = combined.id 
    `;

    let countQuery = `
    select count(*) as total_count from (
      SELECT idt.date_at,SUM(CASE WHEN idt.in_out LIKE 'IN%' THEN idt.qty WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty ELSE 0 END) as qty, idt.in_out, combined.id, combined.description, combined.type FROM inventories_db idt INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id LEFT JOIN( SELECT product_id as id, product_description as description, 'product' as type from product_db UNION ALL SELECT material_id as id, material_description as description, 'material' as type from material_db UNION ALL SELECT material_id as id, material_description as description, 'asset' as type from asset_db) AS combined ON ds.product_id = combined.id 
       GROUP BY ds.product_id
              ORDER BY idt.created_at DESC
      ) as combine
    `;
    let values = [];

    if (search) {
      sqlQuery += `
          WHERE combined.description LIKE CONCAT('%', ?, '%') 
        `;
      countQuery += ` WHERE combine.description LIKE CONCAT('%', ?, '%')`;
      values.push(search);
    }
    if (allData !== "true") {
      sqlQuery += `
      GROUP BY ds.product_id
      ORDER BY idt.created_at DESC
      LIMIT ? OFFSET ?
    `;
      values.push(parseInt(limit), parseInt(offset));
    } else {
      sqlQuery += `
        GROUP BY ds.product_id
        ORDER BY idt.created_at DESC
      `;
    }

    try {
      const totalCountResult = await query({
        query: countQuery,
        values: search ? [search] : [],
      });

      const inventory = await query({
        query: sqlQuery,
        values: values,
      });

      // const totalItems = totalCountResult[0].total_count;
      // const totalPages = Math.ceil(totalItems / limit);

      const totalItems =
        allData === "true" ? inventory.length : totalCountResult[0].total_count;
      const totalPages = allData === "true" ? 1 : Math.ceil(totalItems / limit);

      res.status(200).json({ inventory: inventory, totalPages: totalPages });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error when trying to fetch data from the database" });
    }
  }

  if (req.method === "POST") {
    try {
      const in_out = req.body.in_out;
      const date_at = req.body.date_at;
      const lot = req.body.lot;
      const dn = req.body.dn;
      const po = req.body.po;
      const mo = req.body.mo;
      const qty = req.body.qty;
      const employees_id = req.body.employees_id;

      const product_id = req.body.product_id;

      const existingData = await query({
        query:
          "SELECT idt.*, combined.id FROM inventories_db idt INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id LEFT JOIN( SELECT product_id as id from product_db UNION ALL SELECT material_id as id from material_db UNION ALL SELECT material_id as id from asset_db) AS combined ON ds.product_id = combined.id WHERE idt.in_out=? && (idt.date_at=? or idt.date_at='0000-00-00') && (idt.lot=? or idt.lot IS NULL) && (idt.dn=? or idt.dn IS NULL) && (idt.po=? or idt.po IS NULL) && (idt.mo =? or idt.mo IS NULL) && idt.qty=? && combined.id=?",
        values: [in_out, date_at, lot, dn, po, mo, qty, product_id],
      });

      if (existingData && existingData.length > 0) {
        res.status(400).json({ message: "Gagal input Data ke database" });
      } else {
        const addData = await query({
          query:
            "INSERT INTO inventories_db (in_out, date_at,lot, dn, po, mo, qty) VALUES (?,?,?,?,?,?,?)",
          values: [in_out, date_at, lot, dn, po, mo, qty],
        });
        // if (addData.insertId) {
          const addDataSku = await query({
            query:
              "INSERT INTO database_sku (inventory_db_id, product_id, employees_id) VALUES (?,?,?)",
            values: [addData.insertId, product_id, employees_id],
          });
          res.status(200).json({
            message: "Data Successfully Input",
            data: {
              inventory_id: addData.insertId,
              sku_id: addDataSku.insertId,
            },
          });
        // }
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat menyimpan data" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
