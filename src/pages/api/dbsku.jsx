import { query } from "@/libs/db";

const ITEM_TYPES = {
  PRODUCT: 'product',
  MATERIAL: 'material',
  ASSET: 'asset'
};

export default async function handler(req, res) {
  try {
    const { method, query: reqQuery } = req;

    if (method !== "GET") {
      return res.status(405).end(`Method ${method} Not Allowed`);
    }

    const { search, page = 1, limit = 25 } = reqQuery;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: "Invalid page or limit" });
    }

    const offset = (pageNum - 1) * limitNum;
    const values = [];
    
    let sqlQuery = `
      SELECT pd.product_id as id, pd.product_description as description, '' as material_type, ? as type, pd.uom 
      FROM product_db pd 
      UNION ALL 
      SELECT md.material_id as id, md.material_description as description, md.material_type, ? as type, '' as uom 
      FROM material_db md 
      UNION ALL 
      SELECT ad.material_id as id, ad.material_description as description, ad.material_type, ? as type, '' as uom 
      FROM asset_db ad
    `;
    values.push(ITEM_TYPES.PRODUCT, ITEM_TYPES.MATERIAL, ITEM_TYPES.ASSET);

    let countQuery = `
      SELECT COUNT(*) AS total_count FROM (${sqlQuery}) as combined
    `;

    if (search) {
      const searchPattern = `%${search}%`;
      sqlQuery = `
        SELECT * FROM (${sqlQuery}) as combined
        WHERE description LIKE ? OR id LIKE ?
      `;
      values.push(searchPattern, searchPattern);
      countQuery = `
        SELECT COUNT(*) AS total_count FROM (${sqlQuery}) as filtered
      `;
    }

    sqlQuery += ` LIMIT ? OFFSET ?`;
    values.push(limitNum, offset);

    console.log("SQL Query:", sqlQuery);
    console.log("Values:", values);

    try {
      const [totalCountResult, dbsku] = await Promise.all([
        query({ query: countQuery, values }),
        query({ query: sqlQuery, values }),
      ]);

      const totalItems = totalCountResult[0].total_count;
      const totalPages = Math.ceil(totalItems / limitNum);

      if (dbsku.length === 0) {
        return res.status(404).json({ message: "No results found" });
      }

      return res.status(200).json({
        dbsku, 
        totalPages,
        totalItems
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}