'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo">
          Wander <span>The World</span>
        </div>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Portfolio</a>
          <a href="#">GitHub</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div>
        <div className="footer-copy">
          Made with ♥ for every wanderer · Powered by Gemini & Next.js
        </div>
      </div>
    </footer>
  );
}
