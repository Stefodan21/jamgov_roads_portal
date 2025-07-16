import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DocumentFilters = ({ 
  onFilterChange, 
  onSortChange, 
  onViewModeChange,
  currentFilters = {},
  viewMode = 'grid'
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'identification', label: 'Identification' },
    { value: 'permits', label: 'Permits & Licenses' },
    { value: 'plans', label: 'Plans & Blueprints' },
    { value: 'photos', label: 'Photos' },
    { value: 'other', label: 'Other Documents' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'processed', label: 'Processed' },
    { value: 'failed', label: 'Failed' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'size-desc', label: 'Largest First' },
    { value: 'size-asc', label: 'Smallest First' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFilterChange({ ...currentFilters, search: value });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.category && currentFilters.category !== 'all') count++;
    if (currentFilters.status && currentFilters.status !== 'all') count++;
    if (currentFilters.search) count++;
    if (currentFilters.dateRange) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              iconName="Grid3X3"
              iconSize={16}
              onClick={() => onViewModeChange('grid')}
              className="px-3"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              iconName="List"
              iconSize={16}
              onClick={() => onViewModeChange('list')}
              className="px-3"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={isFilterOpen ? 'default' : 'outline'}
            iconName="Filter"
            iconPosition="left"
            iconSize={16}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="relative"
          >
            Filters
            {getActiveFilterCount() > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {getActiveFilterCount()}
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4 animate-slide-down">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <select
                value={currentFilters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Status
              </label>
              <select
                value={currentFilters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Sort By
              </label>
              <select
                value={currentFilters.sort || 'date-desc'}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Upload Date
              </label>
              <select
                value={currentFilters.dateRange || 'all'}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* File Size Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                File Size Range
              </label>
              <select
                value={currentFilters.sizeRange || 'all'}
                onChange={(e) => handleFilterChange('sizeRange', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (&lt; 1MB)</option>
                <option value="medium">Medium (1-10MB)</option>
                <option value="large">Large (&gt; 10MB)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                File Type
              </label>
              <select
                value={currentFilters.fileType || 'all'}
                onChange={(e) => handleFilterChange('fileType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF Documents</option>
                <option value="image">Images (JPG, PNG)</option>
                <option value="document">Word Documents</option>
                <option value="spreadsheet">Spreadsheets</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentFilters.search && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <Icon name="Search" size={12} />
              <span>Search: "{currentFilters.search}"</span>
              <button
                onClick={() => handleFilterChange('search', '')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
          
          {currentFilters.category && currentFilters.category !== 'all' && (
            <div className="flex items-center space-x-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
              <Icon name="Tag" size={12} />
              <span>{categories.find(c => c.value === currentFilters.category)?.label}</span>
              <button
                onClick={() => handleFilterChange('category', 'all')}
                className="hover:bg-secondary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}

          {currentFilters.status && currentFilters.status !== 'all' && (
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
              <Icon name="CheckCircle" size={12} />
              <span>{statuses.find(s => s.value === currentFilters.status)?.label}</span>
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="hover:bg-accent/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentFilters;