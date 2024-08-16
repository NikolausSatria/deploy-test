import {query} from "@/libs/db";

export default async function handler(req, res) {
    if (req.method === "GET"){
        const { search_query } = req.query;
        const searchValue = `%${search_query}%`;
        const search_data = await query({
            // query: "SELECT product_id as id, product_description as description, 'product' as type FROM product_db UNION ALL SELECT material_id, material_description, 'material' as type FROM material_db UNION ALL SELECT material_id, material_description, 'asset' as type FROM asset_db",
            query:`
            SELECT product_id as id, product_description as description, 'product' as type FROM product_db WHERE product_description LIKE ? OR product_id LIKE ?
            UNION ALL 
            SELECT material_id as id, material_description, 'material' as type FROM material_db WHERE material_description LIKE ? OR material_id LIKE ?
            UNION ALL 
            SELECT material_id as id, material_description, 'asset' as type FROM asset_db WHERE material_description LIKE ? OR material_id LIKE ?
            `,
            values:[searchValue,searchValue,searchValue,searchValue,searchValue,searchValue]
        })
        res.status(200).json({ searchs: search_data })
    }
     else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}