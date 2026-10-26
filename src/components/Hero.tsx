/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Flame, Sparkles, BookOpen, ShieldCheck, Heart, ArrowRight, Wand2, Compass } from 'lucide-react';
import { CandleIllustration } from './CandleIllustration';
import { SAMPLE_MEMORY } from '../lib/storage';

interface HeroProps {
  onLightLantern: () => void;
  onExploreSample: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLightLantern, onExploreSample }) => {
  const [lanternLit, setLanternLit] = useState(true);
  const [activeMood, setActiveMood] = useState<'tender' | 'poetic' | 'folklore' | 'spooky'>('tender');

  const moodSnippets = {
    tender: {
      tag: '💛 Tender Tribute',
      excerpt: '“No apagues la vela mientras quede una historia por contar. Love was measured in shared chocolate caliente, wooden molinillos, and hands that smelled of masa and roasted cinnamon.”',
    },
    poetic: {
      tag: '📜 Marigold Lyric',
      excerpt: '“Along the path of cempasúchil gold, a beeswax taper glows. Through mountain rain and valley cold, her voice is the song the November wind knows.”',
    },
    folklore: {
      tag: '🕯️ Día de los Muertos',
      excerpt: '“Spiral pathways of orange petals leading to the front veranda—where coffee steams beside sweet bread, and ancestral stories echo like warm bells.”',
    },
    spooky: {
      tag: '🌙 Midnight Tale',
      excerpt: '“Past midnight, an old clock ticks in the hall. A subtle scent of cinnamon stirs the curtains, and for a gentle moment, time folds back into memory.”',
    },
  };

  return (
    <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Decorative Papel Picado Festive Garland across top */}
      <div className="max-w-6xl mx-auto px-4 mb-8 select-none pointer-events-none" aria-hidden="true">
        <div className="flex justify-between items-center gap-2 opacity-60">
          {['#FF8533', '#F3C978', '#E63946', '#F4A261', '#457B9D', '#FF8533', '#F3C978', '#2A9D8F'].map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full h-0.5 bg-[#FFF9F0]/20" />
              <div
                className="w-8 sm:w-12 h-6 sm:h-9 rounded-b-lg border-x border-b border-black/20 shadow-sm flex items-center justify-center -mt-0.5 transform -rotate-1 hover:rotate-2 transition-transform"
                style={{ backgroundColor: c }}
              >
                <div className="w-2 h-2 rounded-full bg-[#0B0813]/30" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Vision & Playful Interactive Calls */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF8533]/20 via-[#F3C978]/20 to-[#FF8533]/20 border border-[#F3C978]/40 text-[#F3C978] text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(243,201,120,0.15)]">
              <Flame className="w-4 h-4 text-[#FF8533] animate-pulse" />
              <span>A Small Light Against the Dark</span>
            </div>

            {/* Headline with vibrant gradient */}
            <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FFF9F0] tracking-tight leading-[1.15]">
              Some stories <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3C978] via-[#FF8533] to-[#F3C978] bg-[length:200%_auto] animate-pulse">
                deserve to outlive us.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#C1B5C8] max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              A quiet sanctuary for the people, places, and little habits you never want to lose.
              Preserve heartfelt tributes, remembrance letters, marigold poems, and midnight tales—privately crafted by open-weight AI inside your browser.
            </p>

            {/* Playful Mood Toggles */}
            <div className="pt-1">
              <p className="text-[11px] uppercase tracking-wider text-[#F3C978] font-bold mb-2 flex items-center justify-center lg:justify-start gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-[#FF8533]" />
                <span>Play with the Lantern’s Tone:</span>
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {[
                  { id: 'tender', label: '💛 Tender' },
                  { id: 'poetic', label: '📜 Poetic' },
                  { id: 'folklore', label: '🕯️ Folklore' },
                  { id: 'spooky', label: '🌙 Spooky' },
                ].map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setActiveMood(mood.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeMood === mood.id
                        ? 'bg-gradient-to-r from-[#FF8533] to-[#F3C978] text-[#0B0813] shadow-[0_0_12px_rgba(255,133,51,0.4)] scale-105'
                        : 'bg-[#231A33] text-[#C1B5C8] border border-white/10 hover:border-[#F3C978]/40 hover:text-[#FFF9F0]'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onLightLantern}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF8533] via-[#F3C978] to-[#FF8533] bg-[length:200%_auto] hover:bg-right text-[#0B0813] font-extrabold text-sm uppercase tracking-wider shadow-[0_0_28px_rgba(255,133,51,0.45)] hover:shadow-[0_0_38px_rgba(255,133,51,0.65)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Flame className="w-5 h-5 fill-[#0B0813]" />
                <span>Light a Lantern</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSample}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#231A33] border border-[#F3C978]/40 text-[#FFF9F0] hover:text-[#F3C978] hover:border-[#F3C978] hover:bg-[#2E2242] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold text-sm shadow-md"
              >
                <BookOpen className="w-4 h-4 text-[#F3C978]" />
                <span>Explore a Sample Memory</span>
              </button>
            </div>

            {/* Privacy Principle Banner */}
            <div className="p-4 rounded-2xl bg-[#1A1228]/95 border border-[#FFF9F0]/10 max-w-xl mx-auto lg:mx-0 flex items-start gap-3.5 text-left shadow-lg">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 shrink-0 mt-0.5 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#C1B5C8] space-y-1">
                <p className="font-bold text-[#FFF9F0] flex items-center gap-2">
                  <span>Private & Self-Contained by Architecture</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </p>
                <p className="leading-relaxed">
                  Your memories stay on this device. Ghostlight uses an open-weight model (Llama 3.2 1B via WebGPU) running in your browser to help turn your words into something worth keeping. No servers, no tracking, no cloud accounts.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Centerpiece & Live Interactive Sample Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* The Centerpiece Lantern with playful aura */}
            <div className="relative mb-5">
              {/* Radial warm amber glow behind candle */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,133,51,0.3)_0%,rgba(243,201,120,0.15)_40%,transparent_70%)] blur-3xl transform scale-125 pointer-events-none" />

              <div className="relative z-10 transition-transform duration-300 hover:scale-105">
                <CandleIllustration
                  isLit={lanternLit}
                  size="lg"
                  interactive={true}
                  onToggle={(lit) => setLanternLit(lit)}
                  className="z-10"
                />
              </div>

              {/* Playful hint below candle */}
              <div className="text-center mt-1">
                <span className="text-[11px] font-medium text-[#F3C978]/90 bg-[#231A33]/80 px-3 py-1 rounded-full border border-[#F3C978]/30 shadow-sm inline-flex items-center gap-1.5">
                  <span>{lanternLit ? '✨ Candle is glowing' : '💨 Flame is resting'}</span>
                  <span className="text-[10px] text-[#C1B5C8]">(Click candle to toggle)</span>
                </span>
              </div>
            </div>

            {/* Live Interactive Remembrance Preview Card */}
            <div className="w-full max-w-md bg-gradient-to-b from-[#281E3B] to-[#1E162E] border border-[#F3C978]/40 rounded-3xl p-5 sm:p-6 shadow-[0_16px_50px_rgba(0,0,0,0.65)] backdrop-blur-md relative overflow-hidden group hover:border-[#F3C978] transition-all">
              {/* Decorative top gold ribbon accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF8533] via-[#F3C978] to-[#FF8533]" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF8533]/25 text-[#F3C978] border border-[#FF8533]/40">
                    Sample Memory
                  </span>
                  <span className="text-xs font-semibold text-[#FFF9F0]">Abuelita Elena Morales</span>
                </div>
                <span className="text-[11px] text-[#F3C978] font-medium">Día de los Muertos</span>
              </div>

              {/* Dynamic excerpt based on selected playful mood */}
              <div className="my-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8533] block">
                  {moodSnippets[activeMood].tag}
                </span>
                <blockquote className="font-literary text-base sm:text-lg text-[#FFF9F0]/95 italic leading-relaxed border-l-2 border-[#FF8533] pl-3.5 py-0.5">
                  {moodSnippets[activeMood].excerpt}
                </blockquote>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-[#C1B5C8] border-t border-white/10">
                <span className="flex items-center gap-1.5 text-[#F3C978] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF8533]" />
                  <span>Interactive Memory Preview</span>
                </span>
                <button
                  onClick={onExploreSample}
                  className="text-xs text-[#F3C978] hover:text-[#FFF9F0] font-bold flex items-center gap-1.5 group-hover:translate-x-0.5 transition-all cursor-pointer"
                >
                  <span>Read Full Tribute</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
