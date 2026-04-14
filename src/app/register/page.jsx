'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // Allow them to sign up as a User or Rider
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await res.json();
    
    if (data.success) {
      alert('Registration successful! You can now log in.');
      router.push('/'); // Redirect back to login page
    } else {
      alert(data.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        <input 
          type="text" name="name" placeholder="Full Name" required
          className="w-full mb-4 p-2 border rounded" 
          value={formData.name} onChange={handleChange} 
        />
        
        <input 
          type="email" name="email" placeholder="Email" required
          className="w-full mb-4 p-2 border rounded" 
          value={formData.email} onChange={handleChange} 
        />
        
        <input 
          type="password" name="password" placeholder="Password" required
          className="w-full mb-4 p-2 border rounded" 
          value={formData.password} onChange={handleChange} 
        />

        <select 
          name="role" 
          className="w-full mb-6 p-2 border rounded bg-white"
          value={formData.role} onChange={handleChange}
        >
          <option value="user">Customer (Order Laundry)</option>
          <option value="rider">Rider (Deliver Laundry)</option>
        </select>
        
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded font-bold transition">
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}