/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CreateMLCEngine, MLCEngine, InitProgressReport } from '@mlc-ai/web-llm';
import { ModelProgressInfo, WebLLMModelInfo, MemoryDraft } from '../types/memory';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

export const AVAILABLE_MODELS: WebLLMModelInfo[] = [
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 1B Instruct (Recommended)',
    family: 'Meta Llama 3.2',
    vramMB: 879,
    description: 'Official candidate model. 1-billion parameter open-weight model with 4-bit quantization, balanced for poetic remembrance and nuanced tone.',
    huggingFaceUrl: 'https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC',
    license: 'Meta Llama 3.2 Community License',
    licenseUrl: 'https://llama.meta.com/llama3/license/',
    recommended: true,
  },
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 360M Instruct (Ultra-Light)',
    family: 'HuggingFace SmolLM2',
    vramMB: 360,
    description: 'Ultra-lightweight 360M parameter model for low-memory devices or slower connections with rapid initialization.',
    huggingFaceUrl: 'https://huggingface.co/mlc-ai/SmolLM2-360M-Instruct-q4f16_1-MLC',
    license: 'Apache 2.0',
    licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
    recommended: false,
  },
  {
    id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    name: 'Qwen 2.5 0.5B Instruct (Compact)',
    family: 'Qwen 2.5',
    vramMB: 380,
    description: 'Compact 500M parameter model with strong multilingual fluency for Spanish and English reflections.',
    huggingFaceUrl: 'https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    license: 'Apache 2.0',
    licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
    recommended: false,
  },
];

export const DEFAULT_MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

// Singleton engine reference
let currentEngine: MLCEngine | null = null;
let currentLoadedModelId: string | null = null;
let isInitializing = false;
let abortRequested = false;

// Progress listeners
type ProgressListener = (info: ModelProgressInfo) => void;
const progressListeners: Set<ProgressListener> = new Set();

let lastProgressInfo: ModelProgressInfo = {
  state: 'idle',
  statusText: 'Local model not loaded',
  progressPercent: 0,
  activeModelId: DEFAULT_MODEL_ID,
};

export function subscribeToModelProgress(listener: ProgressListener): () => void {
  progressListeners.add(listener);
  listener(lastProgressInfo);
  return () => {
    progressListeners.delete(listener);
  };
}

function updateProgress(info: Partial<ModelProgressInfo>) {
  lastProgressInfo = { ...lastProgressInfo, ...info };
  progressListeners.forEach(listener => {
    try {
      listener(lastProgressInfo);
    } catch (err) {
      console.error('Error in progress listener:', err);
    }
  });
}

export function getCurrentModelProgress(): ModelProgressInfo {
  return lastProgressInfo;
}

/**
 * Check if the user's browser and hardware environment supports WebGPU.
 */
export async function checkWebGPUSupport(): Promise<{ supported: boolean; reason?: string }> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { supported: false, reason: 'Non-browser environment detected.' };
  }

  const nav = navigator as unknown as { gpu?: { requestAdapter: () => Promise<unknown> } };
  if (!nav.gpu) {
    return {
      supported: false,
      reason: 'WebGPU is not enabled or supported in this browser. Please use Chrome 113+, Edge 113+, or a WebGPU-enabled Chromium browser.',
    };
  }

  try {
    const adapter = await nav.gpu.requestAdapter();
    if (!adapter) {
      return {
        supported: false,
        reason: 'WebGPU API is present, but no compatible graphics adapter (GPU) could be initialized on this device.',
      };
    }
    return { supported: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown WebGPU error';
    return {
      supported: false,
      reason: `WebGPU adapter check failed: ${message}`,
    };
  }
}

/**
 * Initialize or reuse the WebLLM engine with the selected model.
 */
export async function initLocalModel(
  modelId: string = DEFAULT_MODEL_ID,
  forceReload = false
): Promise<MLCEngine> {
  // If already ready with the requested model, reuse it immediately
  if (currentEngine && currentLoadedModelId === modelId && !forceReload) {
    updateProgress({
      state: 'ready',
      statusText: 'Local model ready',
      progressPercent: 100,
      activeModelId: modelId,
    });
    return currentEngine;
  }

  if (isInitializing) {
    throw new Error('Model initialization is already in progress. Please wait.');
  }

  isInitializing = true;
  abortRequested = false;

  updateProgress({
    state: 'checking-webgpu',
    statusText: 'Checking WebGPU compatibility...',
    progressPercent: 5,
    activeModelId: modelId,
    error: undefined,
  });

  const gpuCheck = await checkWebGPUSupport();
  if (!gpuCheck.supported) {
    isInitializing = false;
    updateProgress({
      state: 'unsupported',
      statusText: 'Local AI unavailable: WebGPU not supported',
      progressPercent: 0,
      error: gpuCheck.reason,
    });
    throw new Error(gpuCheck.reason || 'WebGPU is not supported on this browser/device.');
  }

  // If a different model was previously loaded, unload it cleanly first
  if (currentEngine && currentLoadedModelId !== modelId) {
    try {
      await currentEngine.unload();
    } catch (e) {
      console.warn('Failed to cleanly unload prior model:', e);
    }
    currentEngine = null;
    currentLoadedModelId = null;
  }

  updateProgress({
    state: 'downloading',
    statusText: 'Preparing local model download...',
    progressPercent: 10,
  });

  const progressCallback = (report: InitProgressReport) => {
    if (abortRequested) {
      throw new Error('Model loading cancelled by user.');
    }

    const pct = Math.round(report.progress * 100);
    let state: ModelProgressInfo['state'] = 'downloading';
    if (pct >= 90) state = 'compiling';
    if (pct >= 100) state = 'ready';

    updateProgress({
      state,
      statusText: report.text || (pct < 100 ? `Downloading model weights (${pct}%)...` : 'Compiling WebGPU shaders...'),
      progressPercent: Math.min(100, Math.max(5, pct)),
    });
  };

  try {
    const engine = await CreateMLCEngine(modelId, {
      initProgressCallback: progressCallback,
      logLevel: 'WARN',
    });

    currentEngine = engine;
    currentLoadedModelId = modelId;
    isInitializing = false;

    updateProgress({
      state: 'ready',
      statusText: 'Local model ready for private inference',
      progressPercent: 100,
      activeModelId: modelId,
    });

    return engine;
  } catch (err: unknown) {
    isInitializing = false;
    currentEngine = null;
    currentLoadedModelId = null;
    const errorMsg = err instanceof Error ? err.message : 'Unknown model loading failure';

    updateProgress({
      state: 'error',
      statusText: 'Local AI failed to load',
      progressPercent: 0,
      error: errorMsg,
    });

    throw err;
  }
}

/**
 * Run generation locally using the initialized WebLLM engine with real streaming.
 */
export async function generateRemembrance(
  draft: MemoryDraft,
  modelId: string = DEFAULT_MODEL_ID,
  onStreamChunk?: (accumulatedText: string, chunk: string) => void,
  signal?: AbortSignal
): Promise<{ text: string; modelId: string }> {
  // Ensure model is ready
  const engine = await initLocalModel(modelId);

  updateProgress({
    state: 'generating',
    statusText: 'Generating your remembrance in browser...',
    progressPercent: 100,
  });

  const systemPrompt = buildSystemPrompt(draft.mode, draft.tone, draft.language);
  const userPrompt = buildUserPrompt({ draft });

  const maxTokensMap = {
    short: 300,
    medium: 550,
    long: 850,
  };
  const maxTokens = maxTokensMap[draft.length] || 550;

  let accumulated = '';

  try {
    const completionStream = await engine.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: draft.mode === 'story' ? 0.75 : draft.mode === 'poem' ? 0.7 : 0.6,
      max_tokens: maxTokens,
      stream: true,
    });

    for await (const chunk of completionStream) {
      if (signal?.aborted) {
        throw new Error('Generation cancelled by user.');
      }
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        accumulated += delta;
        if (onStreamChunk) {
          onStreamChunk(accumulated, delta);
        }
      }
    }

    // Clean any leading/trailing AI quotes or markers
    let cleaned = accumulated.trim();
    if (cleaned.startsWith('```markdown')) {
      cleaned = cleaned.replace(/^```markdown\n?/, '').replace(/```$/, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\n?/, '').replace(/```$/, '').trim();
    }

    updateProgress({
      state: 'ready',
      statusText: 'Local model ready',
      progressPercent: 100,
    });

    return { text: cleaned, modelId };
  } catch (err: unknown) {
    updateProgress({
      state: 'ready',
      statusText: 'Local model ready',
      progressPercent: 100,
    });
    throw err;
  }
}

/**
 * Abort active initialization or reset state.
 */
export function abortModelOperation(): void {
  abortRequested = true;
}

/**
 * Unload engine to free WebGPU memory.
 */
export async function unloadLocalModel(): Promise<void> {
  if (currentEngine) {
    try {
      await currentEngine.unload();
    } catch (e) {
      console.warn('Error during unload:', e);
    }
    currentEngine = null;
    currentLoadedModelId = null;
    updateProgress({
      state: 'idle',
      statusText: 'Local model not loaded (memory freed)',
      progressPercent: 0,
      activeModelId: DEFAULT_MODEL_ID,
    });
  }
}
