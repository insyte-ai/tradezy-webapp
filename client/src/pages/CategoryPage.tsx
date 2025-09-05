import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchCategoryBySlug,
  clearCurrentCategory
} from '../store/slices/categorySlice';
import {
  fetchProductsByCategory,
  fetchFilterOptions,
  setFilters,
  clearFilters,
  setSort,
  setViewMode,
  setPage
} from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  ViewColumnsIcon, 
  Squares2X2Icon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { currentCategory, subcategories, loading: categoryLoading } = useSelector(
    (state: RootState) => state.categories
  );
  const { 
    products, 
    filters, 
    filterOptions,
    pagination, 
    isLoading: productsLoading,
    viewMode 
  } = useSelector((state: RootState) => state.products);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (slug) {
      // Fetch category details
      dispatch(fetchCategoryBySlug(slug));
      // Fetch filter options for this category
      dispatch(fetchFilterOptions(slug));
      // Clear previous filters
      dispatch(clearFilters());
    }

    return () => {
      dispatch(clearCurrentCategory());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (slug) {
      // Fetch products whenever filters change
      dispatch(fetchProductsByCategory({ 
        categorySlug: slug, 
        filters 
      }));
    }
  }, [dispatch, slug, filters]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSort(e.target.value));
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    dispatch(setViewMode(mode));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (categoryLoading || !currentCategory) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-custom py-8">
      {/* Category Header */}
      <div className="mb-8">
        <nav className="text-sm breadcrumb mb-4">
          <a href="/" className="text-neutral-500 hover:text-neutral-700">Home</a>
          <span className="mx-2 text-neutral-400">/</span>
          <span className="text-neutral-900">{currentCategory.name}</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          {currentCategory.name}
        </h1>
        {currentCategory.description && (
          <p className="text-neutral-600 max-w-3xl">
            {currentCategory.description}
          </p>
        )}
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Subcategories</h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <a
                key={sub._id}
                href={`/categories/${sub.slug}`}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
              >
                {sub.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Filters
          </button>
          <p className="text-sm text-neutral-600">
            {pagination.total} products found
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={filters.sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="basePrice.wholesale">Price: Low to High</option>
            <option value="-basePrice.wholesale">Price: High to Low</option>
            <option value="-ratings.average">Highest Rated</option>
          </select>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-neutral-200 rounded-lg">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100' : ''}`}
              title="Grid view"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-neutral-100' : ''}`}
              title="List view"
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            filterOptions={filterOptions}
            currentFilters={filters}
            onFilterChange={(key, value) => 
              dispatch(setFilters({ [key]: value }))
            }
            onClearFilters={() => dispatch(clearFilters())}
          />
        </aside>

        {/* Products Grid/List */}
        <div className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-neutral-200 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">No products found matching your criteria.</p>
              <button
                onClick={() => dispatch(clearFilters())}
                className="mt-4 text-primary-600 hover:text-primary-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                    showPrice={isAuthenticated}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 border border-neutral-200 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            pageNum === pagination.page
                              ? 'bg-primary-600 text-white'
                              : 'border border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {pagination.pages > 5 && (
                      <span className="px-2">...</span>
                    )}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-2 border border-neutral-200 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" 
            onClick={() => setShowMobileFilters(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                ✕
              </button>
            </div>
            <div className="p-4">
              <ProductFilters
                filterOptions={filterOptions}
                currentFilters={filters}
                onFilterChange={(key, value) => 
                  dispatch(setFilters({ [key]: value }))
                }
                onClearFilters={() => dispatch(clearFilters())}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;