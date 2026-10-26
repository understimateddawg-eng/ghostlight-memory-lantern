/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldCheck,
  HardDrive,
  Lock,
  Download,
  Trash2,
  EyeOff,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import { getAllMemories, exportArchiveAsJson, clearAllMemories } from '../lib/storage';

interface PrivacyPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshArchive: () => Promise<void>;
}

export const PrivacyPanelModal: React.FC<PrivacyPanelModalProps> = ({
  isOpen,
  onClose,
  onRefreshArchive,
}) => {
  const [memoryCount, setMemoryCount] = useState<number>(0);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getAllMemories().then((res) => setMemoryCount(res.length));
    setClearedNotice(false);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = async () => {
    const records = await getAllMemories();
    exportArchiveAsJson(records);
  };

  const handleClearAll = async () => {
    if (confirm('Delete all memories from this browser? This action cannot be reversed.')) {
      await clearAllMemories();
      await onRefreshArchive();
      setMemoryCount(0);
      setClearedNotice(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#201A28] border border-[#E7BD72]/40 rounded-3xl overflow-hidden shadow-2xl my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-[#292233] to-[#201A28] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#F4EBDD]">
                Privacy, Data Ownership & Storage
              </h3>
              <p className="text-xs text-[#B6AABA]">
                Your sacred memories stay on this device alone.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#17121F] text-[#B6AABA] hover:text-[#F4EBDD] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          {clearedNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs">
              All memories have been permanently cleared from this device.
            </div>
          )}

          {/* Core Guarantees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#17121F] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#E7BD72] font-semibold text-xs uppercase tracking-wider">
                <HardDrive className="w-4 h-4" />
                <span>100% Client-Side Storage</span>
              </div>
              <p className="text-xs text-[#B6AABA] leading-relaxed">
                All records, stories, photos, and tributes are stored locally in your browser’s <strong>IndexedDB</strong> database (<code className="text-[#E7BD72]">GhostlightOfrendaDB</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17121F] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Zero Remote Servers</span>
              </div>
              <p className="text-xs text-[#B6AABA] leading-relaxed">
                There are no cloud databases, no user accounts, no logins, and no remote endpoints receiving your tributes or photographs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17121F] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#F4A261] font-semibold text-xs uppercase tracking-wider">
                <EyeOff className="w-4 h-4" />
                <span>No Tracking or Telemetry</span>
              </div>
              <p className="text-xs text-[#B6AABA] leading-relaxed">
                We never log user keystrokes, personal names, or story texts. No analytics, tracking pixels, or third-party advertising scripts exist.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17121F] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#E7BD72] font-semibold text-xs uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                <span>Local AI Inference</span>
              </div>
              <p className="text-xs text-[#B6AABA] leading-relaxed">
                Language model inference occurs directly on your GPU using WebLLM and WebGPU. Model weights run inside browser sandbox memory.
              </p>
            </div>
          </div>

          {/* Device Data Management */}
          <div className="p-4 rounded-2xl bg-[#17121F] border border-white/10 space-y-3">
            <h4 className="font-semibold text-[#F4EBDD] flex items-center justify-between">
              <span>Current Device Archive</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E98736]/20 text-[#E7BD72] border border-[#E98736]/30">
                {memoryCount} {memoryCount === 1 ? 'Record' : 'Records'} Stored
              </span>
            </h4>
            <p className="text-xs text-[#B6AABA] leading-relaxed">
              Because data is tied to this specific browser and profile, clearing your browser’s site storage or using an Incognito session will remove these records unless you export a backup.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={handleExport}
                disabled={memoryCount === 0}
                className="px-4 py-2 rounded-xl bg-[#201A28] border border-[#E7BD72]/40 text-[#E7BD72] hover:bg-[#292233] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Entire Archive (JSON)</span>
              </button>

              {memoryCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 hover:bg-rose-900/60 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete All Stored Records</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#17121F] border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E98736] to-[#E7BD72] text-[#0B0A10] font-bold text-xs hover:brightness-110 cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
