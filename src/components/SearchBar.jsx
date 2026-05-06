import React, { useState } from 'react';
import { Search, Bell, User, GraduationCap, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { LoginModal } from './LoginModal';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './SearchBar.css';

export function SearchBar({ searchQuery, setSearchQuery, locationFilter, setLocationFilter, locations = [] }) {
  const { user } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

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
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {user.phoneNumber ? user.phoneNumber.substring(user.phoneNumber.length - 2) : 'U'}
                </div>
              )}
              <button className="icon-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => setIsLoginModalOpen(true)}>
              <User size={20} />
            </button>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
}
