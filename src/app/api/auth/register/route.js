import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // 1. Hash the password securely (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Default to 'user' role if none is provided
    const userRole = role || 'user';

    // 3. Insert into the database
    const [result] = await pool.execute(
      'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully!' 
    }, { status: 201 });

  } catch (error) {
    // Handle MySQL duplicate entry error (email already exists)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    console.error("Registration Error:", error);
    return NextResponse.json({ error: 'Server error during registration.' }, { status: 500 });
  }
}