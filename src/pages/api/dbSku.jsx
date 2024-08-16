import { query } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page = 1, limit = 25} = req.query;
    const offset = (page - 1) * limit;

    let sqlQuery = `
    SELECT pd.product_id as id, pd.product_description as description,'' as material_type, 'product' as type, uom from product_db pd 
    UNION ALL SELECT md.material_id as id, md.material_description as description,md.material_type, 'material' as type, '' as uom from material_db md 
    UNION ALL SELECT ad.material_id as id, ad.material_description as description, ad.material_type,'asset' as type, '' as uom from asset_db ad
    `;

    let countQuery = `
  select count(*) as total_count from(
    SELECT pd.product_id as id, pd.product_description as description,'' as material_type, 'product' as type from product_db pd 
        UNION ALL SELECT md.material_id as id, md.material_description as description,md.material_type, 'material' as type from material_db md 
        UNION ALL SELECT ad.material_id as id, ad.material_description as description, ad.material_type,'asset' as type from asset_db ad
    ) as combined
  `;
   
    let values = [];
    if (search) {
      sqlQuery = `
      SELECT pd.product_id as id, pd.product_description as description, '' as material_type, 'product' as type from product_db pd
      WHERE pd.product_description LIKE CONCAT('%', ?, '%') OR pd.product_id LIKE CONCAT('%', ?, '%')
      UNION ALL
      SELECT md.material_id as id, md.material_description as description, md.material_type, 'material' as type from material_db md
      WHERE md.material_description LIKE CONCAT('%', ?, '%') OR md.material_id LIKE CONCAT('%', ?, '%')
      UNION ALL
      SELECT ad.material_id as id, ad.material_description as description, ad.material_type, 'asset' as type from asset_db ad
      WHERE ad.material_description LIKE CONCAT('%', ?, '%') OR ad.material_id LIKE CONCAT('%', ?, '%')
      `;
      countQuery = `
      select count(*) as total_count from(
      SELECT pd.product_id as id, pd.product_description as description, '' as material_type, 'product' as type from product_db pd
      WHERE pd.product_description LIKE CONCAT('%', ?, '%') OR pd.product_id LIKE CONCAT('%', ?, '%')
      UNION ALL
      SELECT md.material_id as id, md.material_description as description, md.material_type, 'material' as type from material_db md
      WHERE md.material_description LIKE CONCAT('%', ?, '%') OR md.material_id LIKE CONCAT('%', ?, '%')
      UNION ALL
      SELECT ad.material_id as id, ad.material_description as description, ad.material_type, 'asset' as type from asset_db ad
      WHERE ad.material_description LIKE CONCAT('%', ?, '%') OR ad.material_id LIKE CONCAT('%', ?, '%')
      ) as combined
      `;
      values = [search, search, search, search, search, search];
    }
 
    sqlQuery += `LIMIT ? OFFSET ?`;
    values.push(parseInt(limit), parseInt(offset));
    

    try {
      const totalCountResult = await query({
        query: countQuery,
        values: search ? [search, search, search, search, search, search] : []
      });
      const dbSku = await query({
        query: sqlQuery,
        values: values,
      });


      const totalItems = totalCountResult[0].total_count;
      const totalPages = Math.ceil(totalItems / limit);


      res.status(200).json({ dbSku: dbSku, totalPages: totalPages });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error when trying to fetch data from the database" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

