import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserStatus } from '../types/user';

const PendingApprovalBanner: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Only show banner if user status is PENDING
  if (!user || user.status !== UserStatus.PENDING) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg 
              className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Account Pending Approval
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Your account is under review. We'll notify you once approved (typically within 24-48 hours).
                You can browse products while waiting for approval.
              </p>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
              Under Review
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalBanner;