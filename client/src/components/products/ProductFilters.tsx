import React, { useState } from 'react';
import { FilterOptions, ProductFilterParams } from '../../services/productService';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProductFiltersProps {
  filterOptions: FilterOptions | null;
  currentFilters: ProductFilterParams;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filterOptions,
  currentFilters,
  onFilterChange,
  onClearFilters
}) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    brand: true,
    price: true,
    moq: false,
    leadTime: false,
    tags: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    const newPriceFilter = {
      ...currentFilters.priceRange,
      [type]: numValue
    };
    
    // Only update if at least one value is set
    if (newPriceFilter.min !== undefined || newPriceFilter.max !== undefined) {
      onFilterChange('priceRange', newPriceFilter);
    } else {
      onFilterChange('priceRange', undefined);
    }
  };

  const handleMOQChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    const newMOQFilter = {
      ...currentFilters.moqRange,
      [type]: numValue
    };
    
    if (newMOQFilter.min !== undefined || newMOQFilter.max !== undefined) {
      onFilterChange('moqRange', newMOQFilter);
    } else {
      onFilterChange('moqRange', undefined);
    }
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = currentFilters.brands || [];
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange('brands', updatedBrands.length > 0 ? updatedBrands : undefined);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = currentFilters.tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFilterChange('tags', updatedTags.length > 0 ? updatedTags : undefined);
  };

  const hasActiveFilters = () => {
    return (
      currentFilters.brands?.length ||
      currentFilters.priceRange?.min !== undefined ||
      currentFilters.priceRange?.max !== undefined ||
      currentFilters.moqRange?.min !== undefined ||
      currentFilters.moqRange?.max !== undefined ||
      currentFilters.leadTime ||
      currentFilters.tags?.length
    );
  };

  if (!filterOptions) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <XMarkIcon className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Brand Filter */}
      {filterOptions.brands && filterOptions.brands.length > 0 && (
        <div className="border-b border-neutral-200 pb-4">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="text-sm font-medium text-neutral-900">Brand</span>
            {expandedSections.brand ? (
              <ChevronUpIcon className="h-4 w-4 text-neutral-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
            )}
          </button>
          
          {expandedSections.brand && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {filterOptions.brands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentFilters.brands?.includes(brand) || false}
                    onChange={() => handleBrandToggle(brand)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <span className="ml-2 text-sm text-neutral-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="border-b border-neutral-200 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="text-sm font-medium text-neutral-900">Price (AED)</span>
          {expandedSections.price ? (
            <ChevronUpIcon className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={currentFilters.priceRange?.min || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
              />
              <span className="text-neutral-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={currentFilters.priceRange?.max || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
              />
            </div>
            {filterOptions.priceRange && (
              <p className="text-xs text-neutral-500">
                Range: AED {filterOptions.priceRange.min} - {filterOptions.priceRange.max}
              </p>
            )}
          </div>
        )}
      </div>

      {/* MOQ Filter */}
      <div className="border-b border-neutral-200 pb-4">
        <button
          onClick={() => toggleSection('moq')}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="text-sm font-medium text-neutral-900">Min Order Qty</span>
          {expandedSections.moq ? (
            <ChevronUpIcon className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
          )}
        </button>
        
        {expandedSections.moq && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={currentFilters.moqRange?.min || ''}
                onChange={(e) => handleMOQChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
              />
              <span className="text-neutral-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={currentFilters.moqRange?.max || ''}
                onChange={(e) => handleMOQChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
              />
            </div>
            <p className="text-xs text-neutral-500">Units</p>
          </div>
        )}
      </div>

      {/* Lead Time Filter */}
      {filterOptions.leadTimes && filterOptions.leadTimes.length > 0 && (
        <div className="border-b border-neutral-200 pb-4">
          <button
            onClick={() => toggleSection('leadTime')}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="text-sm font-medium text-neutral-900">Lead Time</span>
            {expandedSections.leadTime ? (
              <ChevronUpIcon className="h-4 w-4 text-neutral-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
            )}
          </button>
          
          {expandedSections.leadTime && (
            <div className="mt-3 space-y-2">
              {filterOptions.leadTimes.map((leadTime) => (
                <label key={leadTime} className="flex items-center">
                  <input
                    type="radio"
                    checked={currentFilters.leadTime === leadTime}
                    onChange={() => onFilterChange('leadTime', leadTime)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700">{leadTime}</span>
                </label>
              ))}
              {currentFilters.leadTime && (
                <button
                  onClick={() => onFilterChange('leadTime', undefined)}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Clear lead time
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tags Filter */}
      {filterOptions.tags && filterOptions.tags.length > 0 && (
        <div className="pb-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="text-sm font-medium text-neutral-900">Tags</span>
            {expandedSections.tags ? (
              <ChevronUpIcon className="h-4 w-4 text-neutral-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
            )}
          </button>
          
          {expandedSections.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filterOptions.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    currentFilters.tags?.includes(tag)
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;