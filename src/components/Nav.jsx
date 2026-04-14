'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Smart Laundry</h1>
      <button onClick={handleLogout} className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900">
        Logout
      </button>
    </nav>
  );
}