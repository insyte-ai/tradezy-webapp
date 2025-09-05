'use client';

import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import PendingApprovalBanner from '../PendingApprovalBanner';

interface ModernDashboardLayoutProps {
  role: 'admin' | 'seller' | 'buyer';
  children?: React.ReactNode;
}

const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({ role, children }) => {
  return (
    <div className="flex h-screen bg-neutral-50">
      <DashboardSidebar role={role} />
      <main className="flex-1 overflow-y-auto bg-neutral-50">
        <PendingApprovalBanner />
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default ModernDashboardLayout;