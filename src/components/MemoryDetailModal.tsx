/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  X,
  Flame,
  Copy,
  Download,
  Check,
  Edit2,
  Utensils,
  Music,
  MapPin,
  Quote,
  Sparkles,
  Heart,
  Calendar,
} from 'lucide-react';
import { MemoryRecord } from '../types/memory';
import { exportMemoryToMarkdown } from '../lib/storage';
import { CandleIllustration } from './CandleIllustration';

interface MemoryDetailModalProps {
  memory: MemoryRecord | null;
  onClose: () => void;
  onEdit: (memory: MemoryRecord) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  onClose,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!memory) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${memory.title}\n\n${memory.generatedContent || memory.story}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleDownload = () => {
    exportMemoryToMarkdown(memory);
  };

  const dateFormatted = new Date(memory.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const modeTitles = {
    tribute: 'A Light of Remembrance',
    letter: 'A Letter to Remember',
    poem: 'A Marigold Poem',
    story: 'A Whisper After Midnight',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#201A28] border border-[#E7BD72]/40 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#E98736] via-[#E7BD72] to-[#E98736]" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#292233] to-[#201A28] border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full bg-[#E98736]/20 text-[#E7BD72] border border-[#E98736]/30">
                {modeTitles[memory.mode] || memory.mode}
              </span>
              <span className="text-xs text-[#B6AABA] capitalize">
                Tone: {memory.tone}
              </span>
              {memory.isFictionalSample && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  Fictional Sample
                </span>
              )}
            </div>

            <h2 className="font-serif-title text-2xl sm:text-4xl font-bold text-[#F4EBDD]">
              {memory.title}
            </h2>

            {memory.relationship && (
              <p className="text-sm text-[#E7BD72] font-medium">
                {memory.relationship}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <CandleIllustration isLit={true} size="sm" interactive={false} showGarland={false} />
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#17121F] border border-white/10 text-[#B6AABA] hover:text-[#F4EBDD] hover:bg-[#201A28] transition-colors ml-2"
              aria-label="Close remembrance modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source & Date Sub-bar */}
        <div className="px-6 sm:px-8 py-2.5 bg-[#17121F] border-b border-white/5 flex flex-wrap items-center justify-between text-xs text-[#B6AABA] gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#E7BD72] font-semibold">Source:</span>
            <span>
              {memory.generationSource === 'local-ai'
                ? `Local Open-Weight AI (${memory.modelUsed || 'Browser WebGPU'})`
                : memory.generationSource === 'sample'
                ? 'Sample Demonstration'
                : 'Deterministic Template Mode (No AI)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateFormatted}</span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-10 space-y-8 max-h-[65vh] overflow-y-auto">
          {/* Main Tribute / Poem / Story */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-[#E7BD72]">
              The Lantern's Whisper
            </h3>
            <div className="font-literary text-lg sm:text-xl text-[#F4EBDD] leading-relaxed whitespace-pre-line tracking-wide bg-[#17121F]/50 p-6 rounded-2xl border border-white/5">
              {memory.generatedContent || memory.story}
            </div>
          </div>

          {/* Attached Photo */}
          {memory.photoDataUrl && (
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#17121F] border border-white/10">
              <img
                src={memory.photoDataUrl}
                alt={memory.title}
                className="w-32 h-32 object-cover rounded-xl border border-[#E7BD72]/40 shadow-lg"
              />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-semibold text-[#F4EBDD]">Cherished Photograph</h4>
                <p className="text-xs text-[#B6AABA] leading-relaxed">
                  Preserved in your browser's private IndexedDB storage. Never shared or uploaded to the cloud.
                </p>
              </div>
            </div>
          )}

          {/* Original Story & Context Section */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-[#E7BD72]">
              The Remembered Story
            </h3>
            <p className="text-sm text-[#F4EBDD]/90 leading-relaxed bg-[#17121F]/30 p-4 rounded-xl border border-white/5">
              {memory.story}
            </p>
          </div>

          {/* Personal Details & Keepsakes Grid */}
          {(memory.favoriteFood ||
            memory.favoriteSong ||
            memory.favoritePlace ||
            memory.favoriteSaying ||
            memory.memorableHabit ||
            memory.tradition) && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-xs uppercase font-semibold tracking-widest text-[#E7BD72]">
                Personal Keepsakes & Traditions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {memory.favoriteFood && (
                  <div className="p-3 rounded-xl bg-[#17121F] border border-white/5 flex items-start gap-2.5">
                    <Utensils className="w-4 h-4 text-[#E98736] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#E7BD72] block">Favorite Food or Drink</span>
                      <span className="text-[#F4EBDD]">{memory.favoriteFood}</span>
                    </div>
                  </div>
                )}
                {memory.favoriteSong && (
                  <div className="p-3 rounded-xl bg-[#17121F] border border-white/5 flex items-start gap-2.5">
                    <Music className="w-4 h-4 text-[#E7BD72] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#E7BD72] block">Favorite Song or Melody</span>
                      <span className="text-[#F4EBDD]">{memory.favoriteSong}</span>
                    </div>
                  </div>
                )}
                {memory.favoritePlace && (
                  <div className="p-3 rounded-xl bg-[#17121F] border border-white/5 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#F4A261] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#E7BD72] block">Favorite Place</span>
                      <span className="text-[#F4EBDD]">{memory.favoritePlace}</span>
                    </div>
                  </div>
                )}
                {memory.favoriteSaying && (
                  <div className="p-3 rounded-xl bg-[#17121F] border border-white/5 flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-[#E7BD72] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#E7BD72] block">Memorable Saying</span>
                      <span className="text-[#F4EBDD]">"{memory.favoriteSaying}"</span>
                    </div>
                  </div>
                )}
                {memory.memorableHabit && (
                  <div className="p-3 rounded-xl bg-[#17121F] border border-white/5 flex items-start gap-2.5 sm:col-span-2">
                    <Sparkles className="w-4 h-4 text-[#E7BD72] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#E7BD72] block">Memorable Habit or Gesture</span>
                      <span className="text-[#F4EBDD]">{memory.memorableHabit}</span>
                    </div>
                  </div>
                )}
                {memory.tradition && (
                  <div className="p-3 rounded-xl bg-[#17121F] border border-white/5 flex items-start gap-2.5 sm:col-span-2">
                    <Flame className="w-4 h-4 text-[#E98736] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#E7BD72] block">Preserved Tradition</span>
                      <span className="text-[#F4EBDD]">{memory.tradition}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-[#17121F] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-[#201A28] border border-white/10 hover:border-[#E7BD72]/40 text-xs text-[#F4EBDD] hover:text-[#E7BD72] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-[#201A28] border border-white/10 hover:border-[#E7BD72]/40 text-xs text-[#F4EBDD] hover:text-[#E7BD72] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Markdown</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(memory);
              }}
              className="px-4 py-2 rounded-xl bg-[#201A28] border border-[#E7BD72]/40 text-xs text-[#E7BD72] hover:bg-[#292233] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Memory</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E98736] to-[#E7BD72] text-[#0B0A10] font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
