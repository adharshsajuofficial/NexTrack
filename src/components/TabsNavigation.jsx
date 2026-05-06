import React from 'react';
import './TabsNavigation.css';

export function TabsNavigation({ activeTab, setActiveTab }) {
  const tabs = ['All', 'For You', 'Scholarships', 'Internships', 'Hackathons', 'Exams'];

  return (
    <div className="container">
      <div className="tabs-container no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
