import { query } from "@/libs/db";

export const config = {
  api: {
    externalResolver: true,
  },
}
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page = 1, limit = 25, allData} = req.query;
    const offset = (page - 1) * limit;
    let sqlQuery = `
    SELECT idt.date_at, SUM(CASE WHEN idt.in_out LIKE 'IN%' THEN idt.qty WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty ELSE 0 END) as qty, idt.in_out, md.material_id as id, md.material_description as description, 'material' as type FROM inventories_db idt INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id INNER JOIN material_db md ON ds.product_id = md.material_id 
    `;
    let countQuery = `
    select count(*) as total_count from(
    SELECT idt.date_at, SUM(CASE WHEN idt.in_out LIKE 'IN%' THEN idt.qty WHEN idt.in_out LIKE 'OUT%' THEN -idt.qty ELSE 0 END) as qty, idt.in_out, md.material_id as id, md.material_description as description, 'material' as type FROM inventories_db idt INNER JOIN database_sku ds ON idt.id = ds.inventory_db_id INNER JOIN material_db md ON ds.product_id = md.material_id 
    ) as combine`;
    let values = [];

    if (search){
      sqlQuery += `
      WHERE md.material_description LIKE CONCAT('%', ?, '%')
      `;
      countQuery += ` WHERE combine.description LIKE CONCAT('%', ?, '%')`
      values.push(search);
    }
    if (allData !== 'true'){
      sqlQuery += `
      GROUP BY ds.product_id 
      ORDER BY idt.created_at DESC 
      LIMIT ? OFFSET ?
      `;
      values.push(parseInt(limit), parseInt(offset));
    } else{
      sqlQuery += `
      GROUP BY ds.product_id 
      ORDER BY idt.created_at DESC 
      `;
    }


    try {
      // const totalCountResult = await query({
      //   query: countQuery,
      //   values: search ? [search] : []
      // });

      
      // const material_inventory = await query({
      //   query: sqlQuery,
      //   values: values,
      // })

      // const totalItems = totalCountResult[0].total_count;
      // const totalPages = Math.ceil(totalItems / limit);
      let totalItems = 0;
      let totalPages = 0;
      const material_inventory = await query({
        query: sqlQuery,
        values: values,
      });

      if (allData !== "true") {
        const totalCountResult = await query({
          query: countQuery,
          values: search ? [search] : [],
        });
        totalItems = totalCountResult[0].total_count;
        totalPages = Math.ceil(totalItems / limit);
      } else {
        totalItems = material_inventory.length;
        totalPages = 1;
      }
      
      res.status(200).json({ material_inventory: material_inventory, totalPages: totalPages });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error when trying to fetch data from the database" });
    }
  }

}