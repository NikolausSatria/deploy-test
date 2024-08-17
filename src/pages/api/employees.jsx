import { query } from "@/libs/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const employees = await query({
      query: 'SELECT * FROM employees',
    });

    return res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
