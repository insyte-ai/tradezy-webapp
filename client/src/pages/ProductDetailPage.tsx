import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProductBySlug } from '../store/slices/productSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import slugify from 'slugify';
import { 
  ShoppingCartIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  CubeIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { currentProduct: product, isLoading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/auth/login');
      return;
    }
    
    // TODO: Implement add to cart functionality
    toast.success('Added to cart!');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-5 w-5 text-neutral-300" />
        )
      );
    }
    return stars;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-neutral-600 mb-4">{error || 'Product not found'}</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-700">
          Back to Products
        </Link>
      </div>
    );
  }

  const minOrderQty = product.specifications?.moq || 1;

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="text-sm breadcrumb mb-6">
        <Link to="/" className="text-neutral-500 hover:text-neutral-700">Home</Link>
        <span className="mx-2 text-neutral-400">/</span>
        {product.category && (
          <>
            <Link 
              to={`/categories/${product.category.slug}`}
              className="text-neutral-500 hover:text-neutral-700"
            >
              {product.category.name}
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
          </>
        )}
        <span className="text-neutral-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div>
          <div className="mb-4">
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || '/placeholder-product.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-neutral-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          {/* Brand */}
          {product.brand && (
            <Link
              to={`/brands/${slugify(product.brand, { lower: true, strict: true })}`}
              className="inline-block text-sm font-medium text-primary-600 hover:text-primary-700 mb-2"
            >
              {product.brand}
            </Link>
          )}
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">{product.name}</h1>
          
          {/* Ratings */}
          {product.ratings && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.ratings.average)}</div>
              <span className="text-sm text-neutral-600">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>
          )}
          
          {/* Price */}
          {isAuthenticated && product.basePrice ? (
            <div className="mb-6">
              <div className="text-3xl font-bold text-neutral-900">
                AED {product.basePrice.wholesale}
              </div>
              <p className="text-sm text-neutral-600">Per unit (Min. order: {minOrderQty} units)</p>
            </div>
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
              <p className="text-neutral-700 mb-2">Login to view wholesale prices</p>
              <Link 
                to="/auth/login" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in or Register
              </Link>
            </div>
          )}
          
          {/* Description */}
          <div className="mb-6">
            <p className="text-neutral-700 leading-relaxed">{product.description}</p>
          </div>
          
          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span className="text-neutral-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Specifications */}
          {product.specifications && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <CubeIcon className="h-5 w-5 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Min. Order</p>
                  <p className="font-medium text-neutral-900">{minOrderQty} units</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Lead Time</p>
                  <p className="font-medium text-neutral-900">
                    {product.specifications.leadTime || 'Contact supplier'}
                  </p>
                </div>
              </div>
              
              {product.shipping && (
                <>
                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-5 w-5 text-neutral-500" />
                    <div>
                      <p className="text-xs text-neutral-500">Shipping</p>
                      <p className="font-medium text-neutral-900">
                        {product.shipping.freeShipping ? 'Free Shipping' : 'Standard Rates'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5 text-neutral-500" />
                    <div>
                      <p className="text-xs text-neutral-500">Warranty</p>
                      <p className="font-medium text-neutral-900">
                        {product.specifications.warranty || 'Manufacturer warranty'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Add to Cart Section */}
          {isAuthenticated && (
            <div className="bg-neutral-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={minOrderQty}
                    step={minOrderQty}
                    value={quantity * minOrderQty}
                    onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) / minOrderQty)))}
                    className="w-24 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600"
                  />
                </div>
                
                {product.basePrice && (
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Total Price</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      AED {(product.basePrice.wholesale * quantity * minOrderQty).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          )}
          
          {/* Store Info */}
          {product.store && (
            <div className="border-t border-neutral-200 pt-6">
              <div className="flex items-center gap-4">
                <BuildingStorefrontIcon className="h-8 w-8 text-neutral-500" />
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900">{product.store.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      {renderStars(product.store.ratings?.average || 0)}
                      <span className="text-xs text-neutral-500 ml-1">
                        ({product.store.ratings?.count || 0})
                      </span>
                    </div>
                    <Link
                      to={`/stores/${product.store.slug}`}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View Store
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;