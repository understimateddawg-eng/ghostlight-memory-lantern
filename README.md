# GHOSTLIGHT — THE MEMORY LANTERN
> *“Every story leaves a light.”*

A private, interactive digital ofrenda and memory sanctuary where people preserve heartfelt tributes, remembrance letters, marigold poems, and atmospheric midnight tales—powered by an **open-weight language model running locally in the user's browser**.

Built for the **Hacktoberfest Open-Source AI Challenge Week 4: “Ghost in the Machine”**.

---

## 🕯️ Overview

Ghostlight celebrates remembrance, ancestral family stories, Día de los Muertos traditions, and the foundational principle that our most vulnerable human memories must remain under our sovereign control.

Rather than sending intimate reflections about deceased family members, lost friends, or cherished places to remote corporate APIs, Ghostlight performs real AI inference directly inside your web browser on your graphics card via **WebGPU** and **@mlc-ai/web-llm**.

### Core Pillars
1. **100% Client-Side Private**: No accounts, no backend databases, no server-side LLM calls, and no telemetry.
2. **Real Open-Weight AI**: Uses Meta's `Llama-3.2-1B-Instruct-q4f16_1-MLC` executing on WebGPU inside browser memory.
3. **Honest Fallback (Template Mode)**: If WebGPU is unavailable or memory is constrained, Ghostlight offers deterministic, human-crafted templates—never falsifying AI status.
4. **Persistent Local Altar**: Remembrances and local photographs are safely stored in your browser's IndexedDB.

---

## 📸 Screenshots

<!-- Replace these placeholders with actual screenshots after running Ghostlight locally -->
```
[Screenshot Placeholder: The Ofrenda Altar with glowing candle lanterns and memory cards]
[Screenshot Placeholder: The Memory Creator with personal detail inputs and tone selector]
[Screenshot Placeholder: The Lantern's Whisper with streaming local AI tribute and export controls]
[Screenshot Placeholder: Model Status Modal displaying WebGPU diagnostics and VRAM allocation]
```

---

## ✨ Features

- **The Ofrenda Sanctuary**: Browse, search, filter, and sort remembered loved ones. Each card displays an altar candle, relationship, story excerpt, and favorite keepsakes (food, songs, places, sayings).
- **The Memory Creator**:
  - Required fields: Name/Title and meaningful story or memory.
  - Optional personal keepsakes: Relationship, favorite food/drink, song/melody, place, memorable phrase, habit, and preserved tradition.
  - Local photograph attachment stored strictly as a Data URL in IndexedDB.
- **Four Distinct Creation Modes**:
  1. **A Light of Remembrance**: Heartfelt tribute honoring their remembered qualities, laughter, and specific details.
  2. **A Letter to Remember**: A reflective remembrance letter written from *your* perspective addressing your loved one. (Never falsely impersonates the deceased person).
  3. **A Marigold Poem**: An evocative poem weaving supplied places, songs, scents, and traditions into verses of cempasúchil and candlelight.
  4. **A Whisper After Midnight**: An atmospheric, gently spooky fictional tale set beside candle flame in a quiet midnight house, where loving memories gently echo.
- **Configurable Aesthetics**:
  - **Tone**: Tender, Poetic, Hopeful, Folklore, Gently Spooky.
  - **Language**: English or Español.
  - **Length**: Short (~150 words), Medium (~280 words), Long (~450 words).
- **Active Local Inference**: Live token streaming, progress bars showing model weight downloads and WebGPU shader compilation, and cancellation controls.
- **Local Archive Operations**:
  - Export archive to portable `.json` backup.
  - Import and validate JSON archive.
  - Export individual tributes to formatted Markdown (`.md`).
  - One-click text copying with feedback.
  - Edit saved records directly.
  - Delete with safety confirmation modal.
- **Atmospheric Visual Design**:
  - Midnight black (`#0B0A10`), deep plum (`#17121F`), panel violet (`#201A28`), antique gold (`#E7BD72`), marigold orange (`#E98736`), and ivory (`#F4EBDD`).
  - Animated SVG candle flame with realistic flickering and glowing wick.
  - Floating cempasúchil petals and ember fireflies (respects `prefers-reduced-motion`).
  - Editorial typography combining Cinzel, Cormorant Garamond, and Plus Jakarta Sans.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI state management and type safety |
| **Bundler** | [Vite 8](https://vitejs.dev/) | Build pipeline and development server |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Design tokens, responsive layouts, and typography |
| **Inference** | [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) | Browser WebGPU execution of open-weight LLMs |
| **Persistence** | [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | Client-side memory records and photo storage |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography |
| **Celebration** | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Subtle golden particle celebration on save |

---

## 🧠 Open-Weight AI Architecture

Ghostlight avoids any dependence on hosted inference APIs (OpenAI, Gemini, Anthropic, etc.). Instead, the model runs directly inside the client's WebGPU environment.

```
[User Browser]
   │
   ├─► Memory Input & Parameters (Title, Story, Keepsakes, Tone)
   │
   ├─► WebGPU Compatibility Check (navigator.gpu.requestAdapter())
   │        │
   │        ├─► [Supported] ──► WebLLM (MLCEngine)
   │        │                      │
   │        │                      ├── Fetches weights from Hugging Face (1st run only)
   │        │                      ├── Caches in browser CacheStorage
   │        │                      └── Streams generation locally to UI
   │        │
   │        └─► [Unsupported / Fallback] ──► Deterministic Template Mode
   │                                           (Instant, honest, zero-AI)
   │
   └─► IndexedDB (GhostlightOfrendaDB)
            └── Local CRUD, JSON export/import, zero remote transmission
```

### Verified Models

1. **`Llama-3.2-1B-Instruct-q4f16_1-MLC` (Primary / Default)**
   - **Repository**: [https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC](https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC)
   - **Quantization**: 4-bit weights (`q4f16_1`)
   - **VRAM Required**: ~879 MB
   - **Context Window**: 4096 tokens
   - **License**: Meta Llama 3.2 Community License Agreement
2. **`SmolLM2-360M-Instruct-q4f16_1-MLC` (Ultra-Light Option)**
   - **Repository**: [https://huggingface.co/mlc-ai/SmolLM2-360M-Instruct-q4f16_1-MLC](https://huggingface.co/mlc-ai/SmolLM2-360M-Instruct-q4f16_1-MLC)
   - **Quantization**: 4-bit weights
   - **VRAM Required**: ~360 MB
   - **License**: Apache 2.0
3. **`Qwen2.5-0.5B-Instruct-q4f16_1-MLC` (Compact Multilingual)**
   - **Repository**: [https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC](https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC)
   - **VRAM Required**: ~380 MB
   - **License**: Apache 2.0

### Model Lifecycle & Offline Behavior
- **Lazy Loading**: The model is **never** downloaded on the landing page. It is loaded only when the user clicks *"Awaken the Lantern"* or explicitly triggers preloading in the Model Status modal.
- **Engine Reuse**: Once initialized, the `MLCEngine` singleton is reused across generations without re-downloading.
- **Offline Inference**: During the first run, model weights (~500–700 MB) are downloaded over the internet and cached by WebLLM into browser Cache Storage. Subsequent generations can run fully offline, provided the browser cache is retained and WebGPU is available.
- **VRAM Unloading**: A dedicated *"Unload VRAM"* button allows freeing graphics card memory at any time.

---

## 📜 Ethical Guardrails & Prompt Integrity

Ghostlight enforces strict boundaries inside `src/lib/prompts.ts`:
1. **No Hallucinated Biographical Facts**: The model is instructed never to invent dates, unmentioned family names, or fabricated life events.
2. **No Deceased Person Impersonation**: Remembrance letters are written strictly from the perspective of the living writer addressing their loved one. Ghostlight never pretends to be a spirit communicating from the beyond.
3. **No Spiritual Claims**: The application does not claim to contact spirits or validate supernatural phenomena.
4. **Fictional Midnight Stories**: The *"Whisper After Midnight"* mode frames atmospheric supernatural elements purely as poetic, cozy folklore fiction.
5. **No AI Deception**: Template output is clearly labeled as Template Mode; AI output is labeled with the specific model ID.

---

## 📄 Open-Source Licenses

Ghostlight adheres to transparent multi-license attribution:
- **Application Source Code**: [MIT License](./LICENSE) © 2026 Ghostlight Contributors.
- **WebLLM Engine**: [Apache License 2.0](https://github.com/mlc-ai/web-llm/blob/main/LICENSE) © MLC LLM Community.
- **Llama 3.2 1B Instruct Model**: [Meta Llama 3.2 Community License](https://llama.meta.com/llama3/license/) © Meta Platforms, Inc.
- **SmolLM2 & Qwen 2.5 Models**: Apache 2.0 License.

---

## 💻 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher (v20+ recommended)
- A WebGPU-capable browser (Google Chrome 113+, Microsoft Edge 113+, or Chromium with WebGPU enabled)

### Commands

```bash
# 1. Clone the repository
git clone https://github.com/[YOUR-USERNAME]/ghostlight-memory-lantern.git
cd ghostlight-memory-lantern

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# -> Opens http://localhost:3000

# 4. Type check / Lint
npm run lint

# 5. Build for production (outputs to /dist)
npm run build

# 6. Preview production build locally
npm run preview
```

---

## 🚀 GitHub Pages Deployment

Ghostlight is structured as a zero-backend static web application. It includes a ready-to-use GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Deployment Steps:
1. Push your repository to GitHub.
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push a commit to `main` (or run the workflow manually under the **Actions** tab).
5. Your static digital ofrenda will be live at `https://[YOUR-USERNAME].github.io/[REPO-NAME]/`.

---

## 🔄 How to Switch or Add Models

To change the default model or add custom fine-tuned weights:
1. Open `src/lib/localAI.ts`.
2. Inspect `AVAILABLE_MODELS` and `DEFAULT_MODEL_ID`.
3. Select any supported model ID from `@mlc-ai/web-llm`'s `prebuiltAppConfig.model_list`, or provide a custom Hugging Face repository URL with compiled wasm library.
4. Rebuild the application with `npm run build`.

---

## ⚠️ Known Limitations & Device Requirements

- **WebGPU Requirement**: Devices without WebGPU hardware or unsupported browsers will automatically revert to Template Mode.
- **Memory Consumption**: Downloading and running `Llama-3.2-1B` requires at least 1 GB of available GPU VRAM. For mobile or budget devices, switch to `SmolLM2-360M-Instruct-q4f16_1-MLC`.
- **Browser Cache Clearing**: Because storage is 100% client-side, clearing browser data or browsing in Incognito mode will reset the local archive. Users should use the **Export JSON Archive** button to maintain external backups.

---

## 🤝 Contributing

Contributions, translations, and accessibility improvements are warmly welcomed!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/amazing-ofrenda-element`).
3. Commit your Changes (`git commit -m 'Add cempasúchil garland styling'`).
4. Push to the Branch (`git push origin feature/amazing-ofrenda-element`).
5. Open a Pull Request.

---

## 🌻 Acknowledgments

- Dedicated to our grandmothers, grandfathers, mentors, and loved ones whose stories outlive us.
- The open-source teams at **MLC-AI** for building WebLLM and bringing open AI models to WebGPU browsers.
- **Meta AI** for releasing open-weight Llama 3.2 models.
- The organizers of the **Hacktoberfest Open-Source AI Challenge**.
