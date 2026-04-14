'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Nav';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    items: '',
    weight: '',
    instructions: '',
    time: ''
  });
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    setUser(localUser);

    if (localUser) {
      const socket = io('http://localhost:3000');
      // Listen for real-time status changes
      socket.on(`order_update_${localUser.id}`, (data) => {
        setActiveOrder(prev => prev ? { ...prev, status: data.status } : null);
      });
      return () => socket.disconnect();
    }
  }, []);

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!location) return alert("Please select a pickup location on the map.");

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        pickup_location: location,
        delivery_location: location,
        schedule_time: orderDetails.time,
        items_detail: orderDetails.items,
        weight_estimate: orderDetails.weight,
        special_instructions: orderDetails.instructions
      })
    });

    if (res.ok) {
      const data = await res.json();
      setActiveOrder({ id: data.orderId, status: 'Pending' });
      alert("Order placed successfully!");
    }
  };

  if (!user) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* Left Side: Order Form */}
        <div className="bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Schedule Laundry</h2>
          <form onSubmit={submitOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Location (Click Map)</label>
              <MapPicker onLocationSelect={setLocation} />
              {location && <p className="text-green-600 text-xs mt-1">✓ Location set: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Items (e.g. 5 Shirts, 2 Pants)</label>
                <input type="text" className="w-full p-2 border rounded" required
                  onChange={e => setOrderDetails({...orderDetails, items: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium">Est. Weight (kg)</label>
                <input type="number" className="w-full p-2 border rounded" step="0.1" required
                  onChange={e => setOrderDetails({...orderDetails, weight: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Special Instructions</label>
              <textarea className="w-full p-2 border rounded" rows="2" placeholder="Fragile items, specific detergent..."
                onChange={e => setOrderDetails({...orderDetails, instructions: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium">Preferred Pickup Date & Time</label>
              <input type="datetime-local" className="w-full p-2 border rounded" required
                onChange={e => setOrderDetails({...orderDetails, time: e.target.value})} />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Confirm Pickup Request
            </button>
          </form>
        </div>

        {/* Right Side: Real-Time Tracking */}
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-lg rounded-xl border-t-4 border-blue-600">
            <h2 className="text-xl font-bold mb-4">Live Order Tracking</h2>
            {activeOrder ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Order ID: #{activeOrder.id}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold uppercase">
                    {activeOrder.status}
                  </span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: activeOrder.status === 'Delivered' ? '100%' : activeOrder.status === 'Washing' ? '50%' : '20%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                    ></div>
                  </div>
                  <div className="flex text-xs justify-between text-gray-400">
                    <span>Pending</span>
                    <span>Washing</span>
                    <span>Delivered</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 italic">
                  Status updates are pushed automatically in real-time.
                </p>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No active orders being tracked.</p>
                <p className="text-xs">Schedule a pickup to see live updates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}