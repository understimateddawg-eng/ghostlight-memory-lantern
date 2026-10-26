/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OfrendaArchive } from './components/OfrendaArchive';
import { MemoryForm } from './components/MemoryForm';
import { GenerationPanel } from './components/GenerationPanel';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { FloatingPetals } from './components/FloatingPetals';
import { MemoryDetailModal } from './components/MemoryDetailModal';
import { ModelStatusModal } from './components/ModelStatusModal';
import { PrivacyPanelModal } from './components/PrivacyPanelModal';
import {
  getAllMemories,
  saveMemory,
  deleteMemory,
  clearAllMemories,
  SAMPLE_MEMORY,
  clearDraft,
} from './lib/storage';
import {
  DEFAULT_MODEL_ID,
  generateRemembrance,
  abortModelOperation,
  subscribeToModelProgress,
  getCurrentModelProgress,
} from './lib/localAI';
import { generateDeterministicTemplate } from './lib/prompts';
import { MemoryRecord, MemoryDraft, ModelProgressInfo } from './types/memory';

type ActiveTab = 'ofrenda' | 'create' | 'results' | 'how-it-works' | 'open-innovation';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('ofrenda');
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [isLoadingMemories, setIsLoadingMemories] = useState(true);

  // Active generation state
  const [activeRecord, setActiveRecord] = useState<MemoryRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);
  const [modelProgress, setModelProgress] = useState<ModelProgressInfo>(getCurrentModelProgress());

  // Editing state for form
  const [editingDraft, setEditingDraft] = useState<Partial<MemoryDraft> | undefined>(undefined);

  // Modals
  const [detailMemory, setDetailMemory] = useState<MemoryRecord | null>(null);
  const [isModelStatusOpen, setIsModelStatusOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Abort controller ref
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load memories from IndexedDB
  const refreshMemories = async () => {
    try {
      const records = await getAllMemories();
      setMemories(records);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setIsLoadingMemories(false);
    }
  };

  useEffect(() => {
    refreshMemories();

    const unsub = subscribeToModelProgress((p) => {
      setModelProgress(p);
    });

    return unsub;
  }, []);

  // Handle generation start from MemoryForm
  const handleStartGeneration = async (draft: MemoryDraft, useLocalAI: boolean) => {
    setCurrentTab('results');
    setStreamingText('');

    const newRecordId = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const baseRecord: MemoryRecord = {
      id: newRecordId,
      title: draft.title,
      story: draft.story,
      relationship: draft.relationship || undefined,
      favoriteFood: draft.favoriteFood || undefined,
      favoriteSong: draft.favoriteSong || undefined,
      favoritePlace: draft.favoritePlace || undefined,
      favoriteSaying: draft.favoriteSaying || undefined,
      memorableHabit: draft.memorableHabit || undefined,
      tradition: draft.tradition || undefined,
      additionalContext: draft.additionalContext || undefined,
      photoDataUrl: draft.photoDataUrl,
      mode: draft.mode,
      tone: draft.tone,
      language: draft.language,
      length: draft.length,
      generatedContent: '',
      generationSource: useLocalAI ? 'local-ai' : 'template',
      modelUsed: useLocalAI ? selectedModelId : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLanternLit: true,
    };

    setActiveRecord(baseRecord);

    if (!useLocalAI) {
      // Deterministic Template Mode (Instant, no AI)
      const templateResult = generateDeterministicTemplate(draft);
      const finished: MemoryRecord = {
        ...baseRecord,
        generatedContent: templateResult,
        generationSource: 'template',
      };
      setActiveRecord(finished);
      return;
    }

    // Local AI Mode via WebLLM & WebGPU
    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await generateRemembrance(
        draft,
        selectedModelId,
        (accumulated) => {
          setStreamingText(accumulated);
        },
        controller.signal
      );

      const finishedRecord: MemoryRecord = {
        ...baseRecord,
        generatedContent: result.text,
        generationSource: 'local-ai',
        modelUsed: result.modelId,
      };

      setActiveRecord(finishedRecord);
      setStreamingText('');
      clearDraft(); // clear draft after successful generation
    } catch (err: unknown) {
      console.warn('Generation did not finish with local AI:', err);
      // If user aborted or WebGPU was missing, keep baseRecord so user can fallback to template
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortModelOperation();
    setIsGenerating(false);
  };

  const handleSwitchToTemplateMode = () => {
    if (!activeRecord) return;
    const templateText = generateDeterministicTemplate({
      title: activeRecord.title,
      story: activeRecord.story,
      relationship: activeRecord.relationship || '',
      favoriteFood: activeRecord.favoriteFood || '',
      favoriteSong: activeRecord.favoriteSong || '',
      favoritePlace: activeRecord.favoritePlace || '',
      favoriteSaying: activeRecord.favoriteSaying || '',
      memorableHabit: activeRecord.memorableHabit || '',
      tradition: activeRecord.tradition || '',
      additionalContext: activeRecord.additionalContext || '',
      photoDataUrl: activeRecord.photoDataUrl,
      mode: activeRecord.mode,
      tone: activeRecord.tone,
      language: activeRecord.language,
      length: activeRecord.length,
    });

    setActiveRecord({
      ...activeRecord,
      generatedContent: templateText,
      generationSource: 'template',
      modelUsed: undefined,
    });
    setStreamingText('');
    setIsGenerating(false);
  };

  const handleSaveToOfrenda = async (recordToSave: MemoryRecord) => {
    await saveMemory(recordToSave);
    await refreshMemories();
  };

  const handleDeleteMemory = async (id: string) => {
    await deleteMemory(id);
    await refreshMemories();
    if (detailMemory?.id === id) {
      setDetailMemory(null);
    }
  };

  const handleClearAll = async () => {
    await clearAllMemories();
    await refreshMemories();
  };

  const handleEditMemory = (memory: MemoryRecord) => {
    setEditingDraft({
      title: memory.title,
      story: memory.story,
      relationship: memory.relationship || '',
      favoriteFood: memory.favoriteFood || '',
      favoriteSong: memory.favoriteSong || '',
      favoritePlace: memory.favoritePlace || '',
      favoriteSaying: memory.favoriteSaying || '',
      memorableHabit: memory.memorableHabit || '',
      tradition: memory.tradition || '',
      additionalContext: memory.additionalContext || '',
      photoDataUrl: memory.photoDataUrl,
      mode: memory.mode,
      tone: memory.tone,
      language: memory.language,
      length: memory.length,
    });
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewMemoryClick = () => {
    setEditingDraft(undefined);
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreSample = () => {
    setDetailMemory(SAMPLE_MEMORY);
  };

  return (
    <div className="min-h-screen bg-[#0B0A10] text-[#F4EBDD] flex flex-col relative selection:bg-[#E98736]/30 selection:text-[#E7BD72]">
      {/* Background drifting petals and embers */}
      <FloatingPetals />

      {/* Persistent Navigation Header */}
      <Header
        currentTab={currentTab === 'results' ? 'create' : currentTab}
        onSelectTab={(tab) => {
          if (tab === 'open-innovation') {
            setCurrentTab('how-it-works');
            setTimeout(() => {
              const el = document.getElementById('open-innovation');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            setCurrentTab(tab);
          }
        }}
        memoryCount={memories.length}
        onOpenModelStatus={() => setIsModelStatusOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onNewMemory={handleNewMemoryClick}
      />

      {/* Main Workspace */}
      <main className="flex-1 relative z-10">
        {/* Landing Hero (shown in ofrenda tab when at top) */}
        {currentTab === 'ofrenda' && (
          <Hero
            onLightLantern={handleNewMemoryClick}
            onExploreSample={handleExploreSample}
          />
        )}

        {/* Tab 1: The Ofrenda Archive */}
        {currentTab === 'ofrenda' && (
          <div className="px-4 sm:px-6 lg:px-8">
            <OfrendaArchive
              memories={memories}
              onOpenMemory={(mem) => setDetailMemory(mem)}
              onEditMemory={handleEditMemory}
              onDeleteMemory={handleDeleteMemory}
              onClearAll={handleClearAll}
              onNewMemory={handleNewMemoryClick}
              onRefresh={refreshMemories}
            />
          </div>
        )}

        {/* Tab 2: Create a Memory */}
        {currentTab === 'create' && (
          <div className="px-4 sm:px-6 lg:px-8 pt-8">
            <MemoryForm
              initialDraft={editingDraft}
              onSubmitGeneration={handleStartGeneration}
              isGenerating={isGenerating}
            />
          </div>
        )}

        {/* Tab 3: The Lantern's Whisper (Generation & Reading View) */}
        {currentTab === 'results' && (
          <div className="px-4 sm:px-6 lg:px-8 pt-8">
            <GenerationPanel
              currentRecord={activeRecord}
              isGenerating={isGenerating}
              streamingText={streamingText}
              progressInfo={modelProgress}
              onSaveToOfrenda={handleSaveToOfrenda}
              onRegenerate={() => {
                if (activeRecord) {
                  handleStartGeneration(
                    {
                      title: activeRecord.title,
                      story: activeRecord.story,
                      relationship: activeRecord.relationship || '',
                      favoriteFood: activeRecord.favoriteFood || '',
                      favoriteSong: activeRecord.favoriteSong || '',
                      favoritePlace: activeRecord.favoritePlace || '',
                      favoriteSaying: activeRecord.favoriteSaying || '',
                      memorableHabit: activeRecord.memorableHabit || '',
                      tradition: activeRecord.tradition || '',
                      additionalContext: activeRecord.additionalContext || '',
                      photoDataUrl: activeRecord.photoDataUrl,
                      mode: activeRecord.mode,
                      tone: activeRecord.tone,
                      language: activeRecord.language,
                      length: activeRecord.length,
                    },
                    activeRecord.generationSource === 'local-ai'
                  );
                }
              }}
              onSwitchToTemplateMode={handleSwitchToTemplateMode}
              onNewMemory={handleNewMemoryClick}
              onCancelGeneration={handleCancelGeneration}
            />
          </div>
        )}

        {/* Tab 4: How It Works & Cultural Tribute */}
        {currentTab === 'how-it-works' && (
          <div className="px-4 sm:px-6 lg:px-8 pt-10">
            <HowItWorks
              onLightLantern={handleNewMemoryClick}
              onExploreSample={handleExploreSample}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <MemoryDetailModal
        memory={detailMemory}
        onClose={() => setDetailMemory(null)}
        onEdit={(mem) => {
          setDetailMemory(null);
          handleEditMemory(mem);
        }}
      />

      <ModelStatusModal
        isOpen={isModelStatusOpen}
        onClose={() => setIsModelStatusOpen(false)}
        selectedModelId={selectedModelId}
        onSelectModelId={(id) => setSelectedModelId(id)}
      />

      <PrivacyPanelModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onRefreshArchive={refreshMemories}
      />

      {/* Footer */}
      <Footer
        onOpenModelStatus={() => setIsModelStatusOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
    </div>
  );
}
