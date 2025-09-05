import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../services/productService';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  showPrice?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, showPrice = false }) => {
  const renderRating = () => {
    const rating = product.ratings?.average || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-neutral-300" />
        );
      }
    }
    
    return stars;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <Link
        to={`/products/${product.slug}`}
        className="flex bg-white rounded-lg border border-neutral-200 hover:shadow-lg transition-shadow overflow-hidden"
      >
        {/* Image */}
        <div className="w-48 h-48 flex-shrink-0">
          <img
            src={product.images?.[0] || '/placeholder-product.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
            <span className="font-medium text-primary-600">{product.brand}</span>
            <span>MOQ: {product.specifications?.moq || 1} units</span>
            <span>{product.specifications?.leadTime || 'Contact for lead time'}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderRating()}
              </div>
              {product.ratings?.count > 0 && (
                <span className="text-xs text-neutral-500">
                  ({product.ratings.count})
                </span>
              )}
            </div>

            {showPrice && product.basePrice?.wholesale && (
              <div className="text-right">
                <div className="text-xl font-bold text-neutral-900">
                  {formatPrice(product.basePrice.wholesale)}
                </div>
                <div className="text-xs text-neutral-500">per unit</div>
              </div>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-white rounded-lg border border-neutral-200 hover:shadow-lg transition-shadow overflow-hidden group"
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-neutral-100">
        <img
          src={product.images?.[0] || '/placeholder-product.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.tags?.includes('bestseller') && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
            Bestseller
          </span>
        )}
        {product.tags?.includes('new') && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
            New
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary-600">
            {product.brand}
          </span>
        </div>
        
        <h3 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {renderRating()}
          </div>
          {product.ratings?.count > 0 && (
            <span className="text-xs text-neutral-500">
              ({product.ratings.count})
            </span>
          )}
        </div>

        <div className="text-xs text-neutral-600 space-y-1 mb-3">
          <div>MOQ: {product.specifications?.moq || 1} units</div>
          <div>{product.specifications?.leadTime || 'Contact for lead time'}</div>
        </div>

        {showPrice && product.basePrice?.wholesale ? (
          <div className="pt-3 border-t border-neutral-100">
            <div className="text-lg font-bold text-neutral-900">
              {formatPrice(product.basePrice.wholesale)}
            </div>
            <div className="text-xs text-neutral-500">per unit</div>
          </div>
        ) : !showPrice && (
          <div className="pt-3 border-t border-neutral-100">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Sign in for price
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;