/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Info,
} from 'lucide-react';
import {
  AVAILABLE_MODELS,
  DEFAULT_MODEL_ID,
  checkWebGPUSupport,
  initLocalModel,
  unloadLocalModel,
  subscribeToModelProgress,
  getCurrentModelProgress,
} from '../lib/localAI';
import { ModelProgressInfo, WebLLMModelInfo } from '../types/memory';

interface ModelStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId: string;
  onSelectModelId: (modelId: string) => void;
}

export const ModelStatusModal: React.FC<ModelStatusModalProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onSelectModelId,
}) => {
  const [progress, setProgress] = useState<ModelProgressInfo>(getCurrentModelProgress());
  const [webGpuResult, setWebGpuResult] = useState<{ supported: boolean; reason?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const unsub = subscribeToModelProgress((p) => {
      setProgress(p);
    });

    checkWebGPUSupport().then(setWebGpuResult);

    return unsub;
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  const handlePreload = async () => {
    setIsLoading(true);
    setActionMessage(null);
    try {
      await initLocalModel(selectedModelId, true);
      setActionMessage('Model initialized and ready in browser WebGPU memory.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown load error';
      setActionMessage(`Load failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnload = async () => {
    setIsLoading(true);
    try {
      await unloadLocalModel();
      setActionMessage('Model unloaded. WebGPU graphics memory freed.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unload error';
      setActionMessage(`Unload issue: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGpu = async () => {
    setWebGpuResult(null);
    const res = await checkWebGPUSupport();
    setWebGpuResult(res);
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
            <div className="p-2.5 rounded-xl bg-[#17121F] border border-[#E7BD72]/30 text-[#E7BD72]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#F4EBDD]">
                Local AI Engine & WebGPU Status
              </h3>
              <p className="text-xs text-[#B6AABA]">
                Open-Weight In-Browser Inference via @mlc-ai/web-llm
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          {/* Action notification */}
          {actionMessage && (
            <div className="p-3 rounded-xl bg-[#17121F] border border-[#E7BD72] text-[#E7BD72] flex items-center justify-between">
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage(null)} className="text-[#B6AABA] hover:text-white">✕</button>
            </div>
          )}

          {/* WebGPU Status Section */}
          <div className="p-4 rounded-2xl bg-[#17121F] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-[#E7BD72] text-xs">
                WebGPU Runtime Compatibility
              </span>
              <button
                onClick={handleTestGpu}
                className="text-[11px] text-[#B6AABA] hover:text-[#E7BD72] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-test WebGPU</span>
              </button>
            </div>

            {webGpuResult === null ? (
              <p className="text-xs text-[#B6AABA] animate-pulse">Checking GPU adapter...</p>
            ) : webGpuResult.supported ? (
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>WebGPU is fully available on this browser and device!</span>
              </div>
            ) : (
              <div className="space-y-1.5 text-rose-300">
                <div className="flex items-start gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{webGpuResult.reason}</span>
                </div>
                <p className="text-[11px] text-[#B6AABA] pl-6 leading-relaxed">
                  Ghostlight will automatically operate in <strong>Deterministic Template Mode</strong> so you can still create, edit, save, and export remembrances without local AI.
                </p>
              </div>
            )}
          </div>

          {/* Active Model Selector & Details */}
          <div className="space-y-3">
            <label className="block font-semibold uppercase tracking-wider text-[#E7BD72] text-xs">
              Select Open-Weight Model
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => onSelectModelId(model.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#201A28] border-[#E7BD72] ring-1 ring-[#E7BD72] shadow-sm'
                        : 'bg-[#17121F]/80 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#F4EBDD]">{model.name}</span>
                        {model.recommended && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#E98736]/20 text-[#E7BD72] border border-[#E98736]/40">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#B6AABA] mt-0.5">{model.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-[#E7BD72]">~{model.vramMB} MB VRAM</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Model Card Specifications */}
          <div className="p-4 rounded-2xl bg-[#17121F] border border-white/10 space-y-3 text-xs">
            <h4 className="font-semibold text-[#F4EBDD] flex items-center justify-between">
              <span>Model Specifications & License</span>
              <a
                href={currentModel.huggingFaceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#E7BD72] hover:underline flex items-center gap-1"
              >
                <span>Hugging Face Card</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-[#B6AABA]">
              <div>
                <span className="text-white/60 block">Model ID:</span>
                <span className="font-mono text-[#F4EBDD] text-[11px] break-all">{currentModel.id}</span>
              </div>
              <div>
                <span className="text-white/60 block">Quantization:</span>
                <span className="text-[#F4EBDD]">q4f16_1 (4-bit weights)</span>
              </div>
              <div>
                <span className="text-white/60 block">License:</span>
                <a
                  href={currentModel.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E7BD72] hover:underline"
                >
                  {currentModel.license}
                </a>
              </div>
              <div>
                <span className="text-white/60 block">Inference Engine:</span>
                <span className="text-[#F4EBDD]">WebLLM (Apache 2.0)</span>
              </div>
            </div>
          </div>

          {/* Offline & Cache Behavior Explanation */}
          <div className="p-4 rounded-2xl bg-[#17121F]/70 border border-white/5 space-y-2 text-xs text-[#B6AABA] leading-relaxed">
            <div className="flex items-center gap-2 text-[#E7BD72] font-semibold">
              <HardDrive className="w-4 h-4" />
              <span>How Local Caching & Offline Work</span>
            </div>
            <p>
              • <strong>Initial Download:</strong> When you generate your first tribute or click "Preload", model weights are fetched once from Hugging Face into browser Cache Storage.
            </p>
            <p>
              • <strong>Subsequent Offline Runs:</strong> Once cached, inference can execute completely offline without internet connectivity, provided WebGPU is supported and browser cache persists.
            </p>
            <p>
              • <strong>Storage Quota:</strong> Clearing your browser history, cache, or site data will free the downloaded weights.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#17121F] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#E7BD72]" />
            <span className="text-[#B6AABA] font-mono">{progress.statusText}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUnload}
              disabled={isLoading || progress.state === 'idle'}
              className="px-3.5 py-2 rounded-xl bg-[#201A28] border border-white/15 hover:border-white/30 text-xs text-[#B6AABA] hover:text-[#F4EBDD] transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Unload VRAM</span>
            </button>

            <button
              onClick={handlePreload}
              disabled={isLoading || webGpuResult?.supported === false}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E98736] to-[#E7BD72] text-[#0B0A10] font-bold text-xs hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Loading...' : 'Preload Model Weights'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
