import React, { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface PhoneAuthFormProps {
  onSuccessfulLogin: (userId: string) => void;
}

export default function PhoneAuthForm({ onSuccessfulLogin }: PhoneAuthFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up recaptcha
  const setupRecaptcha = () => {
    // Clear any existing recaptcha
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': () => {
        setError(null);
      },
      'expired-callback': () => {
        setError('reCAPTCHA has expired. Please refresh the page.');
      }
    });
  };

  // Send verification code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format phone number for Australian format
      const formattedNumber = formatPhoneNumber(phoneNumber);
      
      // Set up recaptcha
      setupRecaptcha();
      
      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedNumber, 
        window.recaptchaVerifier
      );
      
      setVerificationId(confirmationResult.verificationId);
      setLoading(false);
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('Error sending verification code. Please try again.');
      setLoading(false);
    }
  };

  // Verify the code and sign in
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!window.confirmationResult) {
        throw new Error('No verification ID found');
      }
      
      const result = await window.confirmationResult.confirm(verificationCode);
      const user = result.user;
      
      setLoading(false);
      onSuccessfulLogin(user.uid);
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Invalid verification code. Please try again.');
      setLoading(false);
    }
  };

  // Format phone number to E.164 format for Australia (+61...)
  const formatPhoneNumber = (number: string): string => {
    let formatted = number.replace(/\s+/g, '');
    
    // If starts with 0, replace with +61
    if (formatted.startsWith('0')) {
      formatted = '+61' + formatted.substring(1);
    }
    
    // If doesn't start with +, add +61
    if (!formatted.startsWith('+')) {
      formatted = '+61' + formatted;
    }
    
    return formatted;
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login / Register</h2>
      
      {!verificationId ? (
        // Step 1: Phone Number Form
        <form onSubmit={handleSendCode}>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="0400 123 456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Australian mobile number (we'll send a verification code)
            </p>
          </div>
          
          <div id="recaptcha-container" className="mb-4"></div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Sending code...' : 'Send verification code'}
          </button>
        </form>
      ) : (
        // Step 2: Verification Code Form
        <form onSubmit={handleVerifyCode}>
          <div className="mb-4">
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              placeholder="123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code sent to your phone
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !verificationCode}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify code & login'}
          </button>
          
          <button
            type="button"
            onClick={() => setVerificationId(null)}
            className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to phone number
          </button>
        </form>
      )}
    </div>
  );
}

// Add these to the global window object
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
} 