import React from 'react';

const ProductsPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="card hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="font-semibold">Product Name</h3>
            <p className="text-sm text-secondary-600 mt-1">Supplier Name</p>
            <p className="text-xs text-secondary-500 mt-2">Login to view prices</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;