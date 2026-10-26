/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Cpu, Flame, Menu, X, BookOpen, Layers } from 'lucide-react';
import { subscribeToModelProgress, checkWebGPUSupport } from '../lib/localAI';
import { ModelProgressInfo } from '../types/memory';

interface HeaderProps {
  currentTab: 'ofrenda' | 'create' | 'how-it-works' | 'open-innovation';
  onSelectTab: (tab: 'ofrenda' | 'create' | 'how-it-works' | 'open-innovation') => void;
  memoryCount: number;
  onOpenModelStatus: () => void;
  onOpenPrivacy: () => void;
  onNewMemory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  memoryCount,
  onOpenModelStatus,
  onOpenPrivacy,
  onNewMemory,
}) => {
  const [modelProgress, setModelProgress] = useState<ModelProgressInfo>({
    state: 'idle',
    statusText: 'Local model not loaded',
    progressPercent: 0,
  });
  const [webGpuSupported, setWebGpuSupported] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToModelProgress((info) => {
      setModelProgress(info);
    });

    checkWebGPUSupport().then((res) => {
      setWebGpuSupported(res.supported);
    });

    return unsub;
  }, []);

  const getStatusBadge = () => {
    if (webGpuSupported === false) {
      return {
        label: 'Template Mode',
        sublabel: 'WebGPU unavailable',
        color: 'bg-amber-950/70 text-[#F3C978] border-amber-800/50 hover:bg-amber-900/50',
        dot: 'bg-amber-400',
      };
    }
    if (modelProgress.state === 'ready') {
      return {
        label: 'Local AI Ready',
        sublabel: 'WebGPU Active',
        color: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/50',
        dot: 'bg-emerald-400 animate-pulse',
      };
    }
    if (modelProgress.state === 'downloading' || modelProgress.state === 'compiling' || modelProgress.state === 'generating') {
      return {
        label: modelProgress.state === 'generating' ? 'Generating...' : `Loading AI (${modelProgress.progressPercent}%)`,
        sublabel: 'In Browser',
        color: 'bg-[#FF8533]/25 text-[#F3C978] border-[#FF8533]/50 hover:bg-[#FF8533]/35',
        dot: 'bg-[#FF8533] animate-ping',
      };
    }
    return {
      label: 'Local AI',
      sublabel: 'On Demand',
      color: 'bg-[#231A33] text-[#C1B5C8] border-white/10 hover:border-[#F3C978]/50 hover:text-[#FFF9F0]',
      dot: 'bg-[#F3C978]/80',
    };
  };

  const badge = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B0813]/90 border-b border-[#FFF9F0]/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo - cleanly structured without colliding badges */}
        <div
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={() => onSelectTab('ofrenda')}
        >
          {/* Flame Icon Avatar with warm playful pulse */}
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-[#2E2242] via-[#231A33] to-[#140E20] border border-[#F3C978]/40 flex items-center justify-center shadow-[0_0_18px_rgba(255,133,51,0.3)] group-hover:border-[#F3C978] group-hover:shadow-[0_0_24px_rgba(255,133,51,0.5)] group-hover:scale-105 transition-all">
            <Flame className="w-5 h-5 text-[#FF8533] group-hover:text-[#F3C978] transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0813]" title="Client-side engine active" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif-title text-xl font-bold tracking-[0.16em] text-[#FFF9F0] group-hover:text-[#F3C978] transition-colors leading-none">
                GHOSTLIGHT
              </span>
            </div>
            {/* Integrated subtitle with 100% Local AI badge - perfectly fitted, zero collisions */}
            <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#C1B5C8] font-medium mt-1">
              <span>The Memory Lantern</span>
              <span className="w-1 h-1 rounded-full bg-[#FF8533]" />
              <span className="text-[#F3C978] font-semibold bg-[#FF8533]/15 px-1.5 py-0.2 rounded border border-[#FF8533]/30 whitespace-nowrap">
                100% Local AI
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - elevated island with pill buttons */}
        <nav className="hidden xl:flex items-center gap-1 p-1.5 rounded-full bg-[#181226]/90 border border-white/10 backdrop-blur-md shadow-inner shrink-0">
          <button
            onClick={() => onSelectTab('ofrenda')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'ofrenda'
                ? 'bg-gradient-to-r from-[#2E2242] to-[#231A33] text-[#F3C978] border border-[#F3C978]/40 shadow-[0_0_14px_rgba(243,201,120,0.25)]'
                : 'text-[#FFF9F0]/80 hover:text-[#FFF9F0] hover:bg-white/5'
            }`}
          >
            <span>The Ofrenda</span>
            {memoryCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FF8533]/25 text-[#F3C978] font-bold border border-[#FF8533]/40">
                {memoryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('create')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'create'
                ? 'bg-gradient-to-r from-[#2E2242] to-[#231A33] text-[#F3C978] border border-[#F3C978]/40 shadow-[0_0_14px_rgba(243,201,120,0.25)]'
                : 'text-[#FFF9F0]/80 hover:text-[#FFF9F0] hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF8533]" />
            <span>Create a Memory</span>
          </button>

          <button
            onClick={() => onSelectTab('how-it-works')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'how-it-works'
                ? 'bg-gradient-to-r from-[#2E2242] to-[#231A33] text-[#F3C978] border border-[#F3C978]/40'
                : 'text-[#FFF9F0]/80 hover:text-[#FFF9F0] hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C1B5C8]" />
            <span>How It Works</span>
          </button>

          <button
            onClick={() => onSelectTab('open-innovation')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'open-innovation'
                ? 'bg-gradient-to-r from-[#2E2242] to-[#231A33] text-[#F3C978] border border-[#F3C978]/40'
                : 'text-[#FFF9F0]/80 hover:text-[#FFF9F0] hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#C1B5C8]" />
            <span>Open Innovation</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* AI / WebGPU status pill with live indicator */}
          <button
            onClick={onOpenModelStatus}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${badge.color}`}
            title="Inspect local model, WebGPU status, or preload weights"
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
            <Cpu className="w-3.5 h-3.5 text-[#F3C978]" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-semibold text-[11px]">{badge.label}</span>
              <span className="text-[10px] opacity-75 hidden xl:inline">({badge.sublabel})</span>
            </div>
          </button>

          {/* Privacy badge */}
          <button
            onClick={onOpenPrivacy}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-[#F3C978]/40 bg-[#1A1228] text-[#C1B5C8] hover:text-[#FFF9F0] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Privacy, Storage & Zero-Server Guarantee"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px]">Private by Design</span>
          </button>

          {/* New Memory CTA with warm ember glow */}
          <button
            onClick={onNewMemory}
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#FF8533] via-[#F3C978] to-[#FF8533] bg-[length:200%_auto] hover:bg-right text-[#0B0813] shadow-[0_0_20px_rgba(255,133,51,0.4)] hover:shadow-[0_0_28px_rgba(255,133,51,0.6)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Flame className="w-3.5 h-3.5 fill-[#0B0813]" />
            <span>Light a Lantern</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={onNewMemory}
            className="px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-[#FF8533] to-[#F3C978] text-[#0B0813] font-bold md:hidden"
          >
            Light Lantern
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#231A33] border border-white/10 text-[#FFF9F0] hover:text-[#F3C978] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-4 pt-3 pb-6 bg-[#140E20] border-b border-[#FFF9F0]/15 space-y-2">
          <button
            onClick={() => {
              onSelectTab('ofrenda');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
              currentTab === 'ofrenda' ? 'bg-[#231A33] text-[#F3C978]' : 'text-[#FFF9F0]'
            }`}
          >
            <span>The Ofrenda</span>
            {memoryCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF8533]/25 text-[#F3C978]">
                {memoryCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onSelectTab('create');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
              currentTab === 'create' ? 'bg-[#231A33] text-[#F3C978]' : 'text-[#FFF9F0]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FF8533]" />
            <span>Create a Memory</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('how-it-works');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
              currentTab === 'how-it-works' ? 'bg-[#231A33] text-[#F3C978]' : 'text-[#FFF9F0]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C1B5C8]" />
            <span>How It Works</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('open-innovation');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
              currentTab === 'open-innovation' ? 'bg-[#231A33] text-[#F3C978]' : 'text-[#FFF9F0]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C1B5C8]" />
            <span>Open Innovation</span>
          </button>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenModelStatus();
                setMobileMenuOpen(false);
              }}
              className="text-left px-4 py-2.5 rounded-xl bg-[#231A33] text-xs text-[#F3C978] flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>{badge.label} • {badge.sublabel}</span>
            </button>
            <button
              onClick={() => {
                onOpenPrivacy();
                setMobileMenuOpen(false);
              }}
              className="text-left px-4 py-2.5 rounded-xl bg-[#231A33] text-xs text-[#C1B5C8] flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Storage (100% Client-Side)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
