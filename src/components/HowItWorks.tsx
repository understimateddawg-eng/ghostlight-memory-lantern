/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Cpu,
  Layers,
  Heart,
  Globe,
  Terminal,
  Code2,
  Lock,
} from 'lucide-react';

interface HowItWorksProps {
  onLightLantern: () => void;
  onExploreSample: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onLightLantern,
  onExploreSample,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-24">
      {/* Intro Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E98736]/15 border border-[#E98736]/30 text-[#E7BD72] text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Philosophy of Ghostlight</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#F4EBDD]">
          How Ghostlight Works
        </h2>
        <p className="text-base sm:text-lg text-[#B6AABA] max-w-2xl mx-auto leading-relaxed">
          A respectful fusion of ancestral remembrance traditions and modern open-source technology, designed to keep what matters closest to home.
        </p>
      </div>

      {/* The 3 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="bg-[#201A28] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:border-[#E7BD72]/50 transition-all shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#17121F] border border-[#E98736]/40 flex items-center justify-center text-[#E98736] font-serif-title text-xl font-bold">
            1
          </div>
          <h3 className="font-serif-title text-xl font-bold text-[#F4EBDD]">
            REMEMBER
          </h3>
          <p className="text-xs uppercase tracking-wider text-[#E98736] font-semibold">
            Write Down What Matters
          </p>
          <p className="text-sm text-[#B6AABA] leading-relaxed">
            Begin with a name and a memory. Add the small textures that made them irreplaceable—the coffee they brewed, the melody they hummed, or the advice they gave during hard seasons.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#201A28] border border-[#E7BD72]/40 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:border-[#E7BD72] transition-all shadow-xl ring-1 ring-[#E7BD72]/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E98736] to-[#E7BD72] text-[#0B0A10] flex items-center justify-center font-serif-title text-xl font-bold shadow-md">
            2
          </div>
          <h3 className="font-serif-title text-xl font-bold text-[#F4EBDD]">
            ILLUMINATE
          </h3>
          <p className="text-xs uppercase tracking-wider text-[#E7BD72] font-semibold">
            In-Browser Open-Weight AI
          </p>
          <p className="text-sm text-[#B6AABA] leading-relaxed">
            Select from 4 creation modes (Tribute, Letter, Poem, or Midnight Tale). An open-weight model (Llama 3.2 1B Instruct) runs locally on your GPU via WebLLM—never transmitting your words to a server.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#201A28] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:border-[#E7BD72]/50 transition-all shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#17121F] border border-[#E7BD72]/40 flex items-center justify-center text-[#E7BD72] font-serif-title text-xl font-bold">
            3
          </div>
          <h3 className="font-serif-title text-xl font-bold text-[#F4EBDD]">
            PRESERVE
          </h3>
          <p className="text-xs uppercase tracking-wider text-[#E7BD72] font-semibold">
            Local Archive & Export
          </p>
          <p className="text-sm text-[#B6AABA] leading-relaxed">
            Place the memory on your personal digital ofrenda. Save records to your browser’s IndexedDB, export clean JSON backups, or download Markdown files for your family archives.
          </p>
        </div>
      </div>

      {/* Cultural Reverence Section: Día de los Muertos & The Ofrenda */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#17121F] via-[#201A28] to-[#17121F] border border-[#E98736]/30 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#E98736]/15 border border-[#E98736]/40 text-[#E98736]">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title text-2xl font-bold text-[#F4EBDD]">
                The Spirit of the Ofrenda
              </h3>
              <p className="text-xs text-[#E7BD72] uppercase tracking-wider">
                Remembrance as an Act of Living Love
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm text-[#F4EBDD]/90 leading-relaxed font-literary text-base sm:text-lg">
          <p>
            In Mexican and Latin American tradition, <em>Día de los Muertos</em> is not an occasion of gloom or horror. It is a joyful, tender reunion—a time when families build altars (<em>ofrendas</em>) adorned with golden marigold petals (<em>cempasúchil</em>), glowing tapers, photographs, and the favorite foods of those who walked before us.
          </p>
          <p>
            The fragrance of the flowers and the warmth of the candles are believed to form a luminous pathway guiding souls home to be celebrated.
          </p>
          <p>
            Ghostlight borrows this sacred philosophy: grief transformed into celebration, and absence made bearable through active storytelling. We never pretend that software can speak to spirits; rather, software becomes the paper, the ink, and the lantern holding the stories we refuse to lose.
          </p>
        </div>
      </div>

      {/* Open Innovation Section */}
      <div id="open-innovation" className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7BD72]/15 border border-[#E7BD72]/30 text-[#E7BD72] text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Open-Source AI Challenge Week 4</span>
          </div>
          <h3 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#F4EBDD]">
            Why Open Innovation Matters
          </h3>
          <p className="text-sm sm:text-base text-[#B6AABA] max-w-2xl mx-auto leading-relaxed">
            The “Ghost in the Machine” is not an eerie mystery—it is the living promise that artificial intelligence belongs in human hands, running on personal hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#201A28] border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E7BD72] font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Digital Sovereignty & Sanctuary</span>
            </div>
            <p className="text-xs sm:text-sm text-[#B6AABA] leading-relaxed">
              When remembering lost parents, grandparents, friends, and moments of private grief, nobody should have to surrender their stories to remote server logs or closed API providers. Ghostlight keeps memory processing entirely inside your device’s GPU memory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#201A28] border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E7BD72] font-semibold text-sm">
              <Cpu className="w-5 h-5 text-[#E98736]" />
              <span>WebLLM & Browser WebGPU</span>
            </div>
            <p className="text-xs sm:text-sm text-[#B6AABA] leading-relaxed">
              Powered by <strong>@mlc-ai/web-llm</strong>, modern browsers can now execute full 1-billion to 3-billion parameter quantized language models (like Meta’s <strong>Llama-3.2-1B-Instruct-q4f16_1-MLC</strong>) at native speeds without installing complex Python environments or CUDA drivers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#201A28] border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E7BD72] font-semibold text-sm">
              <Code2 className="w-5 h-5 text-[#E7BD72]" />
              <span>Inspectable, Modular Architecture</span>
            </div>
            <p className="text-xs sm:text-sm text-[#B6AABA] leading-relaxed">
              Every prompt template, ethical guardrail, and storage handler is open source under the MIT License. Anyone can inspect how prompts are built, replace the candidate model with another Hugging Face MLC model, or run Ghostlight completely offline as a PWA.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#201A28] border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E7BD72] font-semibold text-sm">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>Honest Fallback: Template Mode</span>
            </div>
            <p className="text-xs sm:text-sm text-[#B6AABA] leading-relaxed">
              We never fabricate AI results or pretend an API call happened. If WebGPU is not supported on a device, Ghostlight transparently offers deterministic, human-crafted template generation, ensuring the ofrenda remains beautiful for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="text-center p-8 rounded-3xl bg-[#17121F] border border-white/10 space-y-4">
        <h3 className="font-serif-title text-2xl font-bold text-[#F4EBDD]">
          Ready to light a flame?
        </h3>
        <p className="text-xs sm:text-sm text-[#B6AABA] max-w-lg mx-auto">
          Take five quiet minutes to honor a person or memory that shaped your life.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onLightLantern}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E98736] to-[#E7BD72] text-[#0B0A10] font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Flame className="w-4 h-4 fill-[#0B0A10]" />
            <span>Light a Lantern Now</span>
          </button>
          <button
            onClick={onExploreSample}
            className="px-5 py-3 rounded-xl bg-[#201A28] border border-[#E7BD72]/40 text-[#F4EBDD] text-xs sm:text-sm hover:text-[#E7BD72] transition-colors cursor-pointer"
          >
            Explore Sample Memory
          </button>
        </div>
      </div>
    </div>
  );
};
