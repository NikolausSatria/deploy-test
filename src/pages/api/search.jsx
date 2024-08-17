import { query } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { search_query } = req.query;

    if (!search_query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchValue = `%${search_query}%`;

    try {
      const search_data = await query({
        query: `
          SELECT product_id AS id, product_description AS description, 'product' AS type 
          FROM product_db 
          WHERE product_description LIKE ? OR product_id LIKE ?
          UNION ALL 
          SELECT material_id AS id, material_description AS description, 'material' AS type 
          FROM material_db 
          WHERE material_description LIKE ? OR material_id LIKE ?
          UNION ALL 
          SELECT asset_id AS id, material_description AS description, 'asset' AS type 
          FROM asset_db 
          WHERE material_description LIKE ? OR material_id LIKE ?
        `,
        values: [searchValue, searchValue, searchValue, searchValue, searchValue, searchValue],
      });

      res.status(200).json({ searchs: search_data });
    } catch (error) {
      console.error("Error executing search query:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
