import React from 'react';

const SellerDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-secondary-600">Total Products</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </div>
        <div className="card">
          <div className="text-sm text-secondary-600">Active Orders</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </div>
        <div className="card">
          <div className="text-sm text-secondary-600">Total Revenue</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">$0</div>
        </div>
        <div className="card">
          <div className="text-sm text-secondary-600">Pending RFQs</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <p className="text-secondary-600">No orders yet</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
          <p className="text-secondary-600">All products are well stocked</p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;