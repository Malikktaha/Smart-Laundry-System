import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status, rider_id } = await request.json();
    
    let query = 'UPDATE Orders SET status = ?';
    let values = [status];

    if (rider_id) {
      query += ', rider_id = ?';
      values.push(rider_id);
    }
    
    query += ' WHERE id = ?';
    values.push(id);

    await pool.execute(query, values);
    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}