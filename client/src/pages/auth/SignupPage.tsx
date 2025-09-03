import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { register } from '../../store/slices/authSlice';
import { UserRole } from '../../types/user';
import toast from 'react-hot-toast';

const SignupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate work email (basic check for common personal email providers)
    const personalEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (personalEmailDomains.includes(emailDomain)) {
      toast.error('Please use your work email address');
      return;
    }
    
    try {
      // For now, we'll send a minimal registration with temporary password
      // This will be replaced with proper OAuth flow later
      await dispatch(register({
        email,
        password: 'temporary123', // Temporary - will be replaced with OAuth
        role: UserRole.BUYER,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        company: {
          name: '',
          website: '',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
          },
        },
      })).unwrap();
      
      toast.success('Check your email to complete signup!');
      
      // Redirect to email verification
      navigate('/auth/verify-email');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-neutral-900">
            Join TradeZy
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Shop wholesale from thousands of brands
          </p>
        </div>

        <div className="bg-white p-8 shadow-sm border border-neutral-200 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
              />
              <p className="mt-1.5 text-xs text-neutral-500">
                Use your work email for instant approval
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? 'Creating account...' : 'Continue'}
            </button>

            <button
              type="button"
              disabled
              className="w-full py-3 px-4 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google (Coming Soon)
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-medium text-neutral-900 hover:underline">
              Sign in
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-neutral-600">
            Are you a brand or maker?{' '}
            <Link to="/brands" className="font-medium text-neutral-900 hover:underline">
              Learn about selling
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-500">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="underline">Terms</Link> and{' '}
          <Link to="/privacy" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;