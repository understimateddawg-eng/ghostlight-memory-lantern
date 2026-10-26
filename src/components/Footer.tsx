/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Shield, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenModelStatus: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenModelStatus,
  onOpenPrivacy,
}) => {
  return (
    <footer className="border-t border-[#F4EBDD]/10 bg-[#0B0A10] text-[#B6AABA] text-xs pt-12 pb-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Brand & Tagline */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#17121F] border border-[#E7BD72]/30 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-[#E98736]" />
              </div>
              <span className="font-serif-title text-base font-bold text-[#F4EBDD] tracking-wider">
                GHOSTLIGHT — THE MEMORY LANTERN
              </span>
            </div>
            <p className="font-literary text-sm italic text-[#E7BD72]">
              “Every story leaves a light.”
            </p>
          </div>

          {/* Hacktoberfest Badge */}
          <div className="p-3 rounded-xl bg-[#17121F] border border-[#E98736]/30 text-xs space-y-1">
            <p className="font-semibold text-[#F4EBDD] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E98736]" />
              <span>Hacktoberfest Open-Source AI Challenge Week 4</span>
            </p>
            <p className="text-[11px] text-[#B6AABA]">
              Theme: “Ghost in the Machine” — Local, Browser-Based AI Remembrance
            </p>
          </div>
        </div>

        {/* Multi-License & Technical Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-semibold text-[#F4EBDD] uppercase tracking-wider text-[10px]">
              Application Code
            </h4>
            <p>
              Released under the{' '}
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noreferrer"
                className="text-[#E7BD72] hover:underline"
              >
                MIT License
              </a>
              . Inspectable, forkable, and static-hostable on GitHub Pages.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-[#F4EBDD] uppercase tracking-wider text-[10px]">
              Open-Weight AI Model
            </h4>
            <p>
              Runs{' '}
              <a
                href="https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC"
                target="_blank"
                rel="noreferrer"
                className="text-[#E7BD72] hover:underline"
              >
                Llama-3.2-1B-Instruct-q4f16_1-MLC
              </a>
              . Subject to the{' '}
              <a
                href="https://llama.meta.com/llama3/license/"
                target="_blank"
                rel="noreferrer"
                className="text-[#E7BD72] hover:underline"
              >
                Meta Llama 3.2 Community License
              </a>
              .
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-[#F4EBDD] uppercase tracking-wider text-[10px]">
              Browser Engine & WebGPU
            </h4>
            <p>
              In-browser inference powered by{' '}
              <a
                href="https://github.com/mlc-ai/web-llm"
                target="_blank"
                rel="noreferrer"
                className="text-[#E7BD72] hover:underline"
              >
                @mlc-ai/web-llm
              </a>{' '}
              under the Apache 2.0 License. Client-side execution with zero server telemetry.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#B6AABA]/80 gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#E7BD72] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Privacy & Storage Guarantee</span>
            </button>
            <span>•</span>
            <button
              onClick={onOpenModelStatus}
              className="hover:text-[#E7BD72] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Cpu className="w-3 h-3" />
              <span>Local Model Diagnostics</span>
            </button>
          </div>

          <p className="text-center sm:text-right">
            Inspired by Día de los Muertos remembrance traditions. Designed with reverence.
          </p>
        </div>
      </div>
    </footer>
  );
};
