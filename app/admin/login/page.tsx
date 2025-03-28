'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleSuccessfulLogin = (userId: string) => {
    // Redirect to admin dashboard after login
    // In a real app, we would validate that the user is an admin first
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">
            Login with your phone number to access the admin dashboard.
          </p>
        </div>
        
        <PhoneAuthForm onSuccessfulLogin={handleSuccessfulLogin} />
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 