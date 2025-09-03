import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserStatus } from '../../types/user';

const BuyerDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Buyer Dashboard</h1>
      
      {user?.status === UserStatus.PENDING && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-1">Account Pending Approval</h3>
          <p>Your buyer account is currently pending admin approval. Once approved, you'll be able to view wholesale prices and place orders.</p>
        </div>
      )}

      {user?.status === UserStatus.APPROVED && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="text-sm text-secondary-600">Total Orders</div>
              <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
            </div>
            <div className="card">
              <div className="text-sm text-secondary-600">Pending Orders</div>
              <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
            </div>
            <div className="card">
              <div className="text-sm text-secondary-600">Total Spent</div>
              <div className="text-3xl font-bold text-primary-600 mt-2">$0</div>
            </div>
            <div className="card">
              <div className="text-sm text-secondary-600">Active RFQs</div>
              <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
              <p className="text-secondary-600">No orders yet</p>
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Saved Suppliers</h2>
              <p className="text-secondary-600">No saved suppliers</p>
            </div>
          </div>
        </>
      )}

      {user?.status === UserStatus.REJECTED && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-1">Account Rejected</h3>
          <p>Your buyer account application has been rejected. Please contact support for more information.</p>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;