'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from '@/components/Nav';

export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);
  const [rider, setRider] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    setRider(localUser);
    if (localUser) fetchOrders(localUser.id);

    const s = io('http://localhost:3000');
    setSocket(s);
    return () => s.disconnect();
  }, []);

  const fetchOrders = async (riderId) => {
    const res = await fetch(`/api/rider/orders?rider_id=${riderId}`);
    const data = await res.json();
    setOrders(data);
  };

  const moveFlow = async (order, nextStatus) => {
    await fetch(`/api/orders/${order.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus, rider_id: rider.id })
    });
    socket.emit('accept_order', { userId: order.user_id, status: nextStatus });
    fetchOrders(rider.id);
  };

  const openInGoogleMaps = (locationJson) => {
    const loc = typeof locationJson === 'string' ? JSON.parse(locationJson) : locationJson;
    window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Rider Console</h1>

        {/* ACTIVE TASKS SECTION */}
        <h2 className="text-xl font-semibold mb-4 text-blue-700">My Active Jobs</h2>
        <div className="space-y-4 mb-10">
          {orders.filter(o => o.rider_id === rider?.id && o.status !== 'Completed').map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border-l-8 border-blue-500">
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-400 uppercase">Order #{order.id}</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">{order.status}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Laundry Details</p>
                    <p className="text-gray-800">📦 {order.items_detail || 'Not specified'}</p>
                    <p className="text-gray-800">⚖️ {order.weight_estimate} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Special Instructions</p>
                    <p className="text-gray-700 italic text-sm">"{order.special_instructions || 'None'}"</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">📍 Pickup Location</span>
                  <button 
                    onClick={() => openInGoogleMaps(order.pickup_location)}
                    className="text-blue-600 font-bold text-sm hover:underline"
                  >
                    Open in Maps →
                  </button>
                </div>

                {/* Status-specific Action Buttons */}
                <div className="flex gap-2">
                  {order.status === 'Accepted' && (
                    <button onClick={() => moveFlow(order, 'PickedUp')} className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold">5. Confirm Pickup</button>
                  )}
                  {order.status === 'PickedUp' && (
                    <button onClick={() => moveFlow(order, 'AtShop')} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">6. Drop at Shop</button>
                  )}
                  {order.status === 'Ready' && (
                    <button onClick={() => moveFlow(order, 'OutForDelivery')} className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold">8. Start Delivery</button>
                  )}
                  {order.status === 'OutForDelivery' && (
                    <button onClick={() => moveFlow(order, 'Completed')} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold">9. Mark Completed</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PENDING REQUESTS SECTION */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Available Requests</h2>
        <div className="grid gap-4">
          {orders.filter(o => o.status === 'Pending').map(order => (
            <div key={order.id} className="bg-white p-5 rounded-xl shadow border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-gray-800">New Request: {order.items_detail}</p>
                <span className="text-blue-600 font-bold">~{order.weight_estimate}kg</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 italic">{order.special_instructions}</p>
              <button 
                onClick={() => moveFlow(order, 'Accepted')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition"
              >
                Accept Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}