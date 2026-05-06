import React from 'react';
import { Clock, Building2, ChevronRight, Star, MapPin } from 'lucide-react';
import './ItemCard.css';

export function ItemCard({ item }) {
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
  );
}
