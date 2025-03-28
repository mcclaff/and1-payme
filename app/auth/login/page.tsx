'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PhoneAuthForm from '@/components/auth/PhoneAuthForm';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccessfulLogin = (userId: string) => {
    // After successful login, redirect to the dashboard or home page
    router.push('/player/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
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