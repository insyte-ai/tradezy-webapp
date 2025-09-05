import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserRole } from '../../types/user';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyEmail = async (verificationToken: string) => {
    setVerificationStatus('verifying');
    try {
      const response = await axios.post('/api/auth/verify-email', { token: verificationToken });
      setVerificationStatus('success');
      toast.success('Email verified successfully!');
      
      // Redirect to appropriate onboarding flow based on role
      setTimeout(() => {
        if (response.data.user.role === UserRole.SELLER) {
          navigate('/onboarding/seller');
        } else {
          navigate('/onboarding/buyer');
        }
      }, 2000);
    } catch (error: any) {
      setVerificationStatus('error');
      toast.error(error.response?.data?.message || 'Verification failed');
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email || countdown > 0) return;
    
    setResending(true);
    try {
      await axios.post('/api/auth/resend-verification', { email: user.email });
      toast.success('Verification email sent!');
      setCountdown(60); // 60 second cooldown
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  if (verificationStatus === 'verifying') {
    return (
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <h2 className="text-2xl font-light mb-2">Verifying your email...</h2>
        <p className="text-gray-600">Please wait while we verify your email address.</p>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-light mb-2">Email Verified!</h2>
        <p className="text-gray-600 mb-4">Your email has been successfully verified.</p>
        <p className="text-sm text-gray-500">Redirecting to onboarding...</p>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-light mb-2">Verification Failed</h2>
        <p className="text-gray-600 mb-6">The verification link is invalid or has expired.</p>
        <div className="space-y-3">
          <button
            onClick={resendVerificationEmail}
            disabled={resending || countdown > 0}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
          </button>
          <Link
            to="/auth/login"
            className="block w-full py-3 border border-gray-300 text-center rounded-lg hover:bg-gray-50 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Default state - waiting for email verification
  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-light mb-2">Check Your Email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification link to your email address.
        <br />
        Please click the link to verify your account.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm font-medium text-gray-900 mb-2">Didn't receive the email?</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check your spam or junk folder</li>
          <li>• Make sure you entered the correct email</li>
          <li>• Wait a few minutes for the email to arrive</li>
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={resendVerificationEmail}
          disabled={resending || countdown > 0 || !user?.email}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
        </button>
        <Link
          to="/auth/login"
          className="block w-full py-3 border border-gray-300 text-center rounded-lg hover:bg-gray-50 font-medium"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationPage;