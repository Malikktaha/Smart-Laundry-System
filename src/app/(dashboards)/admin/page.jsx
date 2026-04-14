'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Nav';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
  try {
    const res = await fetch('/api/orders');
    
    // Check if the response is actually okay
    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return;
    }

    const data = await res.json();
    setOrders(data || []);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }
};

  const updateStatus = async (id, newStatus) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Admin Panel - All Orders</h2>
        <table className="w-full bg-white shadow rounded text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">ID</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Rider ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.user_id}</td>
                <td className="p-3">{o.rider_id || 'Unassigned'}</td>
                <td className="p-3 font-bold">{o.status}</td>
                <td className="p-3">
                  <select 
                    value={o.status} 
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="PickedUp">PickedUp</option>
                    <option value="Washing">Washing</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}