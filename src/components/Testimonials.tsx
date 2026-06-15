'use client';

import React from 'react';

const TESTIMONIALS_DATA = [
  {
    text: 'This planned my entire Bali trip in under 3 minutes. I was genuinely amazed by the level of detail.',
    stars: '★★★★★',
    author: '— Priya M., Mumbai'
  },
  {
    text: 'The hidden gems section took me to a waterfall no guidebook had ever mentioned. Absolutely magical.',
    stars: '★★★★★',
    author: '— Rahul K., Delhi'
  },
  {
    text: 'Felt like having a well-traveled local friend in every city. The food recommendations were spot on!',
    stars: '★★★★★',
    author: '— Ananya S., Bangalore'
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-inner">
        <div className="section-header">
          <h2>From the road 🗺️</h2>
          <p className="cursive">stories from fellow wanderers</p>
        </div>
        <div className="test-grid">
          {TESTIMONIALS_DATA.map((test, idx) => (
            <div key={idx} className="test-card">
              <p>{test.text}</p>
              <div className="test-stars">{test.stars}</div>
              <div className="test-author">{test.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
