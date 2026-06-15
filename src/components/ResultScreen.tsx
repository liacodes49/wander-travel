'use client';

import React, { useState } from 'react';

interface Budget {
  flights?: string;
  hotels?: string;
  food?: string;
  transport?: string;
  activities?: string;
  shopping?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
}

interface FoodItem {
  name: string;
  emoji: string;
  description: string;
}

interface HiddenGem {
  name: string;
  emoji: string;
  tip: string;
}

interface TravelPlan {
  destination: string;
  country?: string;
  tagline?: string;
  weather?: string;
  best_season?: string;
  currency?: string;
  language?: string;
  fun_fact?: string;
  total_budget?: string;
  budget?: Budget;
  itinerary?: ItineraryDay[];
  food?: FoodItem[];
  hidden_gems?: HiddenGem[];
  packing?: string[];
  tips?: string[];
}

interface ResultScreenProps {
  data: TravelPlan | null;
  onBack: () => void;
}

const BUDGET_ICONS: Record<string, string> = {
  flights: '✈️',
  hotels: '🏨',
  food: '🍜',
  transport: '🚌',
  activities: '🎭',
  shopping: '🛍️'
};

export default function ResultScreen({ data, onBack }: ResultScreenProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!data) return null;

  const togglePackItem = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div id="result-screen">
      <div className="result-inner">
        <button className="back-btn" onClick={onBack}>
          ← Plan Another Trip
        </button>

        {/* DESTINATION HERO HEADER */}
        <div className="dest-hero animate-in">
          <div className="dest-stamp">
            🌍<br />Wander<br />The<br />World
          </div>
          <h2>{data.destination || 'Your Dream Destination'}</h2>
          <p className="tagline">"{data.tagline || 'An unforgettable adventure awaits'}"</p>
          
          <div className="dest-meta">
            {data.country && (
              <div className="dest-badge">
                <strong>Country</strong>
                {data.country}
              </div>
            )}
            {data.weather && (
              <div className="dest-badge">
                <strong>Weather</strong>
                {data.weather}
              </div>
            )}
            {data.best_season && (
              <div className="dest-badge">
                <strong>Best Season</strong>
                {data.best_season}
              </div>
            )}
            {data.currency && (
              <div className="dest-badge">
                <strong>Currency</strong>
                {data.currency}
              </div>
            )}
            {data.language && (
              <div className="dest-badge">
                <strong>Language</strong>
                {data.language}
              </div>
            )}
            {data.total_budget && (
              <div className="dest-badge">
                <strong>Total Budget</strong>
                {data.total_budget}
              </div>
            )}
          </div>
          
          {data.fun_fact && <p className="dest-funfact">✨ {data.fun_fact}</p>}
        </div>

        {/* BUDGET BREAKDOWN */}
        {data.budget && Object.keys(data.budget).length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title">
              <span className="ico">💰</span> Budget Breakdown
            </h2>
            <div className="budget-grid">
              {Object.entries(data.budget).map(([key, value]) => (
                <div key={key} className="budget-card">
                  <span className="b-icon">{BUDGET_ICONS[key] || '💰'}</span>
                  <div className="b-amount">{value}</div>
                  <div className="b-label">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ITINERARY */}
        {data.itinerary && data.itinerary.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title">
              <span className="ico">🗓️</span> Day-by-Day Itinerary
            </h2>
            {data.itinerary.map((day, idx) => (
              <div key={idx} className="day-card animate-in">
                <div className="day-header">
                  <div className="day-num">D{day.day}</div>
                  <div className="day-title-text">{day.title || `Day ${day.day}`}</div>
                </div>
                {day.morning && (
                  <div className="time-slot">
                    <span className="time-label">Morning</span>
                    <span className="time-activity">{day.morning}</span>
                  </div>
                )}
                {day.afternoon && (
                  <div className="time-slot">
                    <span className="time-label">Afternoon</span>
                    <span className="time-activity">{day.afternoon}</span>
                  </div>
                )}
                {day.evening && (
                  <div className="time-slot">
                    <span className="time-label">Evening</span>
                    <span className="time-activity">{day.evening}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FOOD */}
        {data.food && data.food.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title">
              <span className="ico">🍜</span> Must-Try Food
            </h2>
            <div className="card-grid">
              {data.food.map((dish, idx) => (
                <div key={idx} className="food-card animate-in">
                  <span className="card-emoji">{dish.emoji || '🍽️'}</span>
                  <h4>{dish.name}</h4>
                  <p>{dish.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HIDDEN GEMS */}
        {data.hidden_gems && data.hidden_gems.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title">
              <span className="ico">💎</span> Hidden Gems
            </h2>
            <div className="card-grid">
              {data.hidden_gems.map((gem, idx) => (
                <div key={idx} className="gem-card animate-in">
                  <span className="card-emoji">{gem.emoji || '💎'}</span>
                  <h4>{gem.name}</h4>
                  <p>{gem.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PACKING LIST */}
        {data.packing && data.packing.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title">
              <span className="ico">🎒</span> Packing List
            </h2>
            <div className="packing-grid">
              {data.packing.map((item, idx) => (
                <div
                  key={idx}
                  className={`pack-item ${checkedItems[idx] ? 'checked' : ''}`}
                  onClick={() => togglePackItem(idx)}
                >
                  <input
                    type="checkbox"
                    id={`cb-${idx}`}
                    checked={!!checkedItems[idx]}
                    onChange={() => {}} // Controlled via onClick on container
                    onClick={(e) => e.stopPropagation()} // Stop propagation to container double-toggle
                  />
                  <label htmlFor={`cb-${idx}`}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSIDER TIPS */}
        {data.tips && data.tips.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title">
              <span className="ico">💡</span> Insider Tips
            </h2>
            <div className="card-grid">
              {data.tips.map((tip, idx) => (
                <div key={idx} className="tip-card animate-in">
                  <p>💡 {tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
