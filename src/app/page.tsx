'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import QuizSection from '@/components/QuizSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import WanderBot from '@/components/WanderBot';
import LoadingScreen from '@/components/LoadingScreen';
import ResultScreen from '@/components/ResultScreen';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'quiz' | 'result'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  const [backendConfig, setBackendConfig] = useState<{ isDemo: boolean; provider: string }>({
    isDemo: true,
    provider: 'Demo Mode'
  });
  
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setBackendConfig({
          isDemo: data.isDemo,
          provider: data.provider
        });
      })
      .catch((err) => console.error('Error fetching config:', err));
  }, []);

  // Auto-detect if the loaded trip was a mock/fallback trip
  const isDemo = tripData && tripData.destination && tripData.destination.includes('Demo Mode');

  const handleNavigate = (page: 'home' | 'quiz' | 'result') => {
    if (page === 'quiz') {
      setCurrentPage('home');
      setTimeout(() => {
        const quizEl = document.getElementById('quiz-section');
        if (quizEl) {
          quizEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlanTripClick = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handlePlanTrip = async (prompt: string) => {
    setIsLoading(true);
    setIsCompleted(false);
    setTripData(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate trip plan');
      }

      const data = await response.json();
      
      // Let the loading screen progress complete nicely
      setIsCompleted(true);
      
      // Keep loading screen visible briefly to celebrate completion
      await new Promise((resolve) => setTimeout(resolve, 1400));
      
      setTripData(data);
      setCurrentPage('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please check your network or try again!');
    } finally {
      setIsLoading(false);
      setIsCompleted(false);
    }
  };

  const handleBackToHome = () => {
    setTripData(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar onNavigate={handleNavigate} onPlanTripClick={handlePlanTripClick} />

      {currentPage === 'home' && (
        <div className="animate-in">
          <Hero 
            onPlanTrip={handlePlanTrip} 
            inputRef={inputRef} 
            isDemo={backendConfig.isDemo}
            activeProvider={backendConfig.provider}
          />
          <Features />
          <QuizSection onPlanCTA={handlePlanTripClick} />
          <Testimonials />
        </div>
      )}

      {currentPage === 'result' && (
        <ResultScreen data={tripData} onBack={handleBackToHome} />
      )}

      <Footer />
      <WanderBot />

      <LoadingScreen isLoading={isLoading} isCompleted={isCompleted} />
    </>
  );
}
