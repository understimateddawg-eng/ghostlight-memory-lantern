/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GenerationMode = 'tribute' | 'letter' | 'poem' | 'story';

export type GenerationTone = 'tender' | 'poetic' | 'hopeful' | 'folklore' | 'gently-spooky';

export type GenerationLanguage = 'en' | 'es';

export type GenerationLength = 'short' | 'medium' | 'long';

export type GenerationSource = 'local-ai' | 'template' | 'sample';

export interface MemoryRecord {
  id: string;
  title: string;              // Name of loved one or memory title (required)
  story: string;              // Meaningful story, memory, or reflection (required)
  relationship?: string;      // Optional relationship (e.g., Grandmother, Friend, Mentor)
  favoriteFood?: string;      // Optional favorite food or drink (e.g., Pan de muerto, coffee)
  favoriteSong?: string;      // Optional favorite song, melody, or artist
  favoritePlace?: string;     // Optional favorite garden, city, porch, or spot
  favoriteSaying?: string;    // Optional favorite phrase, motto, or catchphrase
  memorableHabit?: string;    // Optional memorable gesture or habit
  tradition?: string;         // Optional family tradition or ritual
  additionalContext?: string; // Any other notes or background
  photoDataUrl?: string;      // Base64 image data stored strictly in local IndexedDB
  
  // Generation metadata
  mode: GenerationMode;
  tone: GenerationTone;
  language: GenerationLanguage;
  length: GenerationLength;
  generatedContent: string;
  generationSource: GenerationSource;
  modelUsed?: string;
  
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
  isFictionalSample?: boolean;
  isLanternLit?: boolean;
}

export interface MemoryDraft {
  title: string;
  story: string;
  relationship: string;
  favoriteFood: string;
  favoriteSong: string;
  favoritePlace: string;
  favoriteSaying: string;
  memorableHabit: string;
  tradition: string;
  additionalContext: string;
  photoDataUrl?: string;
  mode: GenerationMode;
  tone: GenerationTone;
  language: GenerationLanguage;
  length: GenerationLength;
}

export interface WebLLMModelInfo {
  id: string;
  name: string;
  family: string;
  vramMB: number;
  description: string;
  huggingFaceUrl: string;
  license: string;
  licenseUrl: string;
  recommended: boolean;
}

export type ModelLoadingState =
  | 'idle'
  | 'checking-webgpu'
  | 'unsupported'
  | 'downloading'
  | 'compiling'
  | 'ready'
  | 'generating'
  | 'error';

export interface ModelProgressInfo {
  state: ModelLoadingState;
  statusText: string;
  progressPercent: number; // 0 - 100
  downloadedBytes?: number;
  totalBytes?: number;
  error?: string;
  activeModelId?: string;
}
