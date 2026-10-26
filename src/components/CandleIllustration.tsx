/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface CandleProps {
  isLit?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onToggle?: (lit: boolean) => void;
  className?: string;
  showGarland?: boolean;
}

export const CandleIllustration: React.FC<CandleProps> = ({
  isLit = true,
  size = 'md',
  interactive = true,
  onToggle,
  className = '',
  showGarland = true,
}) => {
  const [lit, setLit] = useState(isLit);
  const [showSpark, setShowSpark] = useState(false);

  useEffect(() => {
    setLit(isLit);
  }, [isLit]);

  const handleToggle = () => {
    if (!interactive) return;
    const newState = !lit;
    setLit(newState);
    if (newState) {
      setShowSpark(true);
      setTimeout(() => setShowSpark(false), 800);
    }
    if (onToggle) onToggle(newState);
  };

  const dimensions = {
    sm: { width: 90, height: 120 },
    md: { width: 140, height: 190 },
    lg: { width: 200, height: 270 },
  }[size];

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={handleToggle}
      role={interactive ? 'button' : 'img'}
      aria-label={lit ? 'Candle is lit. Click to toggle flame.' : 'Candle is unlit. Click to kindle flame.'}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 160 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Flame gradients */}
          <radialGradient id="outerFlameGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8533" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#F3C978" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0B0813" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="20%" stopColor="#FF8533" />
            <stop offset="70%" stopColor="#F3C978" />
            <stop offset="100%" stopColor="#FFFFEE" />
          </linearGradient>

          <linearGradient id="candleBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D9CFAF" />
            <stop offset="30%" stopColor="#FFF9F0" />
            <stop offset="70%" stopColor="#EFE3D3" />
            <stop offset="100%" stopColor="#BFAF8C" />
          </linearGradient>

          <linearGradient id="waxDrip" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9F0" />
            <stop offset="100%" stopColor="#E0CFAC" />
          </linearGradient>

          <linearGradient id="brassBase" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#694C1B" />
            <stop offset="25%" stopColor="#C49B48" />
            <stop offset="50%" stopColor="#F3C978" />
            <stop offset="85%" stopColor="#9C7729" />
            <stop offset="100%" stopColor="#45310F" />
          </linearGradient>
        </defs>

        {/* Outer ambient glow when lit */}
        {lit && (
          <circle
            cx="80"
            cy="52"
            r="75"
            fill="url(#outerFlameGlow)"
            className="animate-pulse"
            style={{ animationDuration: '3.5s' }}
          />
        )}

        {/* Brass Holder Base */}
        <g id="brass-saucer">
          <ellipse cx="80" cy="205" rx="55" ry="9" fill="#140F08" opacity="0.6" />
          <ellipse cx="80" cy="200" rx="48" ry="8" fill="url(#brassBase)" />
          <ellipse cx="80" cy="198" rx="42" ry="6" fill="#B38936" />
          <path d="M54 198 C54 190 60 184 80 184 C100 184 106 190 106 198 Z" fill="url(#brassBase)" />
          {/* Subtle saucer handle ring */}
          <path
            d="M32 195 C20 192 18 180 24 174 C30 168 40 174 44 186"
            stroke="url(#brassBase)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Candle Pillar */}
        <g id="candle-pillar">
          <rect x="62" y="86" width="36" height="106" rx="2" fill="url(#candleBody)" />
          {/* Top concave rim */}
          <ellipse cx="80" cy="86" rx="18" ry="4" fill="#BFAF93" />
          <ellipse cx="80" cy="86" rx="16" ry="3" fill="#D3C3A4" />
          {/* Wax drips down the side */}
          <path
            d="M62 88 C62 98 65 106 65 118 C65 124 62 126 62 126"
            stroke="url(#waxDrip)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M89 88 C89 96 92 102 91 112 C90 118 89 122 89 122"
            stroke="url(#waxDrip)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Wick */}
        <path
          d="M80 85 C80 77 78 72 81 66"
          stroke={lit ? '#FFE7BA' : '#423B36'}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Flame (animated when lit) */}
        {lit ? (
          <g className="flame-flicker" style={{ transformOrigin: '80px 66px' }}>
            {/* Outer flame */}
            <path
              d="M80 18 C89 36 95 49 90 62 C86 68 74 68 70 62 C65 49 71 36 80 18 Z"
              fill="url(#flameInner)"
            />
            {/* Inner intense core */}
            <path
              d="M80 34 C85 45 87 51 84 60 C82 63 76 63 74 60 C72 51 75 45 80 34 Z"
              fill="#FFFFF0"
              opacity="0.95"
            />
            {/* Tiny blue base */}
            <ellipse cx="80" cy="65" rx="3.5" ry="2" fill="#38BDF8" opacity="0.85" />
          </g>
        ) : (
          /* Smoke curl when unlit */
          <path
            d="M81 66 C83 58 77 52 82 44 C86 38 80 30 84 22"
            stroke="rgba(193, 181, 200, 0.45)"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Playful Kindle Spark Burst */}
        {showSpark && (
          <g id="kindle-spark">
            <circle cx="80" cy="45" r="2" fill="#FFE08F" />
            <circle cx="70" cy="35" r="1.5" fill="#FF8533" />
            <circle cx="92" cy="38" r="1.5" fill="#F3C978" />
            <circle cx="85" cy="22" r="2" fill="#FFF9F0" />
          </g>
        )}

        {/* Marigold Garland at base */}
        {showGarland && (
          <g id="marigold-garland" transform="translate(0, 0)">
            {/* Flower Left */}
            <g transform="translate(42, 192)">
              <circle cx="0" cy="0" r="11" fill="#FF8533" />
              <circle cx="0" cy="0" r="8" fill="#F4A261" />
              <circle cx="0" cy="0" r="4" fill="#F3C978" />
              <circle cx="0" cy="0" r="2" fill="#8B4513" />
            </g>
            {/* Flower Center */}
            <g transform="translate(80, 201)">
              <circle cx="0" cy="0" r="13" fill="#FF8533" />
              <circle cx="0" cy="0" r="9.5" fill="#F4A261" />
              <circle cx="0" cy="0" r="5" fill="#F3C978" />
              <circle cx="0" cy="0" r="2.5" fill="#8B4513" />
            </g>
            {/* Flower Right */}
            <g transform="translate(118, 192)">
              <circle cx="0" cy="0" r="11" fill="#FF8533" />
              <circle cx="0" cy="0" r="8" fill="#F4A261" />
              <circle cx="0" cy="0" r="4" fill="#F3C978" />
              <circle cx="0" cy="0" r="2" fill="#8B4513" />
            </g>
            {/* Scattered petals */}
            <ellipse cx="25" cy="208" rx="5" ry="3" fill="#F3C978" transform="rotate(-20 25 208)" />
            <ellipse cx="138" cy="207" rx="5" ry="3" fill="#FF8533" transform="rotate(25 138 207)" />
          </g>
        )}
      </svg>

      {interactive && (
        <span className="text-[11px] font-semibold text-[#F3C978] opacity-0 group-hover:opacity-100 transition-opacity mt-1 tracking-wider uppercase bg-[#140E20]/90 px-2.5 py-0.5 rounded-full border border-[#F3C978]/30 shadow-sm">
          {lit ? '💨 Click to blow out' : '✨ Click to kindle flame'}
        </span>
      )}
    </div>
  );
};
