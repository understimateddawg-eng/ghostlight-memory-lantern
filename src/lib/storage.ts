/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoryRecord, MemoryDraft } from '../types/memory';

const DB_NAME = 'GhostlightOfrendaDB';
const DB_VERSION = 1;
const STORE_NAME = 'memories';
const DRAFT_KEY = 'ghostlight_memory_draft_v1';

export const SAMPLE_MEMORY: MemoryRecord = {
  id: 'sample-abuelita-elena',
  title: 'Abuelita Elena Morales',
  relationship: 'Grandmother & Storyteller',
  story: 'She spent her Sunday mornings teaching us how to stir chocolate caliente with a wooden molinillo until the froth reached the rim of the clay jar. Her kitchen smelled of roasted cinnamon, warm anise, and rain on clay tiles. When storms rolled across the valley, she would gather all the cousins onto the porch swing, light a single beeswax taper, and tell us stories about stars that walked through the cornfields looking for stray songs.',
  favoriteFood: 'Pan de muerto with toasted anise & hot spiced stone-ground chocolate',
  favoriteSong: 'Cielito Lindo (sung softly as a lullaby by the woodstove)',
  favoritePlace: 'The stone veranda beneath the flowering bougainvillea vines',
  favoriteSaying: '"No apagues la vela mientras quede una historia por contar." (Do not extinguish the candle while a story remains to be told.)',
  memorableHabit: 'Tucking a fresh marigold blossom behind her silver comb every morning at sunrise',
  tradition: 'Placing golden cempasúchil petals in spiral pathways leading to the front threshold',
  additionalContext: 'Born in Oaxaca, lived to 92. A woman of tremendous laughter, gentle wisdom, and hands that smelled forever of masa and honey.',
  mode: 'tribute',
  tone: 'tender',
  language: 'en',
  length: 'medium',
  generatedContent: `In the amber glow of the memory lantern, Elena Morales remains present not as an absence, but as warmth that refuses to fade.

She was the quiet heart of Sunday mornings—a keeper of traditions that tasted of stone-ground chocolate, cinnamon bark, and steam rising from clay jars. Her voice carried the rhythm of the wooden molinillo, patient and steady, turning ordinary hours into something sacred.

When the mountain rains fell against the valley tiles, fear had no seat at her table. With a single beeswax flame, she gathered children closer, weaving tales of wandering stars and songs that knew the way home. To remember Abuelita Elena is to know that love is best measured in shared sweetness, the fragrance of crushed cempasúchil petals, and her steadfast reminder: never blow out the candle while there is still a story left to tell.

May the marigold path guide her memory gently into the light, where her laughter echoes in every warm kitchen.`,
  generationSource: 'sample',
  modelUsed: 'Llama-3.2-1B-Instruct-q4f16_1-MLC (Sample Demonstration)',
  createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  isFictionalSample: true,
  isLanternLit: true,
};

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open Ghostlight IndexedDB store.'));
    };
  });

  return dbPromise;
}

export async function getAllMemories(): Promise<MemoryRecord[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        let results: MemoryRecord[] = request.result || [];
        // If storage is completely fresh, seed with the labeled sample memory
        if (results.length === 0) {
          // Check if user previously deleted sample
          const hasDismissedSample = localStorage.getItem('ghostlight_sample_dismissed') === 'true';
          if (!hasDismissedSample) {
            results = [SAMPLE_MEMORY];
            // Silently persist initial sample so it behaves like a record
            saveMemory(SAMPLE_MEMORY).catch(console.error);
          }
        }
        // Sort descending by createdAt
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Fallback to memory array due to IndexedDB error:', err);
    return [SAMPLE_MEMORY];
  }
}

export async function getMemoryById(id: string): Promise<MemoryRecord | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMemory(memory: MemoryRecord): Promise<MemoryRecord> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const updatedRecord: MemoryRecord = {
      ...memory,
      updatedAt: new Date().toISOString(),
    };
    const request = store.put(updatedRecord);

    request.onsuccess = () => resolve(updatedRecord);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteMemory(id: string): Promise<void> {
  if (id === SAMPLE_MEMORY.id) {
    localStorage.setItem('ghostlight_sample_dismissed', 'true');
  }
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllMemories(): Promise<void> {
  localStorage.setItem('ghostlight_sample_dismissed', 'true');
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function exportArchiveAsJson(memories: MemoryRecord[]): void {
  const exportPayload = {
    app: 'Ghostlight — The Memory Lantern',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    recordCount: memories.length,
    memories: memories.map(m => ({ ...m })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `ghostlight_ofrenda_archive_${dateStr}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importArchiveFromJson(
  jsonText: string
): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const parsed = JSON.parse(jsonText);
    const items: MemoryRecord[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.memories)
      ? parsed.memories
      : null;

    if (!items || !items.length) {
      return { success: false, count: 0, message: 'No memory records found in JSON file.' };
    }

    let importedCount = 0;
    for (const item of items) {
      if (item && typeof item === 'object' && item.title && item.story) {
        const record: MemoryRecord = {
          id: item.id || `memory-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: String(item.title).slice(0, 100),
          story: String(item.story).slice(0, 5000),
          relationship: item.relationship ? String(item.relationship).slice(0, 100) : undefined,
          favoriteFood: item.favoriteFood ? String(item.favoriteFood).slice(0, 150) : undefined,
          favoriteSong: item.favoriteSong ? String(item.favoriteSong).slice(0, 150) : undefined,
          favoritePlace: item.favoritePlace ? String(item.favoritePlace).slice(0, 150) : undefined,
          favoriteSaying: item.favoriteSaying ? String(item.favoriteSaying).slice(0, 200) : undefined,
          memorableHabit: item.memorableHabit ? String(item.memorableHabit).slice(0, 200) : undefined,
          tradition: item.tradition ? String(item.tradition).slice(0, 200) : undefined,
          additionalContext: item.additionalContext ? String(item.additionalContext).slice(0, 1000) : undefined,
          photoDataUrl: item.photoDataUrl && item.photoDataUrl.startsWith('data:image') ? item.photoDataUrl : undefined,
          mode: (['tribute', 'letter', 'poem', 'story'].includes(item.mode) ? item.mode : 'tribute'),
          tone: (['tender', 'poetic', 'hopeful', 'folklore', 'gently-spooky'].includes(item.tone) ? item.tone : 'tender'),
          language: (item.language === 'es' ? 'es' : 'en'),
          length: (['short', 'medium', 'long'].includes(item.length) ? item.length : 'medium'),
          generatedContent: item.generatedContent ? String(item.generatedContent) : '',
          generationSource: item.generationSource || 'template',
          modelUsed: item.modelUsed,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFictionalSample: Boolean(item.isFictionalSample),
          isLanternLit: Boolean(item.isLanternLit ?? true),
        };
        await saveMemory(record);
        importedCount++;
      }
    }

    return {
      success: true,
      count: importedCount,
      message: `Successfully imported ${importedCount} memories into your local Ofrenda.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, count: 0, message: `Failed to import archive: ${errorMsg}` };
  }
}

export function exportMemoryToMarkdown(memory: MemoryRecord): void {
  const dateFormatted = new Date(memory.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const content = `# ${memory.title}
*A Memory from Ghostlight — The Memory Lantern*
*Date Saved: ${dateFormatted}*
*Creation Mode: ${memory.mode.toUpperCase()} | Tone: ${memory.tone.toUpperCase()} | Language: ${memory.language.toUpperCase()}*
*Generation Source: ${memory.generationSource === 'local-ai' ? `Local Open-Weight AI (${memory.modelUsed || 'Browser WebGPU'})` : memory.generationSource === 'sample' ? 'Sample Demonstration' : 'Deterministic Template Mode'}*

---

## The Remembered Story
${memory.story}

${memory.relationship ? `**Relationship:** ${memory.relationship}\n` : ''}
${memory.favoriteFood ? `**Favorite Food / Drink:** ${memory.favoriteFood}\n` : ''}
${memory.favoriteSong ? `**Favorite Song / Melody:** ${memory.favoriteSong}\n` : ''}
${memory.favoritePlace ? `**Favorite Place:** ${memory.favoritePlace}\n` : ''}
${memory.favoriteSaying ? `**Memorable Saying:** ${memory.favoriteSaying}\n` : ''}
${memory.memorableHabit ? `**Memorable Habit:** ${memory.memorableHabit}\n` : ''}
${memory.tradition ? `**Preserved Tradition:** ${memory.tradition}\n` : ''}
${memory.additionalContext ? `**Notes:** ${memory.additionalContext}\n` : ''}

---

## Tribute & The Lantern's Whisper
${memory.generatedContent || '(No tribute text saved)'}

---
*Created privately with Ghostlight — Every story leaves a light.*
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeTitle = memory.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
  anchor.href = url;
  anchor.download = `ghostlight_${safeTitle || 'memory'}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function saveDraft(draft: MemoryDraft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.warn('Could not save draft to sessionStorage:', e);
  }
}

export function loadDraft(): MemoryDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load draft from sessionStorage:', e);
  }
  return null;
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.warn('Could not clear draft:', e);
  }
}
