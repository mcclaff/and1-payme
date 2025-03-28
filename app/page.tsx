import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-6">Basketball Payments</h1>
      <p className="text-xl mb-8 max-w-md">
        The easiest way to organize and collect payments for your basketball games.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login / Register
        </Link>
        
        <Link 
          href="/admin" 
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
} 