import React from 'react';
import ModernDashboardLayout from '../components/dashboard/ModernDashboardLayout';

interface DashboardLayoutProps {
  role: 'admin' | 'seller' | 'buyer';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  return <ModernDashboardLayout role={role} />;
};

export default DashboardLayout;