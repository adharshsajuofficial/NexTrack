import React, { useState } from 'react';
import { ItemCard } from './ItemCard';
import './DashboardGrid.css';

export function DashboardGrid({ items, subscriptions = [] }) {
  const [sortBy, setSortBy] = useState('value'); // 'value' or 'rating'

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'value') {
      return b.value - a.value;
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className="container">
      <div className="dashboard-controls">
        <div className="results-count">
          Showing {items.length} opportunities
        </div>
        
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <div className="sort-toggle">
            <button 
              className={`sort-btn ${sortBy === 'value' ? 'active' : ''}`}
              onClick={() => setSortBy('value')}
            >
              Value
            </button>
            <button 
              className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
              onClick={() => setSortBy('rating')}
            >
              Rating
            </button>
          </div>
        </div>
      </div>

      {sortedItems.length > 0 ? (
        <div className="grid">
          {sortedItems.map(item => (
            <ItemCard key={item.id} item={item} isSubscribed={subscriptions.includes(item.id)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No items found in this category</h3>
          <p>Check back later for more opportunities.</p>
        </div>
      )}
    </div>
  );
}
