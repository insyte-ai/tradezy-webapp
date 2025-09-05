import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRole } from '../types/user';

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      case UserRole.SELLER:
        return <Navigate to="/seller" replace />;
      case UserRole.BUYER:
        return <Navigate to="/buyer" replace />;
      default:
        return <>{children}</>;
    }
  }

  // If not authenticated, render children (homepage)
  return <>{children}</>;
};

export default AuthRedirect;