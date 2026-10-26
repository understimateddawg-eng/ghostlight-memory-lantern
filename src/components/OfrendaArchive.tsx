/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Flame,
  Sparkles,
  BookOpen,
  ArrowUpDown,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { MemoryRecord, GenerationMode } from '../types/memory';
import { MemoryCard } from './MemoryCard';
import {
  exportArchiveAsJson,
  importArchiveFromJson,
  SAMPLE_MEMORY,
  saveMemory,
} from '../lib/storage';

interface OfrendaArchiveProps {
  memories: MemoryRecord[];
  onOpenMemory: (memory: MemoryRecord) => void;
  onEditMemory: (memory: MemoryRecord) => void;
  onDeleteMemory: (id: string) => Promise<void>;
  onClearAll: () => Promise<void>;
  onNewMemory: () => void;
  onRefresh: () => Promise<void>;
}

export const OfrendaArchive: React.FC<OfrendaArchiveProps> = ({
  memories,
  onOpenMemory,
  onEditMemory,
  onDeleteMemory,
  onClearAll,
  onNewMemory,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | GenerationMode>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & sort logic
  const filteredMemories = useMemo(() => {
    let result = [...memories];

    // Filter by mode
    if (filterMode !== 'all') {
      result = result.filter((m) => m.mode === filterMode);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.relationship && m.relationship.toLowerCase().includes(q)) ||
          m.story.toLowerCase().includes(q) ||
          m.generatedContent.toLowerCase().includes(q) ||
          (m.favoriteFood && m.favoriteFood.toLowerCase().includes(q)) ||
          (m.favoriteSong && m.favoriteSong.toLowerCase().includes(q)) ||
          (m.favoritePlace && m.favoritePlace.toLowerCase().includes(q)) ||
          (m.favoriteSaying && m.favoriteSaying.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [memories, filterMode, searchQuery, sortBy]);

  const handleExportArchive = () => {
    exportArchiveAsJson(memories);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importArchiveFromJson(text);
      setImportStatus(res.message);
      await onRefresh();
      setTimeout(() => setImportStatus(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setImportStatus(`Import failed: ${msg}`);
      setTimeout(() => setImportStatus(null), 4000);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRestoreSample = async () => {
    localStorage.removeItem('ghostlight_sample_dismissed');
    await saveMemory(SAMPLE_MEMORY);
    await onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* Altar Banner & Header with warm candlelit gradient */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1A1228] via-[#241B35] to-[#1A1228] border border-[#F3C978]/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Decorative corner glows */}
        <div className="absolute top-0 left-0 w-44 h-44 bg-[radial-gradient(ellipse_at_top_left,rgba(255,133,51,0.2)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(ellipse_at_top_right,rgba(243,201,120,0.2)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF8533]/20 border border-[#FF8533]/40 text-[#F3C978] text-xs font-bold uppercase tracking-wider shadow-sm">
              <Flame className="w-4 h-4 text-[#FF8533]" />
              <span>Digital Remembrance Altar</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#FFF9F0]">
              The Ofrenda Archive
            </h2>
            <p className="text-sm sm:text-base text-[#C1B5C8] leading-relaxed">
              Every card here holds a lit candle for a person, place, or memory you cherish.
              Stored exclusively in your browser’s IndexedDB for private remembrance.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewMemory}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF8533] via-[#F3C978] to-[#FF8533] text-[#0B0813] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_18px_rgba(255,133,51,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 fill-[#0B0813]" />
              <span>Light a Lantern</span>
            </button>

            <button
              onClick={handleExportArchive}
              disabled={memories.length === 0}
              className="px-4 py-2.5 rounded-full bg-[#231A33] border border-white/10 hover:border-[#F3C978]/50 text-xs text-[#FFF9F0] hover:text-[#F3C978] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Export all memories as JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-[#F3C978]" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-full bg-[#231A33] border border-white/10 hover:border-[#F3C978]/50 text-xs text-[#FFF9F0] hover:text-[#F3C978] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Import memories from JSON backup"
            >
              <Upload className="w-3.5 h-3.5 text-[#F3C978]" />
              <span>Import JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json,application/json"
              className="hidden"
            />

            {memories.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2.5 rounded-full bg-[#231A33] border border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                title="Clear all stored memories"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Import notification banner */}
        {importStatus && (
          <div className="mt-4 p-3 rounded-xl bg-[#231A33] border border-[#F3C978] text-xs text-[#F3C978] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF8533]" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="p-4 rounded-3xl bg-[#231A33] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#C1B5C8] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, place, song, story..."
            className="w-full bg-[#140E20] border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-xs sm:text-sm text-[#FFF9F0] placeholder-[#C1B5C8]/50 focus:border-[#F3C978] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#C1B5C8] hover:text-[#FFF9F0]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All Modes' },
              { id: 'tribute', label: '🕯️ Tributes' },
              { id: 'letter', label: '✉️ Letters' },
              { id: 'poem', label: '🌻 Poems' },
              { id: 'story', label: '🌙 Midnight' },
            ] as const
          ).map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterMode(pill.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === pill.id
                  ? 'bg-gradient-to-r from-[#FF8533] to-[#F3C978] text-[#0B0813] shadow-[0_0_12px_rgba(255,133,51,0.35)] scale-105'
                  : 'bg-[#140E20] text-[#C1B5C8] border border-white/10 hover:border-white/25 hover:text-[#FFF9F0]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#C1B5C8]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'alphabetical')}
            className="bg-[#140E20] border border-white/10 rounded-full px-4 py-2 text-xs font-medium text-[#FFF9F0] focus:border-[#F3C978] focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Memory Cards Grid or Empty State */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onOpen={onOpenMemory}
              onEdit={onEditMemory}
              onDelete={onDeleteMemory}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-[#1A1228]/60 border border-dashed border-white/15 rounded-3xl space-y-5 max-w-xl mx-auto shadow-inner">
          <div className="w-16 h-16 rounded-full bg-[#231A33] border border-[#F3C978]/40 flex items-center justify-center mx-auto text-[#F3C978] shadow-[0_0_20px_rgba(255,133,51,0.25)]">
            <Flame className="w-8 h-8 text-[#FF8533]" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif-title text-xl font-bold text-[#FFF9F0]">
              {searchQuery || filterMode !== 'all'
                ? 'No matching memories found'
                : 'The Ofrenda is currently quiet'}
            </h3>
            <p className="text-xs sm:text-sm text-[#C1B5C8] max-w-md mx-auto leading-relaxed">
              {searchQuery || filterMode !== 'all'
                ? 'Try adjusting your search query or mode filter to reveal preserved memories.'
                : 'No memories have been placed upon this altar yet. Kindle your first candle or restore the sample memory to explore.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onNewMemory}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF8533] to-[#F3C978] text-[#0B0813] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 fill-[#0B0813]" />
              <span>Light a Lantern Now</span>
            </button>

            <button
              onClick={handleRestoreSample}
              className="px-4 py-2.5 rounded-full bg-[#231A33] border border-[#F3C978]/40 text-xs font-semibold text-[#FFF9F0] hover:text-[#F3C978] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F3C978]" />
              <span>Restore Sample Memory</span>
            </button>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="w-full max-w-md bg-[#231A33] border border-rose-500/40 rounded-3xl p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h4 className="font-serif-title text-lg font-bold text-[#FFF9F0]">
                Clear All Memories in Ofrenda?
              </h4>
            </div>
            <p className="text-xs text-[#C1B5C8] leading-relaxed">
              This will permanently delete all <strong className="text-[#FFF9F0]">{memories.length} memories</strong> from your device’s IndexedDB storage. If you want to keep them, please click "Export JSON" first.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#FFF9F0] hover:bg-[#140E20]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onClearAll();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
