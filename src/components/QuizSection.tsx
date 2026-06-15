'use client';

import React, { useState } from 'react';

const QUESTIONS = [
  {
    step: 1,
    question: '1. Your ideal landscape?',
    options: [
      { text: '🏖️ Beach & Ocean', val: 'Beach' },
      { text: '🏔️ Mountains & Forests', val: 'Mountains' },
      { text: '🏙️ City & Culture', val: 'City' },
      { text: '🏜️ Desert & Adventure', val: 'Desert' }
    ]
  },
  {
    step: 2,
    question: '2. Your travel style?',
    options: [
      { text: '🥂 Luxury & Comfort', val: 'Luxury' },
      { text: '🎒 Backpacking & Budget', val: 'Backpacking' },
      { text: '📸 Photography & Art', val: 'Photography' },
      { text: '🍜 Food & Culture', val: 'Food' }
    ]
  },
  {
    step: 3,
    question: '3. Your perfect travel moment?',
    options: [
      { text: '🌅 Sunrise at a viewpoint', val: 'Sunrise' },
      { text: '🌙 Midnight street food', val: 'Street Food' },
      { text: '💧 Discovering a waterfall', val: 'Hidden Waterfall' },
      { text: '🍹 Rooftop sunset cocktail', val: 'Rooftop' }
    ]
  }
];

const PERSONALITIES = [
  { name: 'The Explorer', emoji: '🧭', desc: 'You live for discovery. Off-the-beaten-path is your natural habitat.' },
  { name: 'The Luxury Traveler', emoji: '✨', desc: 'You appreciate the finest things — views, villas, and exceptional service.' },
  { name: 'The Photographer', emoji: '📷', desc: 'Every destination is a canvas. You see the world in frames and light.' },
  { name: 'The Foodie', emoji: '🍜', desc: 'Your itinerary is built around the best meals, not monuments.' },
  { name: 'The Backpacker', emoji: '🎒', desc: 'Light luggage, big adventures. Budget is your superpower.' },
  { name: 'The Nature Lover', emoji: '🌿', desc: 'Mountains, forests, oceans — you need to feel the wild to feel alive.' }
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
        <h2>✨ What kind of traveler are you?</h2>
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
                >
                  {opt.text}
                </div>
              ))}
            </div>
          </div>
        ) : (
          result && (
            <div className="personality-result" id="quiz-result">
              <span className="p-emoji" id="p-emoji">
                {result.emoji}
              </span>
              <h3 id="p-name">{result.name}</h3>
              <p id="p-desc">{result.desc}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="quiz-cta" onClick={onPlanCTA}>
                  ✈ Plan Your Perfect Trip
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
