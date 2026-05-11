import React, { useEffect, useRef } from 'react';
import { X, LayoutDashboard, CheckSquare, Sparkles, Bookmark, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose, user }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!user) return null;

  const handleLogout = () => {
    signOut(auth);
    onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <div className="sidebar-user-info">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="sidebar-avatar" />
            ) : (
              <div className="sidebar-avatar fallback">
                {user.phoneNumber ? user.phoneNumber.substring(user.phoneNumber.length - 2) : 'U'}
              </div>
            )}
            <div className="sidebar-user-details">
              <h4>{user.displayName || 'NexTrack User'}</h4>
              <p>{user.email || user.phoneNumber || ''}</p>
            </div>
          </div>
          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link active">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="#" className="sidebar-link">
            <CheckSquare size={18} /> Applied
          </a>
          <a href="#" className="sidebar-link">
            <Sparkles size={18} /> Recommended
          </a>
          <a href="#" className="sidebar-link">
            <Bookmark size={18} /> Shortlisted
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>
    </>
  );
}
