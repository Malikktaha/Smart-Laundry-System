import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// THIS HANDLES: User creating an order
export async function POST(request) {
  try {
    const data = await request.json();
    const [result] = await pool.execute(
      `INSERT INTO Orders (
        user_id, pickup_location, delivery_location, schedule_time, 
        items_detail, weight_estimate, special_instructions, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        data.user_id, 
        JSON.stringify(data.pickup_location), 
        JSON.stringify(data.delivery_location), 
        data.schedule_time,
        data.items_detail,
        data.weight_estimate,
        data.special_instructions
      ]
    );
    return NextResponse.json({ success: true, orderId: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// THIS HANDLES: Admin fetching all orders (The missing part causing 405)
export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM Orders ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}