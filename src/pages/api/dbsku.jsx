import { query } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search, page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;
    let values = [];
    let whereClause = "";

    if (search) {
      whereClause = `
        WHERE pd.product_description LIKE CONCAT('%', ?, '%') OR pd.product_id LIKE CONCAT('%', ?, '%')
        OR md.material_description LIKE CONCAT('%', ?, '%') OR md.material_id LIKE CONCAT('%', ?, '%')
        OR ad.material_description LIKE CONCAT('%', ?, '%') OR ad.material_id LIKE CONCAT('%', ?, '%')
      `;
      values = [search, search, search, search, search, search];
    }

    const sqlQuery = `
      SELECT id, description, material_type, type, uom FROM (
        SELECT pd.product_id as id, pd.product_description as description, '' as material_type, 'product' as type, pd.uom 
        FROM product_db pd
        ${whereClause ? "WHERE pd.product_description LIKE CONCAT('%', ?, '%') OR pd.product_id LIKE CONCAT('%', ?, '%')" : ""}
        UNION ALL
        SELECT md.material_id as id, md.material_description as description, md.material_type, 'material' as type, '' as uom 
        FROM material_db md
        ${whereClause ? "WHERE md.material_description LIKE CONCAT('%', ?, '%') OR md.material_id LIKE CONCAT('%', ?, '%')" : ""}
        UNION ALL
        SELECT ad.material_id as id, ad.material_description as description, ad.material_type, 'asset' as type, '' as uom 
        FROM asset_db ad
        ${whereClause ? "WHERE ad.material_description LIKE CONCAT('%', ?, '%') OR ad.material_id LIKE CONCAT('%', ?, '%')" : ""}
      ) as combined
      ORDER BY id LIMIT ? OFFSET ?;
    `;

    const countQuery = `
      SELECT COUNT(*) as total_count FROM (
        SELECT pd.product_id FROM product_db pd
        ${whereClause ? "WHERE pd.product_description LIKE CONCAT('%', ?, '%') OR pd.product_id LIKE CONCAT('%', ?, '%')" : ""}
        UNION ALL
        SELECT md.material_id FROM material_db md
        ${whereClause ? "WHERE md.material_description LIKE CONCAT('%', ?, '%') OR md.material_id LIKE CONCAT('%', ?, '%')" : ""}
        UNION ALL
        SELECT ad.material_id FROM asset_db ad
        ${whereClause ? "WHERE ad.material_description LIKE CONCAT('%', ?, '%') OR ad.material_id LIKE CONCAT('%', ?, '%')" : ""}
      ) as combined;
    `;

    values.push(parseInt(limit), parseInt(offset));

    try {
      const totalCountResult = await query({
        query: countQuery,
        values: search ? [search, search, search, search, search, search] : []
      });

      const dbsku = await query({
        query: sqlQuery,
        values: values,
      });

      const totalItems = totalCountResult[0].total_count;
      const totalpages = Math.ceil(totalItems / limit);

      res.status(200).json({ dbsku, totalpages });
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
