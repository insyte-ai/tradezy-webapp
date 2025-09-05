import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AppDispatch, RootState } from '../store';
import { fetchCategoryHierarchy } from '../store/slices/categorySlice';

const CategoryMenu: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { hierarchy, loading } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    // Only fetch if we don't have hierarchy data already
    if (!hierarchy || hierarchy.length === 0) {
      dispatch(fetchCategoryHierarchy());
    }
  }, [dispatch, hierarchy]);

  if (loading) {
    return (
      <nav className="relative">
        <div className="flex items-center space-x-8 py-6">
          <div className="h-4 bg-neutral-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded w-20 animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="relative">
      {/* Main horizontal category bar */}
      <div className="flex items-center space-x-8">
        {hierarchy && hierarchy.map((category) => (
          <div
            key={category._id}
            className="relative"
            onMouseEnter={() => setActiveGroup(category._id)}
            onMouseLeave={() => setActiveGroup(null)}
          >
            <Link 
              to={`/categories/${category.slug}`}
              className="flex items-center space-x-1 text-sm text-neutral-700 hover:text-neutral-900 py-6 border-b-2 border-transparent hover:border-neutral-900 transition-all"
            >
              <span>{category.name}</span>
              {category.categories && category.categories.length > 0 && (
                <ChevronDownIcon className="h-3 w-3" />
              )}
            </Link>

            {/* Dropdown Menu */}
            {activeGroup === category._id && category.categories && category.categories.length > 0 && (
              <div className="absolute left-0 top-full -mt-px bg-white shadow-lg border border-neutral-200 rounded-b-lg z-50 min-w-[600px]">
                <div className="grid grid-cols-3 gap-6 p-6">
                  {category.categories.map((subCategory) => (
                    <div key={subCategory._id}>
                      <Link
                        to={`/categories/${subCategory.slug}`}
                        className="font-medium text-sm text-neutral-900 hover:text-primary-600 block mb-3"
                      >
                        {subCategory.name}
                      </Link>
                      {subCategory.subcategories && subCategory.subcategories.length > 0 && (
                        <ul className="space-y-2">
                          {subCategory.subcategories.slice(0, 4).map((sub) => (
                            <li key={sub._id}>
                              <Link
                                to={`/categories/${sub.slug}`}
                                className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* View all link */}
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50">
                  <Link
                    to={`/categories/${category.slug}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View all {category.name} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Additional menu items */}
        <Link to="/products" className="text-sm text-neutral-700 hover:text-neutral-900 py-6">
          All Products
        </Link>
        <Link to="/stores" className="text-sm text-neutral-700 hover:text-neutral-900 py-6">
          Stores
        </Link>
        <Link to="/new" className="text-sm text-neutral-700 hover:text-neutral-900 py-6">
          New
        </Link>
      </div>
    </nav>
  );
};

export default CategoryMenu;