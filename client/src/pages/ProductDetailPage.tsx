import React from 'react';

const ProductDetailPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">Product Name</h1>
          <p className="text-secondary-600 mb-6">Product description goes here</p>
          <div className="card">
            <p className="text-lg font-semibold mb-2">Login to view wholesale prices</p>
            <button className="btn btn-primary w-full">Sign Up as Buyer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;