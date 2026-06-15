'use client';

import React, { useState } from 'react';
import LucideIcon from './LucideIcon';

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
  icon: string;
  description: string;
}

interface HiddenGem {
  name: string;
  icon: string;
  tip?: string;
  description?: string;
}

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  price: string;
  departure: string;
  duration: string;
  stops: string;
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
  flights?: FlightOption[];
}

interface ResultScreenProps {
  data: TravelPlan | null;
  onBack: () => void;
}

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
        <button className="back-btn" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <LucideIcon name="ArrowLeft" size={16} /> Plan Another Trip
        </button>

        {/* DESTINATION HERO HEADER */}
        <div className="dest-hero animate-in">
          <div className="dest-stamp">
            <LucideIcon name="Globe" size={24} color="var(--yellow)" style={{ marginBottom: '4px' }} />
            Wander<br />The<br />World
          </div>
          <h2>{data.destination || 'Your Dream Destination'}</h2>
          <p className="tagline">"{data.tagline || 'An unforgettable adventure awaits'}"</p>
          
          <div className="dest-meta">
            {data.country && (
              <div className="dest-badge">
                <strong>Country</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LucideIcon name="MapPin" size={12} color="var(--yellow)" />
                  {data.country}
                </span>
              </div>
            )}
            {data.weather && (
              <div className="dest-badge">
                <strong>Weather</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LucideIcon name="CloudSun" size={12} color="var(--yellow)" />
                  {data.weather}
                </span>
              </div>
            )}
            {data.best_season && (
              <div className="dest-badge">
                <strong>Best Season</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LucideIcon name="Calendar" size={12} color="var(--yellow)" />
                  {data.best_season}
                </span>
              </div>
            )}
            {data.currency && (
              <div className="dest-badge">
                <strong>Currency</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LucideIcon name="Coins" size={12} color="var(--yellow)" />
                  {data.currency}
                </span>
              </div>
            )}
            {data.language && (
              <div className="dest-badge">
                <strong>Language</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LucideIcon name="Languages" size={12} color="var(--yellow)" />
                  {data.language}
                </span>
              </div>
            )}
            {data.total_budget && (
              <div className="dest-badge">
                <strong>Total Budget</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <LucideIcon name="Wallet" size={12} color="var(--yellow)" />
                  {data.total_budget}
                </span>
              </div>
            )}
          </div>
          
          {data.fun_fact && (
            <p className="dest-funfact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <LucideIcon name="Sparkles" size={14} color="var(--yellow)" /> {data.fun_fact}
            </p>
          )}
        </div>

        {/* BUDGET BREAKDOWN */}
        {data.budget && Object.keys(data.budget).length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name="Coins" size={24} /> Budget Breakdown
            </h2>
            <div className="budget-grid">
              {Object.entries(data.budget).map(([key, value]) => (
                <div key={key} className="budget-card">
                  <span className="b-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <LucideIcon name={key} size={32} />
                  </span>
                  <div className="b-amount">{value}</div>
                  <div className="b-label">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FLIGHT OPTIONS */}
        {data.flights && data.flights.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name="Plane" size={24} /> Available Flights (Demo)
            </h2>
            <div className="card-grid">
              {data.flights.map((flight: any, idx: number) => (
                <div key={idx} className="food-card animate-in" style={{ borderLeft: '4px solid var(--blue)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{flight.airline}</span>
                    <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      {flight.flightNumber}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Route:</strong> {flight.origin} → {flight.destination}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Time:</strong> {flight.departure} ({flight.duration})
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>
                    <strong>Stops:</strong> {flight.stops}
                  </p>
                  <div style={{ marginTop: '12px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--orange)', fontFamily: 'var(--font-playfair, serif)' }}>
                    {flight.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ITINERARY */}
        {data.itinerary && data.itinerary.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name="Calendar" size={24} /> Day-by-Day Itinerary
            </h2>
            {data.itinerary.map((day, idx) => (
              <div key={idx} className="day-card animate-in">
                <div className="day-header">
                  <div className="day-num">D{day.day}</div>
                  <div className="day-title-text">{day.title || `Day ${day.day}`}</div>
                </div>
                {day.morning && (
                  <div className="time-slot">
                    <span className="time-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <LucideIcon name="Sunrise" size={12} /> Morning
                    </span>
                    <span className="time-activity">{day.morning}</span>
                  </div>
                )}
                {day.afternoon && (
                  <div className="time-slot">
                    <span className="time-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <LucideIcon name="Sun" size={12} /> Afternoon
                    </span>
                    <span className="time-activity">{day.afternoon}</span>
                  </div>
                )}
                {day.evening && (
                  <div className="time-slot">
                    <span className="time-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <LucideIcon name="Sunset" size={12} /> Evening
                    </span>
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
            <h2 className="rsection-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name="Utensils" size={24} /> Must-Try Local Food
            </h2>
            <div className="card-grid">
              {data.food.map((dish, idx) => (
                <div key={idx} className="food-card animate-in">
                  <span className="card-emoji" style={{ display: 'flex', marginBottom: '12px' }}>
                    <LucideIcon name={dish.icon} size={36} />
                  </span>
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
            <h2 className="rsection-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name="Gem" size={24} /> Hidden Gems
            </h2>
            <div className="card-grid">
              {data.hidden_gems.map((gem, idx) => (
                <div key={idx} className="gem-card animate-in">
                  <span className="card-emoji" style={{ display: 'flex', marginBottom: '12px' }}>
                    <LucideIcon name={gem.icon} size={36} />
                  </span>
                  <h4>{gem.name}</h4>
                  <p>{gem.tip || gem.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PACKING LIST */}
        {data.packing && data.packing.length > 0 && (
          <div className="rsection animate-in">
            <h2 className="rsection-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name="Briefcase" size={24} /> Packing List
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
            <h2 className="rsection-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name="Lightbulb" size={24} /> Insider Tips
            </h2>
            <div className="card-grid">
              {data.tips.map((tip, idx) => (
                <div key={idx} className="tip-card animate-in">
                  <p style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <LucideIcon name="Lightbulb" size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
