import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Use a fallback secret for development, but always use a strong environment variable in production
const SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Fetch the user from the database by email
    const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
    const user = rows[0];

    // 2. If the user doesn't exist, return an error
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Compare the provided plain-text password with the hashed password in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 4. Generate a JWT token if credentials are valid
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '1d' }
    );

    // 5. Return success response with token and user details (excluding the password)
    return NextResponse.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role 
      } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Server error during login' }, { status: 500 });
  }
}