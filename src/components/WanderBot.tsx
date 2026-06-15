'use client';

import React, { useState, useEffect } from 'react';
import LucideIcon from './LucideIcon';

const BOT_TIPS = [
  "Visit popular spots before 8am — crowds haven't arrived yet!",
  "Always carry some local cash. Card machines fail in unexpected places.",
  "Golden hour is the 30 min after sunrise and before sunset. Perfect for photos!",
  "Download offline maps before leaving wifi range. Lifesaver!",
  "Street food near local markets is usually the most authentic.",
  "Pack one outfit you can wear 3 different ways.",
  "Check weather 7 days ahead — not just tomorrow.",
  "Make a note of your accommodation address in the local language."
];

export default function WanderBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  // Cycle tips every 8 seconds when the popup is open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % BOT_TIPS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      // Pick a new tip when opening
      setTipIdx((prev) => (prev + 1) % BOT_TIPS.length);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="wanderbot" onClick={handleToggle}>
      <div className="bot-bubble" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LucideIcon name="Compass" size={32} color="white" />
      </div>
      <div className={`bot-popup ${isOpen ? 'show' : ''}`}>
        <div className="bot-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LucideIcon name="Globe" size={14} color="var(--orange)" /> WanderBot
        </div>
        <span id="bot-tip-text">{BOT_TIPS[tipIdx]}</span>
      </div>
    </div>
  );
}
