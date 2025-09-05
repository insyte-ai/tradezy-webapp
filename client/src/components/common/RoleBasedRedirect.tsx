import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserRole } from '../../types/user';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case UserRole.ADMIN:
          navigate('/admin', { replace: true });
          break;
        case UserRole.SELLER:
          navigate('/seller', { replace: true });
          break;
        case UserRole.BUYER:
          navigate('/buyer', { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Only render children if not authenticated
  // This prevents the homepage flash before redirect
  if (isAuthenticated && user) {
    return null;
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;