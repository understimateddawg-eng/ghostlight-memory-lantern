/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  Check,
  Copy,
  Download,
  RotateCcw,
  Edit3,
  Sparkles,
  Save,
  PlusCircle,
  AlertTriangle,
  FileText,
  Cpu,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryRecord, ModelProgressInfo } from '../types/memory';
import { CandleIllustration } from './CandleIllustration';
import { exportMemoryToMarkdown } from '../lib/storage';

interface GenerationPanelProps {
  currentRecord: MemoryRecord | null;
  isGenerating: boolean;
  streamingText: string;
  progressInfo: ModelProgressInfo;
  onSaveToOfrenda: (updatedRecord: MemoryRecord) => Promise<void>;
  onRegenerate: () => void;
  onSwitchToTemplateMode: () => void;
  onNewMemory: () => void;
  onCancelGeneration?: () => void;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({
  currentRecord,
  isGenerating,
  streamingText,
  progressInfo,
  onSaveToOfrenda,
  onRegenerate,
  onSwitchToTemplateMode,
  onNewMemory,
  onCancelGeneration,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(currentRecord?.generatedContent || '');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync editedText when record changes or streaming completes
  React.useEffect(() => {
    if (currentRecord) {
      setEditedText(currentRecord.generatedContent);
      setIsSaved(false);
    }
  }, [currentRecord]);

  const activeContent = isGenerating
    ? streamingText
    : isEditing
    ? editedText
    : currentRecord?.generatedContent || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handleDownload = () => {
    if (!currentRecord) return;
    const toExport: MemoryRecord = {
      ...currentRecord,
      generatedContent: activeContent,
    };
    exportMemoryToMarkdown(toExport);
  };

  const handleSave = async () => {
    if (!currentRecord) return;
    const updated: MemoryRecord = {
      ...currentRecord,
      generatedContent: isEditing ? editedText : currentRecord.generatedContent,
      updatedAt: new Date().toISOString(),
    };
    await onSaveToOfrenda(updated);
    setIsSaved(true);
    setIsEditing(false);

    // Warm golden celebration confetti
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#F3C978', '#FF8533', '#FFF9F0', '#F4A261', '#E76F51'],
      });
    } catch {
      // Ignored if confetti fails
    }
  };

  const modeTitles = {
    tribute: '🕯️ A Light of Remembrance',
    letter: '✉️ A Letter to Remember',
    poem: '🌻 A Marigold Poem',
    story: '🌙 A Whisper After Midnight',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Loading & Inference State Banner */}
      {isGenerating && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#2E2242] to-[#231A33] border border-[#FF8533]/50 shadow-[0_0_40px_rgba(255,133,51,0.3)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#140E20] border border-[#FF8533]/60 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                <Flame className="w-6 h-6 text-[#FF8533]" />
              </div>
              <div>
                <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#FFF9F0]">
                  {progressInfo.state === 'generating'
                    ? "The Lantern is Whispering..."
                    : progressInfo.state === 'downloading'
                    ? "Downloading Model Weights (In Browser Cache)..."
                    : progressInfo.state === 'compiling'
                    ? "Compiling WebGPU Shaders..."
                    : "Preparing Local Engine..."}
                </h3>
                <p className="text-xs text-[#C1B5C8] font-mono">
                  {progressInfo.statusText}
                </p>
              </div>
            </div>

            {progressInfo.progressPercent > 0 && progressInfo.progressPercent < 100 && (
              <span className="text-sm font-mono font-bold text-[#F3C978] bg-[#140E20] px-3 py-1 rounded-full border border-white/10">
                {progressInfo.progressPercent}%
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#140E20] h-2.5 rounded-full overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-[#FF8533] via-[#F3C978] to-[#FF8533] h-full transition-all duration-300 shadow-[0_0_12px_rgba(255,133,51,0.5)]"
              style={{
                width: `${
                  progressInfo.state === 'generating'
                    ? 100
                    : Math.max(8, progressInfo.progressPercent)
                }%`,
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#C1B5C8] gap-3 pt-1">
            <p className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inference is running locally in your browser. Zero memory data is transmitted online.</span>
            </p>
            {onCancelGeneration && (
              <button
                type="button"
                onClick={onCancelGeneration}
                className="text-rose-400 hover:underline cursor-pointer"
              >
                Cancel Generation
              </button>
            )}
          </div>
        </div>
      )}

      {/* Model Error Fallback Banner */}
      {progressInfo.state === 'error' && (
        <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-800/60 space-y-3.5 shadow-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-200">
                Local AI Engine could not complete on this device
              </h4>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                {progressInfo.error || "WebGPU initialization failed or the model weights could not be loaded into device memory."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onSwitchToTemplateMode}
              className="px-5 py-2.5 rounded-full bg-[#F3C978] text-[#0B0813] font-bold text-xs hover:brightness-110 cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Continue with Instant Template Mode</span>
            </button>
            <button
              onClick={onRegenerate}
              className="px-4 py-2.5 rounded-full bg-[#231A33] border border-white/15 text-xs text-[#FFF9F0] hover:bg-[#140E20] cursor-pointer"
            >
              Retry Local AI
            </button>
          </div>
        </div>
      )}

      {/* Main Memory Result Altar Card */}
      {currentRecord && (
        <div className="bg-[#231A33] border border-[#F3C978]/40 rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
          {/* Card Header & Metadata */}
          <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-b from-[#2E2242] to-[#231A33] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full bg-[#FF8533]/20 text-[#F3C978] border border-[#FF8533]/40">
                  {modeTitles[currentRecord.mode] || currentRecord.mode}
                </span>
                <span className="text-xs text-[#C1B5C8] capitalize font-medium">
                  Tone: {currentRecord.tone}
                </span>
                <span className="text-xs text-[#C1B5C8] uppercase font-medium">
                  ({currentRecord.language})
                </span>
              </div>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFF9F0]">
                {currentRecord.title}
              </h2>
              {currentRecord.relationship && (
                <p className="text-xs text-[#F3C978] font-medium">
                  Relationship: <span className="text-[#FFF9F0]">{currentRecord.relationship}</span>
                </p>
              )}
            </div>

            {/* Candle status indicator */}
            <div className="flex items-center gap-3">
              <CandleIllustration isLit={true} size="sm" interactive={false} showGarland={false} />
            </div>
          </div>

          {/* Honest Generation Source Pill */}
          <div className="px-6 sm:px-8 py-2.5 bg-[#140E20] border-b border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#F3C978]" />
              <span className="text-[#C1B5C8]">Source:</span>
              <span className="font-semibold text-[#FFF9F0]">
                {currentRecord.generationSource === 'local-ai'
                  ? `Local Open-Weight AI (${currentRecord.modelUsed || 'Llama 3.2 1B Instruct'})`
                  : currentRecord.generationSource === 'sample'
                  ? 'Fictional Sample Demonstration'
                  : 'Deterministic Template Mode (No AI)'}
              </span>
            </div>
            <span className="text-[11px] text-[#C1B5C8]/70 hidden sm:inline">
              Saved strictly in browser IndexedDB
            </span>
          </div>

          {/* Tribute Text Reading Area */}
          <div className="p-6 sm:p-10">
            {isEditing ? (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#F3C978] uppercase tracking-wider">
                  Edit Tribute or Remembrance Text
                </label>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={12}
                  className="w-full bg-[#140E20] border border-[#F3C978]/50 rounded-2xl p-4 font-literary text-lg text-[#FFF9F0] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#F3C978]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditedText(currentRecord.generatedContent);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-full text-xs text-[#C1B5C8] hover:text-[#FFF9F0]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 rounded-full bg-[#F3C978] text-[#0B0813] font-bold text-xs shadow-md"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="font-literary text-lg sm:text-xl text-[#FFF9F0] leading-relaxed whitespace-pre-line tracking-wide bg-[#140E20]/40 p-6 sm:p-8 rounded-2xl border border-white/5">
                  {activeContent}
                  {isGenerating && (
                    <span className="inline-block w-2.5 h-5 ml-1 bg-[#F3C978] animate-pulse align-middle" />
                  )}
                </div>

                {/* Optional Attached Photo */}
                {currentRecord.photoDataUrl && (
                  <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                    <img
                      src={currentRecord.photoDataUrl}
                      alt={currentRecord.title}
                      className="w-20 h-20 object-cover rounded-2xl border-2 border-[#F3C978]/50 shadow-md"
                    />
                    <div className="text-xs text-[#C1B5C8]">
                      <p className="font-semibold text-[#FFF9F0]">Cherished Photograph</p>
                      <p>Preserved in local device storage.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="p-4 sm:p-6 bg-[#140E20] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Edit Toggle */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-full bg-[#231A33] border border-white/10 hover:border-[#F3C978]/50 text-xs text-[#FFF9F0] hover:text-[#F3C978] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Preview' : 'Edit Text'}</span>
              </button>

              {/* Regenerate */}
              <button
                onClick={onRegenerate}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-full bg-[#231A33] border border-white/10 hover:border-[#F3C978]/50 text-xs text-[#FFF9F0] hover:text-[#F3C978] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-full bg-[#231A33] border border-white/10 hover:border-[#F3C978]/50 text-xs text-[#FFF9F0] hover:text-[#F3C978] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Download Markdown */}
              <button
                onClick={handleDownload}
                className="px-3.5 py-2 rounded-full bg-[#231A33] border border-white/10 hover:border-[#F3C978]/50 text-xs text-[#FFF9F0] hover:text-[#F3C978] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
                <span>.md</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Start Another Memory */}
              <button
                onClick={onNewMemory}
                className="px-4 py-2 rounded-full text-xs text-[#C1B5C8] hover:text-[#FFF9F0] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Memory</span>
              </button>

              {/* Save to My Ofrenda with warm ember gradient */}
              <button
                onClick={handleSave}
                disabled={isGenerating}
                className={`px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-md ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-[#FF8533] via-[#F3C978] to-[#FF8533] text-[#0B0813] hover:brightness-110 active:scale-95 shadow-[0_0_18px_rgba(255,133,51,0.4)]'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Saved to Ofrenda' : 'Save to My Ofrenda'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
