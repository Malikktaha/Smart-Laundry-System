import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const riderId = searchParams.get('rider_id');

    // Fetch details like items, weight, instructions, and location
    let query = `
      SELECT id, user_id, rider_id, pickup_location, items_detail, 
             weight_estimate, special_instructions, status, schedule_time 
      FROM Orders 
      WHERE status = 'Pending'
    `;
    let values = [];

    if (riderId) {
      query += " OR (rider_id = ? AND status != 'Completed')";
      values.push(riderId);
    }

    const [rows] = await pool.execute(query, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Rider API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}