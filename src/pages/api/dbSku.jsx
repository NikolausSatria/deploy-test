import { query } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    let sqlQuery = `
      SELECT id, description, material_type, type, uom 
      FROM (
        SELECT pd.product_id AS id, 
               pd.product_description AS description, 
               '' AS material_type, 
               'product' AS type, 
               uom 
        FROM product_db pd 
        UNION ALL 
        SELECT md.material_id AS id, 
               md.material_description AS description, 
               md.material_type AS material_type, 
               'material' AS type, 
               '' AS uom 
        FROM material_db md 
        UNION ALL 
        SELECT ad.material_id AS id, 
               ad.material_description AS description, 
               ad.material_type AS material_type, 
               'asset' AS type, 
               '' AS uom 
        FROM asset_db ad
      ) AS combined
    `;

    let countQuery = `
      SELECT COUNT(*) AS total_count 
      FROM (
        SELECT pd.product_id AS id 
        FROM product_db pd 
        UNION ALL 
        SELECT md.material_id AS id 
        FROM material_db md 
        UNION ALL 
        SELECT ad.material_id AS id 
        FROM asset_db ad
      ) AS combined
    `;

    let values = [];

    if (search) {
      sqlQuery = `
        SELECT id, description, material_type, type, uom 
        FROM (
          SELECT pd.product_id AS id, 
                 pd.product_description AS description, 
                 '' AS material_type, 
                 'product' AS type, 
                 uom 
          FROM product_db pd 
          WHERE pd.product_description LIKE CONCAT('%', ?, '%') 
             OR pd.product_id LIKE CONCAT('%', ?, '%')
          UNION ALL 
          SELECT md.material_id AS id, 
                 md.material_description AS description, 
                 md.material_type AS material_type, 
                 'material' AS type, 
                 '' AS uom 
          FROM material_db md 
          WHERE md.material_description LIKE CONCAT('%', ?, '%') 
             OR md.material_id LIKE CONCAT('%', ?, '%')
          UNION ALL 
          SELECT ad.material_id AS id, 
                 ad.material_description AS description, 
                 ad.material_type AS material_type, 
                 'asset' AS type, 
                 '' AS uom 
          FROM asset_db ad 
          WHERE ad.material_description LIKE CONCAT('%', ?, '%') 
             OR ad.material_id LIKE CONCAT('%', ?, '%')
        ) AS combined
      `;
      countQuery = `
        SELECT COUNT(*) AS total_count 
        FROM (
          SELECT pd.product_id AS id 
          FROM product_db pd 
          WHERE pd.product_description LIKE CONCAT('%', ?, '%') 
             OR pd.product_id LIKE CONCAT('%', ?, '%')
          UNION ALL 
          SELECT md.material_id AS id 
          FROM material_db md 
          WHERE md.material_description LIKE CONCAT('%', ?, '%') 
             OR md.material_id LIKE CONCAT('%', ?, '%')
          UNION ALL 
          SELECT ad.material_id AS id 
          FROM asset_db ad 
          WHERE ad.material_description LIKE CONCAT('%', ?, '%') 
             OR ad.material_id LIKE CONCAT('%', ?, '%')
        ) AS combined
      `;
      values = [search, search, search, search, search, search];
    }

    sqlQuery += ` LIMIT ? OFFSET ?`;
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
      console.error("Error when fetching data:", error);
      res.status(500).json({ message: "Error when trying to fetch data from the database" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
