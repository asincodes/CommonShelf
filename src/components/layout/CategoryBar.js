'use client';
import React from 'react';

const categories = [
  'All',
  'Power Tools',
  'Hand Tools',
  'Gardening',
  'Cleaning',
  'Ladders',
];

export default function CategoryBar({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-16 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat || (cat === 'All' && selectedCategory === 'All Tools');
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat === 'All' ? 'All' : cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Tools' : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}