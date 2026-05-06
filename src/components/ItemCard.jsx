import React from 'react';
import { Clock, Building2, ChevronRight, Star, MapPin, Bell } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './ItemCard.css';

export function ItemCard({ item, isSubscribed }) {
  const { user } = useUser();
  const isExpired = item.daysLeft === 'Expired';
  const isUrgent = !isExpired && typeof item.daysLeft === 'number' && item.daysLeft <= 5;
  const isTopRated = item.rating > 4.5;
  const formattedValue = item.value ? item.value : 'Variable';
  const hasPrize = item.value && item.value.toString().trim() !== '' && item.value.toString() !== '0';
  const isScholarship = item.category && item.category.toLowerCase() === 'scholarship';

  return (
    <div className={`item-card ${isTopRated ? 'top-rated' : ''}`}>
      <div className="card-badges">
        {isTopRated && (
          <div className="badge badge-top">
            <Star size={12} fill="currentColor" /> Top Rated
          </div>
        )}
        {hasPrize && <div className="badge badge-prize">Prize</div>}
        {isScholarship && <div className="badge badge-grant">Grant</div>}
        {isSubscribed && <div className="badge badge-interested" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>Interested</div>}
      </div>
      
      <div className="card-header">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-provider">
          <Building2 size={16} />
          <span>{item.organization || item.provider || 'Opportunity'}</span>
          {item.location && (
            <span style={{ marginLeft: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} /> {item.location}
            </span>
          )}
        </div>
      </div>

      <div className="card-metrics">
        <div className="metric">
          <span className="metric-label">Value</span>
          <div>
            <span className="value-badge">{formattedValue}</span>
          </div>
        </div>
        
        <div className="metric" style={{ alignItems: 'flex-end' }}>
          <span className="metric-label">Community</span>
          <span className="metric-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {item.rating} <Star size={14} fill="var(--gold-color)" color="var(--gold-color)" />
          </span>
        </div>
      </div>

      <div className="card-footer">
        <div 
          className={`status-badge ${isUrgent ? 'urgent' : ''}`}
          style={isExpired ? { backgroundColor: '#f3f4f6', color: '#6b7280' } : {}}
        >
          <Clock size={14} />
          {isExpired ? 'Expired' : typeof item.daysLeft === 'number' ? `${item.daysLeft} days left` : 'Unknown'}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="icon-btn" 
            style={{ color: isSubscribed ? 'var(--brand-primary)' : 'var(--text-secondary)' }}
            onClick={async () => {
              if (!user) {
                alert("Please log in to save opportunities.");
                return;
              }
              const subsRef = collection(db, 'user_subscriptions');
              if (isSubscribed) {
                const q = query(subsRef, where('uid', '==', user.uid), where('opportunityId', '==', item.id));
                const snapshot = await getDocs(q);
                snapshot.docs.forEach(d => deleteDoc(d.ref));
              } else {
                await addDoc(subsRef, {
                  uid: user.uid,
                  opportunityId: item.id,
                  createdAt: new Date()
                });
              }
            }}
          >
            <Bell size={18} fill={isSubscribed ? 'currentColor' : 'none'} />
          </button>
          
          <button 
            className="btn-details"
            onClick={() => {
              if (item.link) {
                window.open(item.link, '_blank');
              } else {
                alert('No registration link available.');
              }
            }}
          >
            Details <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
