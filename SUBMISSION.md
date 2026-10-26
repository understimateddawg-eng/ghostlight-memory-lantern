---
title: Ghostlight: A Private Memory Lantern Powered by Open-Weight AI
published: false
tags: devchallenge, hf26challenge
---

*This project is submitted for the **Hacktoberfest Open-Source AI Challenge Week 4: “Ghost in the Machine”**.*

---

## What I Built

**Ghostlight — The Memory Lantern** is an interactive, cinematic digital ofrenda where people preserve sacred memories of loved ones, write heartfelt tributes, draft remembrance letters, compose marigold poems, and generate atmospheric midnight ghost stories—using an **open-weight AI model that runs 100% locally in the user's browser**.

Every November, Día de los Muertos reminds us that grief and remembrance can be an act of radiant love: building an *ofrenda* (altar), laying golden cempasúchil petals, and speaking the names and favorite dishes of those who walked before us.

With Ghostlight, users can:
- **Build an Altar**: Save memories of parents, grandparents, partners, friends, or pets, complete with their favorite songs, foods, sayings, and locally stored photographs.
- **Awaken the Lantern**: Run an open-weight language model (**Llama-3.2-1B-Instruct-q4f16_1-MLC**) directly on their GPU through WebGPU.
- **Choose from 4 Creation Modes**:
  1. *A Light of Remembrance*: A tender memorial tribute.
  2. *A Letter to Remember*: A reflective letter written from the user's perspective addressing their loved one.
  3. *A Marigold Poem*: Evocative verses of autumn petals, candles, and family traditions.
  4. *A Whisper After Midnight*: A gently spooky, cozy fictional story set in a quiet midnight house where loving memories gently echo.
- **Own Every Word**: Everything is stored in local **IndexedDB**. Users can export their entire archive as JSON, download individual tributes as Markdown, or delete records at any time.
- **Honest Fallback**: If WebGPU is unavailable on a device, Ghostlight transparently transitions to **Deterministic Template Mode**—never faking AI or sending private words to a cloud API.

---

## Demo

<!-- PLACEHOLDER: Insert your live deployed application URL here after publishing to GitHub Pages -->
> **Live Demo URL:** `[YOUR_DEPLOYED_GITHUB_PAGES_URL_HERE]`  
> *(e.g. `https://your-username.github.io/ghostlight-memory-lantern/`)*

---

## Code

<!-- PLACEHOLDER: Insert your public GitHub repository URL here -->
> **GitHub Repository:** `[YOUR_GITHUB_REPOSITORY_URL_HERE]`  
> *(Licensed under the MIT License)*

---

## How I Built It

### 1. Technology Stack
- **Frontend Architecture**: React 19, TypeScript, and Vite 8 for instant bundling and clean component modularity.
- **Design System & Styling**: Custom Tailwind CSS tokens (`--night: #0B0A10`, `--plum: #17121F`, `--panel: #201A28`, `--gold: #E7BD72`, `--marigold: #E98736`, `--ivory: #F4EBDD`), custom SVG candlelight illustrations, flickering CSS animations, and editorial typography (Cinzel & Cormorant Garamond).
- **Persistent Storage**: Dedicated IndexedDB repository (`src/lib/storage.ts`) supporting full CRUD, local photo storage via Base64 Data URLs, JSON archive export/import, and session draft preservation.

### 2. Browser-Native AI Inference with WebLLM
Rather than relying on hosted LLM APIs that require credit cards, API keys, and cloud backends, Ghostlight leverages **`@mlc-ai/web-llm`**:
- **Verified Candidate Model**: `Llama-3.2-1B-Instruct-q4f16_1-MLC` (Meta Llama 3.2 1B Instruct, 4-bit quantized, ~879 MB VRAM required).
- **Lightweight Alternative**: `SmolLM2-360M-Instruct-q4f16_1-MLC` (~360 MB VRAM) for low-memory devices.
- **Lifecycle Management**: The model is lazily loaded on demand when the user clicks *"Awaken the Lantern"*. The `MLCEngine` singleton is cached and reused across generations to avoid duplicate downloads.
- **Real-Time Streaming**: Tokens stream directly to the screen as the WebGPU shaders generate them.

### 3. Ethical Guardrails & Prompt Integrity
Memories are sacred. In `src/lib/prompts.ts`, we implemented strict ethical constraints:
- The model is forbidden from hallucinating biographical details, unmentioned dates, or fake quotes.
- The model never claims to contact spirits or validate supernatural phenomena.
- In remembrance letter mode, the perspective is strictly from the living person remembering—never falsely impersonating the deceased person as if they are communicating from the afterlife.

---

## Why Open Innovation Matters

The Hacktoberfest theme *"Ghost in the Machine"* invites us to consider who owns the ghost inside modern AI.

When people remember a lost mother, an eccentric grandfather, or a friend who passed too young, they are sharing the most fragile, sacred parts of their humanity. **Those memories do not belong in a corporate training corpus, an advertising profile, or an API server log.**

Open innovation through open-weight models and in-browser execution guarantees:
1. **Digital Sovereignty**: Your data never leaves your device's memory.
2. **Inspectability**: Every prompt rule, token parameter, and storage operation is open source under the MIT License.
3. **Longevity & Independence**: Unlike hosted APIs that deprecate endpoints or require monthly subscriptions, an open-weight model in the browser will continue working as long as the user has their device.
4. **Replaceability**: Developers can swap in different Hugging Face MLC models with a single line of configuration.

---

## My Agent Session

<!-- Optional placeholder for a real DevRelay session link if recorded during development. Leave as placeholder if not used. -->
> *DevRelay Session Link:* `[OPTIONAL_DEVRELAY_SESSION_LINK]`

---

## The Spirit of It

There is an old saying in Oaxaca: *No se muere quien se va, solo se muere quien se olvida* (“They do not die who depart; only they die who are forgotten”).

Ghostlight is built on the belief that technology at its best is not a noisy distraction or an extractive machine, but a quiet lantern. A tool that helps us gather our thoughts, speak the names of those who shaped our hearts, and ensure that every story leaves a light.

---

## Prize Categories

<!-- Check and fill in the applicable categories for your challenge submission: -->
- [x] **Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine**
- [ ] *[Additional category to be specified from official challenge guidelines]*
