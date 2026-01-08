export const WINNING_SCORE = 2048;
export const AI_MODEL = 'gpt-oss:20b';
export const AI_PROMPT = `You are a 2048 Engine. 
STRATEGY: Keep the highest tile in the Bottom-Right.
RULES: 
1. Only suggest a move if it causes tiles to slide or merge.
2. If a move is blocked by the wall or other tiles and no merge is possible, it is IMPOSSIBLE.
3. Provide the single best move: UP, DOWN, LEFT, or RIGHT.
/no_think
CURRENT BOARD:
`;

export const STRINGS = {
  GAME_TITLE: '2048',
  SCORE_LABEL: 'SCORE',
  AI: {
    HINT_PREFIX: 'AI suggests: ',
    ERROR: "AI couldn't decide",
  },
  GAME_STATUS: {
    WON: 'You Win!',
    LOST: 'Game Over!',
  },
  BUTTONS: {
    NEW_GAME: 'New Game',
    GET_HINT: 'Get AI Hint',
    TRY_AGAIN: 'Try Again',
  },
  NOTES: {
    MODEL_USED: 'AI model used : ',
    AI_LATENCY:
      'Note: The response from the AI model may take a few minutes, thank you for your patience',
    OLLAMA_USAGE:
      "If you don't have ollama installed, please install using below link and install the model",
    OLLAMA_DOWNLOAD_LINK: 'Ollama Download',
  },
};
