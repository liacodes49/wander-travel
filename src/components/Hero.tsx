'use client';

import React, { useState, useEffect, useRef } from 'react';

interface HeroProps {
  onPlanTrip: (prompt: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  isDemo: boolean;
}

const CHIP_PATTERNS = [
  { re: /₹[\d,]+|rs\.?\s*\d+|\d+k\s*budget|\d[\d,]*\s*rupee/i, label: '💰 Budget' },
  { re: /\d+\s*days?|\d+\s*nights?/i, label: '📅 Duration' },
  { re: /beach|mountain|city|hill|desert|forest|backwater|temple|heritage/i, label: '🎯 Destination Type' },
  { re: /solo|couple|family|honeymoon|friends|group/i, label: '👥 Group Type' },
  { re: /food|foodi|eat|cuisine|restaurant|street food/i, label: '🍜 Food Lover' },
  { re: /photo|camera|instagram|photography/i, label: '📸 Photography' },
  { re: /adventure|trek|hiking|sport|camping/i, label: '🏕️ Adventure' },
  { re: /relax|peaceful|quiet|calm|spa|wellness/i, label: '🧘 Relaxation' },
  { re: /budget|cheap|backpack|economical|affordable/i, label: '💼 Budget Travel' },
  { re: /luxury|premium|5\s*star|resort|suite/i, label: '✨ Luxury' }
];

export default function Hero({ onPlanTrip, inputRef, isDemo }: HeroProps) {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Update chips automatically when input changes
  useEffect(() => {
    const activeChips = new Set<string>();
    CHIP_PATTERNS.forEach((pattern) => {
      if (pattern.re.test(inputValue)) {
        activeChips.add(pattern.label);
      }
    });
    setChips(Array.from(activeChips));
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (error) setError('');
  };

  const handleExampleClick = (text: string) => {
    setInputValue(text);
    if (error) setError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePlanClick = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Please describe your dream trip first!');
      return;
    }
    onPlanTrip(trimmed);
  };

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-pattern"></div>
      <div className="plane-fly">✈️</div>

      {/* Floating city info cards */}
      <div className="float-card fc1">
        <div className="fc-emoji">🇹🇭</div>
        <div className="fc-name">Bangkok</div>
        <div className="fc-sub">3.2k travelers</div>
      </div>
      <div className="float-card fc2">
        <div className="fc-emoji">🇮🇹</div>
        <div className="fc-name">Rome</div>
        <div className="fc-sub">5.1k travelers</div>
      </div>
      <div className="float-card fc3">
        <div className="fc-emoji">🇯🇵</div>
        <div className="fc-name">Tokyo</div>
        <div className="fc-sub">4.8k travelers</div>
      </div>
      <div className="float-card fc4">
        <div className="fc-emoji">🇲🇻</div>
        <div className="fc-name">Maldives</div>
        <div className="fc-sub">2.9k travelers</div>
      </div>

      <div className="hero-content">
        <div className="hero-stamp">✈ AI Travel Planner</div>
        <h1>Where will your<br /><em>next story begin?</em></h1>
        <p className="hero-sub">Describe your dream and let AI craft the perfect journey.</p>

        <div className="input-box">
          <textarea
            ref={inputRef}
            id="trip-input"
            placeholder="I have ₹60,000 and 5 days. I love beaches, photography, local food and hidden places..."
            rows={4}
            value={inputValue}
            onChange={handleInputChange}
          ></textarea>
          
          <div className="chips-row" id="chips-row">
            {chips.map((chip, idx) => (
              <div key={idx} className="chip">
                {chip}
              </div>
            ))}
          </div>
          
          <div className="divider"></div>
          <button className="plan-btn" id="plan-btn" onClick={handlePlanClick}>
            ✈ Plan My Journey
          </button>
          
          {error && <div className="error-msg" id="error-msg">{error}</div>}
          
          {isDemo && (
            <div className="demo-indicator">
              <span>💡</span>
              <div>
                <strong>Demo Mode Active:</strong> Add your Gemini API key in <code>.env.local</code> to unlock unlimited live AI plans! Currently simulating beautiful mock trips.
              </div>
            </div>
          )}
        </div>

        <div className="examples">
          <div
            className="example-pill"
            onClick={() =>
              handleExampleClick(
                'I have ₹40,000 and 4 days. Solo trip to mountains, love trekking and local food.'
              )
            }
          >
            🏔️ Mountain solo trek
          </div>
          <div
            className="example-pill"
            onClick={() =>
              handleExampleClick(
                'Honeymoon trip for 2 with budget ₹1,20,000 for 7 days. Love beaches and luxury stays.'
              )
            }
          >
            💑 Romantic honeymoon
          </div>
          <div
            className="example-pill"
            onClick={() =>
              handleExampleClick(
                'Family trip with 2 kids, 6 days, budget ₹80,000. Want historical places and good food.'
              )
            }
          >
            👨‍👩‍👧 Family adventure
          </div>
        </div>
      </div>
    </section>
  );
}
