'use client';

import React from 'react';

interface NavbarProps {
  onNavigate: (page: 'home' | 'quiz' | 'result') => void;
  onPlanTripClick: () => void;
}

export default function Navbar({ onNavigate, onPlanTripClick }: NavbarProps) {
  return (
    <nav>
      <div className="nav-logo" onClick={() => onNavigate('home')}>
        Wander<span>.</span>
      </div>
      <div className="nav-links">
        <a onClick={() => onNavigate('home')}>Home</a>
        <a onClick={() => onNavigate('quiz')}>Travel Quiz</a>
        <a href="#features">Features</a>
        <a className="nav-btn" onClick={onPlanTripClick}>
          Plan a Trip
        </a>
      </div>
    </nav>
  );
}
