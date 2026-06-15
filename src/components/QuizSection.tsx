'use client';

import React, { useState } from 'react';
import LucideIcon from './LucideIcon';

const QUESTIONS = [
  {
    step: 1,
    question: '1. Your ideal landscape?',
    options: [
      { text: 'Beach & Ocean', icon: 'Palmtree', val: 'Beach' },
      { text: 'Mountains & Forests', icon: 'Mountain', val: 'Mountains' },
      { text: 'City & Culture', icon: 'Building', val: 'City' },
      { text: 'Desert & Adventure', icon: 'Compass', val: 'Desert' }
    ]
  },
  {
    step: 2,
    question: '2. Your travel style?',
    options: [
      { text: 'Luxury & Comfort', icon: 'Crown', val: 'Luxury' },
      { text: 'Backpacking & Budget', icon: 'Briefcase', val: 'Backpacking' },
      { text: 'Photography & Art', icon: 'Camera', val: 'Photography' },
      { text: 'Food & Culture', icon: 'Utensils', val: 'Food' }
    ]
  },
  {
    step: 3,
    question: '3. Your perfect travel moment?',
    options: [
      { text: 'Sunrise at a viewpoint', icon: 'Sunrise', val: 'Sunrise' },
      { text: 'Midnight street food', icon: 'Moon', val: 'Street Food' },
      { text: 'Discovering a waterfall', icon: 'Droplets', val: 'Hidden Waterfall' },
      { text: 'Rooftop sunset cocktail', icon: 'GlassWater', val: 'Rooftop' }
    ]
  }
];

const PERSONALITIES = [
  { name: 'The Explorer', icon: 'Compass', desc: 'You live for discovery. Off-the-beaten-path is your natural habitat.' },
  { name: 'The Luxury Traveler', icon: 'Crown', desc: 'You appreciate the finest things — views, villas, and exceptional service.' },
  { name: 'The Photographer', icon: 'Camera', desc: 'Every destination is a canvas. You see the world in frames and light.' },
  { name: 'The Foodie', icon: 'Utensils', desc: 'Your itinerary is built around the best meals, not monuments.' },
  { name: 'The Backpacker', icon: 'Briefcase', desc: 'Light luggage, big adventures. Budget is your superpower.' },
  { name: 'The Nature Lover', icon: 'Leaf', desc: 'Mountains, forests, oceans — you need to feel the wild to feel alive.' }
];

interface QuizSectionProps {
  onPlanCTA: () => void;
}

export default function QuizSection({ onPlanCTA }: QuizSectionProps) {
  const [step, setStep] = useState(0); // 0, 1, 2 for questions, 3 for result
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [result, setResult] = useState<typeof PERSONALITIES[0] | null>(null);

  const handleOptionSelect = (optIdx: number) => {
    setSelectedOpt(optIdx);

    setTimeout(() => {
      setSelectedOpt(null);
      if (step < 2) {
        setStep(step + 1);
      } else {
        // Calculate a random or index-derived personality
        const randomPersonality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
        setResult(randomPersonality);
        setStep(3);
      }
    }, 450); // Small timeout for transition animation
  };

  const handleReset = () => {
    setStep(0);
    setSelectedOpt(null);
    setResult(null);
  };

  return (
    <div className="quiz-wrap" id="quiz-section">
      <div className="quiz-inner">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <LucideIcon name="Sparkles" size={24} color="var(--yellow)" /> What kind of traveler are you?
        </h2>
        <p>Answer 3 quick questions and discover your wanderer personality</p>

        {step < 3 ? (
          <div className="quiz-q active">
            <p className="quiz-q-label">{QUESTIONS[step].question}</p>
            <div className="quiz-options">
              {QUESTIONS[step].options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`quiz-opt ${selectedOpt === idx ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(idx)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  <LucideIcon name={opt.icon} size={18} color="white" />
                  {opt.text}
                </div>
              ))}
            </div>
          </div>
        ) : (
          result && (
            <div className="personality-result" id="quiz-result">
              <span className="p-emoji" id="p-emoji" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <LucideIcon name={result.icon} size={64} />
              </span>
              <h3 id="p-name">{result.name}</h3>
              <p id="p-desc">{result.desc}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  className="quiz-cta" 
                  onClick={onPlanCTA}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <LucideIcon name="Plane" size={16} /> Plan Your Perfect Trip
                </button>
                <button
                  className="quiz-cta"
                  style={{ background: 'white', border: '1px solid #ccc', color: '#333' }}
                  onClick={handleReset}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
