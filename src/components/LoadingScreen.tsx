'use client';

import React, { useState, useEffect } from 'react';
import LucideIcon from './LucideIcon';

const LOADING_STEPS = [
  { icon: "Plane", text: "Searching dream destinations..." },
  { icon: "Hotel", text: "Comparing perfect stays..." },
  { icon: "Utensils", text: "Finding local food gems..." },
  { icon: "Camera", text: "Discovering photo spots..." },
  { icon: "Map", text: "Mapping hidden gems..." },
  { icon: "Briefcase", text: "Packing your suitcase..." },
  { icon: "BookOpen", text: "Writing your travel story..." }
];

interface LoadingScreenProps {
  isLoading: boolean;
  isCompleted: boolean;
}

export default function LoadingScreen({ isLoading, isCompleted }: LoadingScreenProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIdx(0);
      setProgress(0);
      return;
    }

    if (isCompleted) {
      setProgress(100);
      return;
    }

    // Set up step transition interval
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        const next = prev + 1;
        if (next < LOADING_STEPS.length) {
          setProgress(Math.round((next / LOADING_STEPS.length) * 92));
          return next;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 950);

    return () => clearInterval(interval);
  }, [isLoading, isCompleted]);

  if (!isLoading) return null;

  return (
    <div id="loading-screen">
      <div className="loading-plane-anim" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LucideIcon name="Plane" size={54} color="var(--orange)" />
      </div>
      <div className="loading-title-text" id="loading-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {isCompleted && <LucideIcon name="CheckCircle" size={24} color="var(--blue)" />}
        {isCompleted ? 'Your adventure is ready!' : 'Planning your adventure...'}
      </div>
      <div className="loading-bar-wrap">
        <div 
          className="loading-bar-fill" 
          id="loading-bar-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <ul className="loading-steps-list" id="loading-steps">
        {LOADING_STEPS.map((step, idx) => {
          let className = '';
          if (isCompleted) {
            className = 'done';
          } else if (idx === currentStepIdx) {
            className = 'active';
          } else if (idx < currentStepIdx) {
            className = 'done';
          }
          return (
            <li key={idx} className={className} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcon name={step.icon} size={16} />
              {step.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
