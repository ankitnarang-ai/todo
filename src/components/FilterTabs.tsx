import React from 'react';
import { FilterType } from '../types/todo';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange, counts }) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeFilter === filter.key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};
