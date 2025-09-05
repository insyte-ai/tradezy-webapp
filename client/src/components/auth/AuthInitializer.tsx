import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authInitialized } from '../../store/slices/authSlice';
import api from '../../services/api';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        
        if (accessToken && userId) {
          // Set the token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          try {
            // Fetch user profile
            const response = await api.get('/auth/profile');
            dispatch(authInitialized(response.data.user));
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // If profile fetch fails, clear auth state
            dispatch(authInitialized(null));
          }
        } else {
          // No stored auth, clear state
          dispatch(authInitialized(null));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch(authInitialized(null));
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (!isInitialized) {
    // Show loading screen while initializing
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;