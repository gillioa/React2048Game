# 🧩 2048 AI Engine
An advanced implementation of the classic 2048 puzzle game built with React, TypeScript, and Framer Motion, featuring an integrated AI hint system powered by Ollama.
## ✨ Features
- 🎬 Smooth Animations: Powered by Framer Motion for fluid tile sliding and merging.
- 🧠 AI Strategy Engine: Integration with Ollama to suggest the best moves in real-time.
- 🛡️ Strict Typing: 100% TypeScript coverage with no any types for maximum reliability.
- 🛠️ Modern Tooling: Fully configured with ESLint Flat Config and Prettier.
## 🚀 Getting Started
### 📋 Prerequisites
- Node.js (v22+ recommended for 2026)
- Ollama (Running locally for AI hints)
### 📥 Installation
1. Clone the repository:
`bash
git clone github.com
cd 2048-ai-engine
`
2. Install dependencies:
`bash
npm install
`
3. Start the development server:
`bash
npm run dev
`
## ⚙️ Development Commands
Maintain code quality using the following scripts defined in your project:
- 🧹 Format Code: `npm run format` — Uses Prettier to clean up styling.
- 🔍 Lint Code: `npm run lint` — Runs ESLint to find and fix logic issues.
- ✅ Type Check: `npm run type-check` — Validates TypeScript integrity.
## 🤖 AI Logic
The game uses the `gpt-oss:20b` model via Ollama to analyze the board state. It follows a "Bottom-Right" corner strategy. To adjust the AI behavior, modify the `AI_PROMPT` constant in `src/Game2048.tsx`.
## 📁 Project Structure
- `src/Game2048.tsx`: Main game logic & state management.
- `src/styles.ts`: Game constants and CSS-in-JS.
- `eslint.config.mjs`: ESLint Flat Config (2026 Standard).
- `.prettierrc`: Prettier formatting rules.
## 📜 License
This project is licensed under the MIT License. Feel free to fork and modify!