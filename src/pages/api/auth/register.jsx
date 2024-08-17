import { query } from "@/libs/db";
import bcrypt from 'bcryptjs';

export default async function register(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, name, password } = req.body;

    // Validasi input
    if (!userId || !password || !name) {
      return res.status(400).json({ message: 'User ID, name, and password are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna baru ke database
    const results = await query({
      query: 'INSERT INTO employees (id, name, password) VALUES (?, ?, ?)',
      values: [userId, name, hashedPassword],
    });

    // Kirim respons sukses
    return res.status(201).json({ message: 'User registered successfully', results });
  } catch (error) {
    // Tangani kesalahan dan kirim respons kesalahan
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
