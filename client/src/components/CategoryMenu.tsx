import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { categoryStructure } from '../data/categoryStructure';

const CategoryMenu: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <nav className="relative">
      {/* Main horizontal category bar */}
      <div className="flex items-center space-x-8">
        {categoryStructure.map((group) => (
          <div
            key={group.id}
            className="relative"
            onMouseEnter={() => setActiveGroup(group.id)}
            onMouseLeave={() => setActiveGroup(null)}
          >
            <button className="flex items-center space-x-1 text-sm text-neutral-700 hover:text-neutral-900 py-6 border-b-2 border-transparent hover:border-neutral-900 transition-all">
              <span>{group.name}</span>
              <ChevronDownIcon className="h-3 w-3" />
            </button>

            {/* Dropdown Menu */}
            {activeGroup === group.id && (
              <div className="absolute left-0 top-full -mt-px bg-white shadow-lg border border-neutral-200 rounded-b-lg z-50 min-w-[800px]">
                <div className="grid grid-cols-4 gap-8 p-8">
                  {group.categories.map((category) => (
                    <div key={category.id}>
                      <h3 className="font-medium text-sm text-neutral-900 mb-3">
                        {category.name}
                      </h3>
                      <ul className="space-y-2">
                        {category.subcategories.slice(0, 6).map((sub) => (
                          <li key={sub.id}>
                            <Link
                              to={`/categories/${group.id}/${category.id}/${sub.id}`}
                              className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                        {category.subcategories.length > 6 && (
                          <li>
                            <Link
                              to={`/categories/${group.id}/${category.id}`}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              View all {category.name}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}

                  {/* Featured section */}
                  <div className="col-span-4 pt-6 mt-6 border-t border-neutral-100">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-6">
                        <Link
                          to={`/categories/${group.id}/new`}
                          className="text-sm font-medium text-neutral-900 hover:text-primary-600"
                        >
                          New brands
                        </Link>
                        <Link
                          to={`/categories/${group.id}/featured`}
                          className="text-sm font-medium text-neutral-900 hover:text-primary-600"
                        >
                          Featured products
                        </Link>
                      </div>
                      <Link
                        to={`/categories/${group.id}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        All {group.name} Products →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Additional static menu items */}
        <Link to="/featured" className="text-sm text-neutral-700 hover:text-neutral-900 py-6">
          Featured
        </Link>
        <Link to="/new" className="text-sm text-neutral-700 hover:text-neutral-900 py-6">
          New
        </Link>
      </div>
    </nav>
  );
};

export default CategoryMenu;