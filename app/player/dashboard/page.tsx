'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function PlayerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Not logged in, redirect to login
        router.push('/auth/login');
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Player Dashboard</h1>
      
      {user && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="text-gray-600 mb-2">
            <span className="font-medium">Phone:</span> {user.phoneNumber || 'Not available'}
          </div>
          <div className="text-gray-600">
            <span className="font-medium">User ID:</span> {user.uid}
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Upcoming Games</h2>
        <div className="text-gray-600 italic">
          No upcoming games. You'll see your games here after joining one.
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <div className="text-gray-600 italic">
          No payment history yet. Past payments will appear here.
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => auth.signOut().then(() => router.push('/'))}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 