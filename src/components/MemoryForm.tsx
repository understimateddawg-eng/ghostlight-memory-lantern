/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Flame,
  Image as ImageIcon,
  Trash2,
  HelpCircle,
  FileText,
  AlertCircle,
  Save,
  Wand2,
} from 'lucide-react';
import { CreationModeSelector } from './CreationModeSelector';
import { MemoryDraft, GenerationMode, GenerationTone, GenerationLanguage, GenerationLength } from '../types/memory';
import { saveDraft, loadDraft, clearDraft } from '../lib/storage';

interface MemoryFormProps {
  initialDraft?: Partial<MemoryDraft>;
  onSubmitGeneration: (draft: MemoryDraft, useLocalAI: boolean) => void;
  isGenerating: boolean;
}

const DEFAULT_FORM_STATE: MemoryDraft = {
  title: '',
  story: '',
  relationship: '',
  favoriteFood: '',
  favoriteSong: '',
  favoritePlace: '',
  favoriteSaying: '',
  memorableHabit: '',
  tradition: '',
  additionalContext: '',
  photoDataUrl: undefined,
  mode: 'tribute',
  tone: 'tender',
  language: 'en',
  length: 'medium',
};

export const MemoryForm: React.FC<MemoryFormProps> = ({
  initialDraft,
  onSubmitGeneration,
  isGenerating,
}) => {
  const [formData, setFormData] = useState<MemoryDraft>(() => {
    const saved = loadDraft();
    return { ...DEFAULT_FORM_STATE, ...saved, ...initialDraft };
  });

  const [errors, setErrors] = useState<{ title?: string; story?: string }>({});
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save draft changes to sessionStorage
  useEffect(() => {
    saveDraft(formData);
  }, [formData]);

  const handleFieldChange = (field: keyof MemoryDraft, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as 'title' | 'story']) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Photograph exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        photoDataUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoDataUrl: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; story?: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a name or memory title.';
    }
    if (!formData.story.trim()) {
      newErrors.story = 'Please share a story, anecdote, or reflection.';
    } else if (formData.story.trim().length < 20) {
      newErrors.story = 'Please provide a little more detail (at least 20 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (useLocalAI: boolean) => {
    if (!validate()) {
      // Scroll to top of form smoothly
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
    onSubmitGeneration(formData, useLocalAI);
  };

  const handleClearForm = () => {
    if (confirm('Clear this memory draft? All entered fields will be reset.')) {
      setFormData(DEFAULT_FORM_STATE);
      clearDraft();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title & Introduction */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E98736]/15 border border-[#E98736]/30 text-[#E7BD72] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Memory Altar</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#F4EBDD]">
          Kindle a Flame of Remembrance
        </h2>
        <p className="text-sm sm:text-base text-[#B6AABA] max-w-xl mx-auto">
          Share the memories, cherished habits, and little details of someone you love.
          Your words remain entirely in your browser.
        </p>
      </div>

      {/* Main Form Body */}
      <div className="bg-[#201A28] border border-[#F4EBDD]/15 rounded-2xl p-6 sm:p-8 space-y-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
        {/* Step 1: Creation Mode & Parameters */}
        <CreationModeSelector
          selectedMode={formData.mode}
          onSelectMode={(mode) => handleFieldChange('mode', mode)}
          tone={formData.tone}
          onChangeTone={(tone) => handleFieldChange('tone', tone)}
          language={formData.language}
          onChangeLanguage={(lang) => handleFieldChange('language', lang)}
          length={formData.length}
          onChangeLength={(len) => handleFieldChange('length', len)}
        />

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Step 2: Essential Details */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold uppercase tracking-wider text-[#E7BD72]">
              2. Core Remembrance (Required)
            </label>
            <span className="text-xs text-[#B6AABA]/80">Fields marked with * are required</span>
          </div>

          {/* Name or Memory Title */}
          <div>
            <label className="block text-sm font-medium text-[#F4EBDD] mb-1.5">
              Name or Title <span className="text-[#E98736]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Abuelita Elena, Grandpa David, The Summer at Lake Blue..."
              maxLength={100}
              className={`w-full bg-[#17121F] border rounded-xl px-4 py-3 text-sm sm:text-base text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:outline-none focus:ring-1 transition-all ${
                errors.title
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-white/15 focus:border-[#E7BD72] focus:ring-[#E7BD72]'
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Meaningful Story or Memory */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[#F4EBDD]">
                A Meaningful Story or Memory <span className="text-[#E98736]">*</span>
              </label>
              <span className="text-xs text-[#B6AABA]">
                {formData.story.length}/5000 characters
              </span>
            </div>
            <textarea
              value={formData.story}
              onChange={(e) => handleFieldChange('story', e.target.value)}
              rows={5}
              maxLength={5000}
              placeholder="Share a story, an unforgettable afternoon, how their laugh sounded, what they taught you, or why they mattered so deeply..."
              className={`w-full bg-[#17121F] border rounded-xl p-4 text-sm sm:text-base text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:outline-none focus:ring-1 leading-relaxed transition-all ${
                errors.story
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-white/15 focus:border-[#E7BD72] focus:ring-[#E7BD72]'
              }`}
            />
            {errors.story && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.story}</span>
              </p>
            )}
            <p className="mt-1.5 text-xs text-[#B6AABA]">
              Be specific—small details like rain on the roof, garden soil, or a worn coat make the tribute bloom.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Step 3: Optional Personal Details & Photograph */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="text-sm font-semibold uppercase tracking-wider text-[#E7BD72] hover:underline flex items-center gap-2 cursor-pointer"
            >
              <span>3. Personal Details & Photograph (Optional)</span>
              <span className="text-xs text-[#B6AABA] font-normal lowercase">
                ({showOptionalFields ? 'click to collapse' : 'click to expand and personalize'})
              </span>
            </button>
          </div>

          {/* Photograph Upload (stored strictly in IndexedDB) */}
          <div className="p-4 rounded-xl bg-[#17121F]/80 border border-white/10 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E7BD72]">
              Cherished Photograph (Stored Privately in Browser)
            </label>

            {formData.photoDataUrl ? (
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#E7BD72] shadow-md shrink-0">
                  <img
                    src={formData.photoDataUrl}
                    alt="Photograph preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-[#F4EBDD]">
                    Photograph attached. Saved directly in your device’s IndexedDB.
                  </p>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-300 hover:bg-rose-900/60 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-lg bg-[#201A28] border border-dashed border-[#E7BD72]/50 hover:border-[#E7BD72] text-xs text-[#F4EBDD] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-[#E7BD72]" />
                  <span>Choose Photo from Device</span>
                </button>
                <p className="text-xs text-[#B6AABA]">
                  Max 5MB. Stored locally; never leaves your browser.
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Collapsible Details Grid */}
          {showOptionalFields && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => handleFieldChange('relationship', e.target.value)}
                  placeholder="e.g. Grandmother, Father, Best Friend, Mentor"
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  Favorite Food or Drink
                </label>
                <input
                  type="text"
                  value={formData.favoriteFood}
                  onChange={(e) => handleFieldChange('favoriteFood', e.target.value)}
                  placeholder="e.g. Pan de muerto, stone-ground hot chocolate"
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  Favorite Song or Melody
                </label>
                <input
                  type="text"
                  value={formData.favoriteSong}
                  onChange={(e) => handleFieldChange('favoriteSong', e.target.value)}
                  placeholder="e.g. Cielito Lindo, Clair de Lune, a vinyl record"
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  Favorite Place
                </label>
                <input
                  type="text"
                  value={formData.favoritePlace}
                  onChange={(e) => handleFieldChange('favoritePlace', e.target.value)}
                  placeholder="e.g. The bougainvillea veranda, the workshop"
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  Memorable Saying or Motto
                </label>
                <input
                  type="text"
                  value={formData.favoriteSaying}
                  onChange={(e) => handleFieldChange('favoriteSaying', e.target.value)}
                  placeholder="e.g. 'Never blow out the candle while a story remains.'"
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  Memorable Habit or Gesture
                </label>
                <input
                  type="text"
                  value={formData.memorableHabit}
                  onChange={(e) => handleFieldChange('memorableHabit', e.target.value)}
                  placeholder="e.g. Tucking a marigold behind her silver comb"
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  A Preserved Tradition or Ritual
                </label>
                <input
                  type="text"
                  value={formData.tradition}
                  onChange={(e) => handleFieldChange('tradition', e.target.value)}
                  placeholder="e.g. Laying flower petal paths at twilight every November"
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg px-3 py-2 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#F4EBDD] mb-1">
                  Additional Notes or Background
                </label>
                <textarea
                  value={formData.additionalContext}
                  onChange={(e) => handleFieldChange('additionalContext', e.target.value)}
                  rows={2}
                  placeholder="Any other quiet nuances, humor, or historical background you want woven into the remembrance."
                  className="w-full bg-[#17121F] border border-white/15 rounded-lg p-3 text-sm text-[#F4EBDD] placeholder-[#B6AABA]/40 focus:border-[#E7BD72] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions Area */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleClearForm}
            className="text-xs text-[#B6AABA] hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer order-3 sm:order-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Draft</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            {/* Template Mode Button */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleSubmit(false)}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#140E20] border border-white/20 hover:border-[#F3C978]/60 text-[#FFF9F0] hover:text-[#F3C978] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              title="Generate instantly using deterministic handcrafted templates without loading AI weights."
            >
              <FileText className="w-4 h-4 text-[#C1B5C8]" />
              <span>Use Template Mode (Instant / No AI)</span>
            </button>

            {/* Local AI Primary Button with ember glow */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleSubmit(true)}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#FF8533] via-[#F3C978] to-[#FF8533] bg-[length:200%_auto] hover:bg-right text-[#0B0813] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(255,133,51,0.45)] hover:shadow-[0_0_35px_rgba(255,133,51,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Flame className="w-4 h-4 fill-[#0B0813]" />
              <span>Awaken the Lantern (Local AI)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
