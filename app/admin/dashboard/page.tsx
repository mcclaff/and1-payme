'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Not logged in, redirect to login
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-gray-500">Please wait while we load your dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => auth.signOut().then(() => router.push('/'))}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
      
      {user && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>
          <div className="text-gray-600 mb-2">
            <span className="font-medium">Phone:</span> {user.phoneNumber || 'Not available'}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Admin ID:</span> {user.uid}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Basketball Games</h2>
          <div className="text-gray-600 italic">
            No games created yet. Create your first game using the button below.
          </div>
          <button 
            onClick={() => router.push('/admin/games/create')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create New Game
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Overview</h2>
          <div className="text-gray-600 italic">
            No payment data available yet. Payment statistics will appear here.
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="text-gray-600 italic">
          No recent activity. Actions like player registrations and payments will appear here.
        </div>
      </div>
    </div>
  );
} 