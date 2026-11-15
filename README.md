# 🧩 React 2048 with AI Assistance

An implementation of the classic 2048 puzzle built with React, TypeScript and Framer Motion, with an in-game AI hint system powered by Ollama.

## ✨ Features
- 🎬 Smooth tile animations with Framer Motion
- 🧠 AI hints through Ollama (`gpt-oss:20b`), following a "bottom-right corner" strategy
- 🛡️ Strict TypeScript, ESLint flat config and Prettier
- ✅ Jest tests for the game logic and the UI

## 📋 Prerequisites
- Node.js 22+
- [Ollama](https://ollama.com/download) running locally, with the model pulled: `ollama pull gpt-oss:20b`

## 🚀 Getting started
```bash
git clone https://github.com/gillioa/React2048Game.git
cd React2048Game
npm install
npm start
```

## ⚙️ Scripts
| Command | Purpose |
|---|---|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm test` | Run the tests |
| `npm run format` | Format with Prettier |
| `npm run lint` / `lint:fix` | Lint (and fix) with ESLint |
| `npm run type-check` | TypeScript check |

## 🤖 AI logic
The game sends the board state to the model set in `AI_MODEL` (`src/constants.ts`). To change the behaviour, edit the `AI_PROMPT` constant in the same file.

## 📁 Structure
- `src/Game.tsx`: UI, animations
- `src/useGameLogic.ts`: game logic hook and Ollama call
- `src/constants.ts`: model, prompt and shared constants
- `src/styles.ts`: styles
- `src/*.test.ts(x)`: unit tests
- `eslint.config.mjs`, `.prettierrc`, `.prettierignore`: tooling

## 📜 License
MIT, feel free to fork and modify!
