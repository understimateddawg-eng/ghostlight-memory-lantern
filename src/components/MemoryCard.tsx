/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  BookOpen,
  Edit2,
  Trash2,
  Copy,
  Download,
  Check,
  Music,
  Utensils,
  MapPin,
  Quote,
  Sparkles,
} from 'lucide-react';
import { MemoryRecord } from '../types/memory';
import { exportMemoryToMarkdown } from '../lib/storage';

interface MemoryCardProps {
  memory: MemoryRecord;
  onOpen: (memory: MemoryRecord) => void;
  onEdit: (memory: MemoryRecord) => void;
  onDelete: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onOpen,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [isLit, setIsLit] = useState(memory.isLanternLit ?? true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `${memory.title}\n\n${memory.generatedContent || memory.story}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportMemoryToMarkdown(memory);
  };

  const handleToggleFlame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLit(!isLit);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(memory.id);
    setShowConfirmDelete(false);
  };

  const dateFormatted = new Date(memory.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const modeBadge = {
    tribute: { label: '🕯️ Tribute', color: 'bg-[#FF8533]/25 text-[#F3C978] border-[#FF8533]/40' },
    letter: { label: '✉️ Letter', color: 'bg-amber-900/35 text-amber-200 border-amber-600/40' },
    poem: { label: '🌻 Poem', color: 'bg-orange-900/35 text-orange-200 border-orange-600/40' },
    story: { label: '🌙 Midnight Tale', color: 'bg-purple-950/60 text-purple-200 border-purple-700/50' },
  }[memory.mode] || { label: memory.mode, color: 'bg-white/10 text-white border-white/20' };

  return (
    <>
      <div
        onClick={() => onOpen(memory)}
        className="group relative bg-[#231A33] border border-[#FFF9F0]/12 hover:border-[#F3C978] rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(255,133,51,0.25)] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg"
      >
        {/* Top warm gold ribbon on hover */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#F3C978] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row: Photo/Flame + Badges */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {memory.photoDataUrl ? (
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#F3C978]/50 shrink-0 shadow-md">
                  <img
                    src={memory.photoDataUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                /* Interactive flame button - click to light or rest */
                <button
                  type="button"
                  onClick={handleToggleFlame}
                  title={isLit ? 'Click to rest candle' : 'Click to kindle candle'}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    isLit
                      ? 'bg-gradient-to-b from-[#2E2242] to-[#1A1228] border-[#F3C978]/60 shadow-[0_0_15px_rgba(255,133,51,0.4)]'
                      : 'bg-[#140E20] border-white/10 opacity-60'
                  }`}
                >
                  <Flame
                    className={`w-5 h-5 transition-colors ${
                      isLit ? 'text-[#FF8533] fill-[#FF8533]/40 animate-pulse' : 'text-[#C1B5C8]'
                    }`}
                  />
                </button>
              )}

              <div>
                <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#FFF9F0] group-hover:text-[#F3C978] transition-colors line-clamp-1">
                  {memory.title}
                </h3>
                {memory.relationship ? (
                  <p className="text-xs text-[#F3C978] font-medium line-clamp-1">
                    {memory.relationship}
                  </p>
                ) : (
                  <p className="text-xs text-[#C1B5C8]/80 font-medium">Memory of Loved One</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${modeBadge.color}`}>
                {modeBadge.label}
              </span>
              {memory.isFictionalSample && (
                <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/35">
                  Sample
                </span>
              )}
            </div>
          </div>

          {/* Tribute / Story Excerpt */}
          <blockquote className="font-literary text-base text-[#FFF9F0]/95 line-clamp-3 leading-relaxed mb-4 italic pl-3 border-l-2 border-[#FF8533]/50">
            "{memory.generatedContent || memory.story}"
          </blockquote>

          {/* Quick Details Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] text-[#C1B5C8]">
            {memory.favoriteFood && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#140E20] border border-white/10 text-[#FFF9F0]">
                <Utensils className="w-3 h-3 text-[#FF8533]" />
                <span className="line-clamp-1 max-w-[130px]">{memory.favoriteFood}</span>
              </span>
            )}
            {memory.favoriteSong && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#140E20] border border-white/10 text-[#FFF9F0]">
                <Music className="w-3 h-3 text-[#F3C978]" />
                <span className="line-clamp-1 max-w-[130px]">{memory.favoriteSong}</span>
              </span>
            )}
            {memory.favoritePlace && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#140E20] border border-white/10 text-[#FFF9F0]">
                <MapPin className="w-3 h-3 text-[#FF8533]" />
                <span className="line-clamp-1 max-w-[130px]">{memory.favoritePlace}</span>
              </span>
            )}
            {memory.favoriteSaying && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#140E20] border border-white/10 text-[#FFF9F0]">
                <Quote className="w-3 h-3 text-[#F3C978]" />
                <span className="line-clamp-1 max-w-[130px]">"{memory.favoriteSaying}"</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer Row: Date & Action Toolbar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#C1B5C8]">
          <span className="text-[11px] font-medium opacity-80">{dateFormatted}</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl bg-[#140E20]/80 hover:bg-[#140E20] hover:text-[#F3C978] transition-colors"
              title="Copy text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="p-2 rounded-xl bg-[#140E20]/80 hover:bg-[#140E20] hover:text-[#F3C978] transition-colors"
              title="Download Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(memory);
              }}
              className="p-2 rounded-xl bg-[#140E20]/80 hover:bg-[#140E20] hover:text-[#F3C978] transition-colors"
              title="Edit memory"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-2 rounded-xl bg-[#140E20]/80 hover:bg-rose-950/70 hover:text-rose-400 transition-colors"
              title="Delete memory"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmDelete(false);
          }}
        >
          <div
            className="w-full max-w-sm bg-[#231A33] border border-rose-500/40 rounded-3xl p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h4 className="font-serif-title text-lg font-bold text-[#FFF9F0]">
                Extinguish this Memory?
              </h4>
            </div>
            <p className="text-xs text-[#C1B5C8] leading-relaxed">
              Are you sure you want to remove <strong className="text-[#FFF9F0]">"{memory.title}"</strong> from your local Ofrenda? This will permanently delete the record from this device's IndexedDB.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#FFF9F0] hover:bg-[#140E20] transition-colors"
              >
                Keep Memory
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
