import { query } from "@/libs/db";
import bcrypt from "bcryptjs";

export default async function register(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, name, password } = req.body;

    // Validasi input
    if (!userId || !password || !name) {
      return res
        .status(400)
        .json({ message: "User ID, name, and password are required" });
    }

    // Cek apakah userId sudah ada
    const existingUser = await query({
      query: "SELECT * FROM employees WHERE id = ?",
      values: [userId],
    });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Simpan pengguna baru ke database dengan tanggal hari ini dan posisi default 'user'
    const results = await query({
      query:
        "INSERT INTO employees (id, name, password, createdAt, position) VALUES (?, ?, ?, ?, ?)",
      values: [userId, name, hashedPassword, today, "user"],
    });

    // Kirim respons sukses
    return res
      .status(201)
      .json({ message: "User registered successfully", results });
  } catch (error) {  
    // Tangani kesalahan dan kirim respons kesalahan  
    if (error.code === 'ER_DUP_ENTRY') {  
      return res.status(400).json({ message: 'User ID already exists' });  
    }  
    console.error('Registration error:', error);  
    return res.status(500).json({ message: 'Internal Server Error' });  
  }
}
