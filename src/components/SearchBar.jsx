import React from 'react';
import { Search, Bell, User, GraduationCap } from 'lucide-react';
import './SearchBar.css';

export function SearchBar({ searchQuery, setSearchQuery, locationFilter, setLocationFilter, locations = [] }) {
  return (
    <header className="top-nav">
      <div className="container nav-container">
        <div className="logo">
          <GraduationCap size={28} color="var(--brand-primary)" />
          <span>NexTrack</span>
        </div>
        
        <div className="search-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search opportunities..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="location-select" 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)',
              height: '100%'
            }}
          >
            <option value="">All Locations</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="nav-actions">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <button className="icon-btn">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
