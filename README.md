# 🧩 2048 Game with AI Assistance in-game
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
The game uses the `gpt-oss:20b` model via Ollama to analyze the board state. It follows a "Bottom-Right" corner strategy. To adjust the AI behavior, modify the `AI_PROMPT` constant in `src/constants.ts`.
## 📁 Project Structure
- `src/Game.tsx`: Game UI component handling animation and display.
- `src/Game.test.tsx`: Unit testing for the component main Game component.
- `src/styles.ts`: Game constants and CSS-in-JS.
- `src/constants.ts`: Centralize all the constant variable of the project.
- `src/useGameLogic.ts`: Centralize all the logic of the game as a React hook for the component to consume
- `src/useGameLogic.test.ts`: Unit testing covering each gameplay cases and testing all the logic functions of the game
- `.prettierignore`: Prettier ignoring rules.
- `.prettierrc`: Prettier formatting rules.
- `eslint.config.mjs`: ESLint Flat Config (2026 Standard).
## 📜 License
This project is licensed under the MIT License. Feel free to fork and modify!
