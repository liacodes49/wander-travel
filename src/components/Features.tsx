'use client';

import React from 'react';
import LucideIcon from './LucideIcon';

const FEATURES_DATA = [
  { icon: 'Plane', title: 'AI Itinerary', desc: 'Day-by-day plans perfectly tailored to your style, pace, and budget' },
  { icon: 'Coins', title: 'Budget Planner', desc: 'Smart breakdowns across flights, stays, food & activities' },
  { icon: 'Utensils', title: 'Food Explorer', desc: 'Local dishes, hidden cafes, street food secrets, and more' },
  { icon: 'Gem', title: 'Hidden Gems', desc: 'Off-the-beaten-path spots only seasoned travelers know about' },
  { icon: 'Briefcase', title: 'Packing Assistant', desc: 'Smart checklists based on destination, weather & activities' },
  { icon: 'BookOpen', title: 'Travel Journal', desc: 'Your entire trip saved as a beautiful, shareable scrapbook' }
];

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="features-inner">
        <div className="section-header">
          <h2>Everything you need</h2>
          <p className="cursive">handcrafted for every kind of wanderer</p>
        </div>
        <div className="feat-grid">
          {FEATURES_DATA.map((feat, idx) => (
            <div key={idx} className="feat-card">
              <span className="feat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <LucideIcon name={feat.icon} size={42} />
              </span>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
