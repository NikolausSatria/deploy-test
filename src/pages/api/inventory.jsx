import { query } from "@/libs/db";

export default async function handler(req, res) {
  try {
    const { method, query: reqQuery, body } = req;

    if (method === "GET") {
      const { search, page = 1, limit = 25, allData } = reqQuery;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        return res.status(400).json({ error: "Invalid page or limit" });
      }

      const offset = (pageNum - 1) * limitNum;

      let sqlQuery = `
        SELECT idt.date_at,
               SUM(CASE 
                   WHEN idt.in_out LIKE 'IN%' THEN idt.qty 
                   WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty 
                   ELSE 0 
               END) as qty, 
               idt.in_out, 
               combined.id, 
               combined.description, 
               combined.type 
        FROM inventories_db idt 
        INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id 
        LEFT JOIN (
          SELECT product_id as id, product_description as description, 'product' as type 
          FROM product_db 
          UNION ALL 
          SELECT material_id as id, material_description as description, 'material' as type 
          FROM material_db 
          UNION ALL 
          SELECT material_id as id, material_description as description, 'asset' as type 
          FROM asset_db
        ) AS combined ON ds.product_id = combined.id 
      `;

      let countQuery = `
        SELECT COUNT(*) as total_count 
        FROM (
          SELECT idt.date_at,
                 SUM(CASE 
                     WHEN idt.in_out LIKE 'IN%' THEN idt.qty 
                     WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty 
                     ELSE 0 
                 END) as qty, 
                 idt.in_out, 
                 combined.id, 
                 combined.description, 
                 combined.type 
          FROM inventories_db idt 
          INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id 
          LEFT JOIN (
            SELECT product_id as id, product_description as description, 'product' as type 
            FROM product_db 
            UNION ALL 
            SELECT material_id as id, material_description as description, 'material' as type 
            FROM material_db 
            UNION ALL 
            SELECT material_id as id, material_description as description, 'asset' as type 
            FROM asset_db
          ) AS combined ON ds.product_id = combined.id 
          GROUP BY ds.product_id
        ) as combine
      `;

      let values = [];

      if (search) {
        sqlQuery += `
          WHERE combined.description LIKE CONCAT('%', ?, '%') 
        `;
        countQuery += ` 
          WHERE combine.description LIKE CONCAT('%', ?, '%')
        `;
        values.push(search);
      }

      if (allData !== "true") {
        sqlQuery += `
          GROUP BY ds.product_id
          ORDER BY idt.created_at DESC
          LIMIT ${limitNum} OFFSET ${offset}
        `;
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
          values,
        });

        const totalItems = allData === "true" ? inventory.length : totalCountResult[0].total_count;
        const totalPages = allData === "true" ? 1 : Math.ceil(totalItems / limitNum);

        return res.status(200).json({ inventory, totalPages });
      } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    if (method === "POST") {
      const {
        in_out,
        date_at,
        lot,
        dn,
        po,
        mo,
        qty,
        employees_id,
        product_id
      } = body;

      if (!in_out || !date_at || !qty || !product_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const existingData = await query({
          query: `
            SELECT idt.*, combined.id 
            FROM inventories_db idt 
            INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id 
            LEFT JOIN (
              SELECT product_id as id FROM product_db 
              UNION ALL 
              SELECT material_id as id FROM material_db 
              UNION ALL 
              SELECT material_id as id FROM asset_db
            ) AS combined ON ds.product_id = combined.id 
            WHERE idt.in_out = ? 
              AND (idt.date_at = ? OR idt.date_at = '0000-00-00') 
              AND (idt.lot = ? OR idt.lot IS NULL) 
              AND (idt.dn = ? OR idt.dn IS NULL) 
              AND (idt.po = ? OR idt.po IS NULL) 
              AND (idt.mo = ? OR idt.mo IS NULL) 
              AND idt.qty = ? 
              AND combined.id = ?
          `,
          values: [in_out, date_at, lot, dn, po, mo, qty, product_id],
        });

        if (existingData && existingData.length > 0) {
          return res.status(400).json({ error: "Data already exists in the database" });
        }

        const addData = await query({
          query: `
            INSERT INTO inventories_db (in_out, date_at, lot, dn, po, mo, qty) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          values: [in_out, date_at, lot, dn, po, mo, qty],
        });

        if (addData.insertId) {
          await query({
            query: `
              INSERT INTO database_sku (inventory_db_id, product_id, employees_id) 
              VALUES (?, ?, ?)
            `,
            values: [addData.insertId, product_id, employees_id],
          });
          return res.status(201).json({
            message: "Data Successfully Input",
            data: {
              inventory_id: addData.insertId,
              sku_id: addData.insertId,
            },
          });
        }
      } catch (error) {
        console.error("Error saving data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
