/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Mail, Sparkles, Moon, Globe, Clock, Sliders, Heart } from 'lucide-react';
import { GenerationMode, GenerationTone, GenerationLanguage, GenerationLength } from '../types/memory';

interface Props {
  selectedMode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
  tone: GenerationTone;
  onChangeTone: (tone: GenerationTone) => void;
  language: GenerationLanguage;
  onChangeLanguage: (lang: GenerationLanguage) => void;
  length: GenerationLength;
  onChangeLength: (length: GenerationLength) => void;
}

export const CreationModeSelector: React.FC<Props> = ({
  selectedMode,
  onSelectMode,
  tone,
  onChangeTone,
  language,
  onChangeLanguage,
  length,
  onChangeLength,
}) => {
  const modes: Array<{
    id: GenerationMode;
    title: string;
    badge: string;
    description: string;
    icon: React.ElementType;
    accent: string;
  }> = [
    {
      id: 'tribute',
      title: 'A Light of Remembrance',
      badge: '🕯️ Heartfelt Tribute',
      description: 'A deeply personal reflection celebrating their remembered qualities, shared laughter, and warmth.',
      icon: Flame,
      accent: 'from-[#FF8533] to-[#F3C978]',
    },
    {
      id: 'letter',
      title: 'A Letter to Remember',
      badge: '✉️ Reflective Letter',
      description: 'An intimate letter written from your perspective addressing your loved one with gratitude and fond memories.',
      icon: Mail,
      accent: 'from-[#F3C978] to-[#FFF9F0]',
    },
    {
      id: 'poem',
      title: 'A Marigold Poem',
      badge: '🌻 Cempasúchil Lyric',
      description: 'An evocative poem that weaves supplied places, songs, scents, and traditions into verses of candlelight.',
      icon: Sparkles,
      accent: 'from-[#FF8533] to-[#E76F51]',
    },
    {
      id: 'story',
      title: 'A Whisper After Midnight',
      badge: '🌙 Midnight Folklore',
      description: 'A gently spooky, cozy fictional tale set beside candle flame in a quiet house, where memories gently echo.',
      icon: Moon,
      accent: 'from-[#A855F7] to-[#F3C978]',
    },
  ];

  const tones: Array<{ id: GenerationTone; emoji: string; label: string; desc: string }> = [
    { id: 'tender', emoji: '💛', label: 'Tender', desc: 'Gentle, comforting, and heartfelt' },
    { id: 'poetic', emoji: '📜', label: 'Poetic', desc: 'Rich imagery of light & flower petals' },
    { id: 'hopeful', emoji: '🌻', label: 'Hopeful', desc: 'Uplifting celebration of shared joy' },
    { id: 'folklore', emoji: '🕯️', label: 'Folklore', desc: 'Traditional Día de los Muertos reverence' },
    { id: 'gently-spooky', emoji: '🌙', label: 'Gently Spooky', desc: 'Autumnal midnight folklore' },
  ];

  const lengths: Array<{ id: GenerationLength; label: string; hint: string }> = [
    { id: 'short', label: 'Short', hint: '~150 words' },
    { id: 'medium', label: 'Medium', hint: '~280 words' },
    { id: 'long', label: 'Long', hint: '~450 words' },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Selection Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#F3C978]">
            1. Choose Your Creation Mode
          </label>
          <span className="text-[11px] text-[#C1B5C8]">Click any mode to transform the style</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMode === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#2E2242] to-[#231A33] border-[#F3C978] shadow-[0_0_24px_rgba(243,201,120,0.22)] ring-1 ring-[#F3C978]'
                    : 'bg-[#1A1228]/80 border-white/10 hover:border-[#F3C978]/50 hover:bg-[#231A33]/70'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FF8533]/20 via-transparent to-transparent pointer-events-none" />
                )}

                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-gradient-to-br ' + m.accent + ' text-[#0B0813] shadow-[0_0_16px_rgba(255,133,51,0.4)]'
                        : 'bg-[#140E20] text-[#F3C978] border border-white/10 group-hover:border-[#F3C978]/40'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-title text-base font-bold text-[#FFF9F0] group-hover:text-[#F3C978] transition-colors">
                        {m.title}
                      </h3>
                    </div>
                    <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-[#FF8533] bg-[#FF8533]/15 px-2 py-0.5 rounded-full border border-[#FF8533]/30">
                      {m.badge}
                    </span>
                    <p className="text-xs text-[#C1B5C8] leading-relaxed pt-1">
                      {m.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone, Language & Length row with playful cards */}
      <div className="p-5 rounded-2xl bg-[#1A1228]/90 border border-white/10 shadow-lg space-y-5">
        {/* Playful Mood/Tone Selector Grid */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F3C978] mb-2.5">
            <Sliders className="w-3.5 h-3.5 text-[#FF8533]" />
            <span>Tone & Emotional Atmosphere</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {tones.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => onChangeTone(t.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#2E2242] to-[#231A33] border-[#F3C978] text-[#F3C978] font-bold shadow-[0_0_12px_rgba(243,201,120,0.2)] scale-[1.02]'
                      : 'bg-[#140E20]/80 text-[#C1B5C8] border-white/10 hover:border-white/20 hover:text-[#FFF9F0]'
                  }`}
                >
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-xs font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language & Length Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          {/* Language Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F3C978] mb-2">
              <Globe className="w-3.5 h-3.5 text-[#FF8533]" />
              <span>Language of Remembrance</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-[#FF8533] to-[#F3C978] text-[#0B0813] border-[#F3C978] shadow-md'
                    : 'bg-[#231A33] text-[#FFF9F0] border-white/10 hover:border-white/25'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage('es')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  language === 'es'
                    ? 'bg-gradient-to-r from-[#FF8533] to-[#F3C978] text-[#0B0813] border-[#FF8533] shadow-md'
                    : 'bg-[#231A33] text-[#FFF9F0] border-white/10 hover:border-white/25'
                }`}
              >
                Español (ES)
              </button>
            </div>
          </div>

          {/* Length Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F3C978] mb-2">
              <Clock className="w-3.5 h-3.5 text-[#FF8533]" />
              <span>Tribute Length</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {lengths.map((len) => (
                <button
                  type="button"
                  key={len.id}
                  onClick={() => onChangeLength(len.id)}
                  className={`py-2 px-1 rounded-xl text-xs border text-center transition-all cursor-pointer ${
                    length === len.id
                      ? 'bg-[#231A33] border-[#F3C978] text-[#F3C978] font-bold shadow-[0_0_10px_rgba(243,201,120,0.2)]'
                      : 'bg-[#231A33]/60 text-[#C1B5C8] border-white/10 hover:text-[#FFF9F0]'
                  }`}
                >
                  <div className="font-semibold">{len.label}</div>
                  <div className="text-[10px] opacity-75">{len.hint}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
