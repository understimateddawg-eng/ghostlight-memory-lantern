/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  rotation: number;
  opacity: number;
  color: string;
}

interface Firefly {
  id: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  size: number;
}

export const FloatingPetals: React.FC = () => {
  // Generate stable petal positions
  const petals = useMemo<Petal[]>(() => {
    const colors = ['#FF8533', '#F3C978', '#FF5E1E', '#F4A261', '#E76F51'];
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.8 + (i % 3) * 2.5) % 98}%`,
      delay: `${(i * 1.5) % 15}s`,
      duration: `${16 + (i % 5) * 4}s`,
      size: 11 + (i % 4) * 4,
      rotation: (i * 43) % 360,
      opacity: 0.45 + (i % 4) * 0.15,
      color: colors[i % colors.length],
    }));
  }, []);

  // Generate stable firefly positions
  const fireflies = useMemo<Firefly[]>(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + 3) % 96}%`,
      top: `${(i * 8.2 + 8) % 88}%`,
      delay: `${(i * 1.1) % 6}s`,
      duration: `${3.5 + (i % 3) * 2}s`,
      size: 2.5 + (i % 3),
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Background ambient gradient glow - warm candlelight and deep plum radiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(255,133,51,0.12)_0%,rgba(243,201,120,0.06)_40%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(182,109,255,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Marigold cempasúchil petals */}
      {petals.map((petal) => (
        <div
          key={`petal-${petal.id}`}
          className="absolute bottom-[-40px] floating-petal"
          style={{
            left: petal.left,
            animation: `float-petal ${petal.duration} infinite ease-in-out`,
            animationDelay: petal.delay,
            opacity: petal.opacity,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.4}
            viewBox="0 0 24 32"
            style={{ transform: `rotate(${petal.rotation}deg)` }}
          >
            <path
              d="M12 0 C18 8 24 18 16 30 C12 32 8 32 4 28 C-2 18 6 8 12 0 Z"
              fill={petal.color}
            />
          </svg>
        </div>
      ))}

      {/* Subtle ember fireflies */}
      {fireflies.map((fly) => (
        <div
          key={`firefly-${fly.id}`}
          className="absolute firefly-node rounded-full"
          style={{
            left: fly.left,
            top: fly.top,
            width: `${fly.size}px`,
            height: `${fly.size}px`,
            backgroundColor: '#FFF2C6',
            boxShadow: '0 0 10px 3px rgba(243, 201, 120, 0.8)',
            animation: `firefly ${fly.duration} infinite ease-in-out`,
            animationDelay: fly.delay,
          }}
        />
      ))}
    </div>
  );
};
