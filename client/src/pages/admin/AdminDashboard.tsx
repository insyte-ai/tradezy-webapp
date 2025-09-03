import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-secondary-600">Total Users</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </div>
        <div className="card">
          <div className="text-sm text-secondary-600">Pending Approvals</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </div>
        <div className="card">
          <div className="text-sm text-secondary-600">Total Products</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </div>
        <div className="card">
          <div className="text-sm text-secondary-600">Total Orders</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <p className="text-secondary-600">No recent registrations</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Platform Activity</h2>
          <p className="text-secondary-600">No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;