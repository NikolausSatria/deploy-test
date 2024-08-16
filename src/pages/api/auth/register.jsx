import { query } from "@/libs/db"
import bcrypt from 'bcryptjs';

export default async function register(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, name, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const results = await query({
      query: 'INSERT INTO employees (id, name, password) VALUES (?, ?, ?)',
      values: [userId, name, hashedPassword],
    });

    return res.status(201).json({ message: 'User registered successfully', results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}