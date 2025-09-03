import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { categoryStructure, CategoryGroup, Category } from '../data/categoryStructure';

interface MobileCategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileCategoryMenu: React.FC<MobileCategoryMenuProps> = ({ isOpen, onClose }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-900">Categories</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg"
          >
            <XMarkIcon className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="p-4">
          {/* Quick Links */}
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <Link
              to="/products"
              className="block py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              onClick={onClose}
            >
              Browse All Products
            </Link>
            <Link
              to="/deals"
              className="block py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              onClick={onClose}
            >
              Today's Deals
            </Link>
            <Link
              to="/new"
              className="block py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              onClick={onClose}
            >
              New Arrivals
            </Link>
          </div>

          {/* Category Groups */}
          {categoryStructure.map((group) => (
            <div key={group.id} className="mb-2">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between py-3 text-left hover:bg-neutral-50 rounded-lg px-2"
              >
                <span className="text-sm font-medium text-neutral-900">{group.name}</span>
                {expandedGroups.has(group.id) ? (
                  <ChevronDownIcon className="h-4 w-4 text-neutral-400" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
                )}
              </button>

              {expandedGroups.has(group.id) && (
                <div className="ml-4 mt-1">
                  {group.categories.map((category) => (
                    <div key={category.id} className="mb-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between py-2 text-left hover:bg-neutral-50 rounded-lg px-2"
                      >
                        <span className="text-sm text-neutral-700">{category.name}</span>
                        {expandedCategories.has(category.id) ? (
                          <ChevronDownIcon className="h-4 w-4 text-neutral-400" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
                        )}
                      </button>

                      {expandedCategories.has(category.id) && (
                        <div className="ml-4 mt-1">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              to={`/categories/${group.id}/${category.id}/${subcategory.id}`}
                              className="block py-2 px-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded"
                              onClick={onClose}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileCategoryMenu;