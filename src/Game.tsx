import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  styles,
  GRID_SIZE,
  CELL_SIZE,
  GAP,
  COLORS,
  getModalTitleStyle,
} from './styles';
import { AI_MODEL, STRINGS } from './constants';
import { useGameLogic, MoveDirection } from './useGameLogic';

export default function Game2048() {
  const { tiles, score, status, isLoading, aiHint, move, init, requestAiHint } =
    useGameLogic();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const keys: Record<string, MoveDirection> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };
      if (keys[e.key]) {
        e.preventDefault();
        move(keys[e.key]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const gridBackground = useMemo(() => 
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
      <div key={`cell-${i}`} style={styles.cell}/>
    )), 
  []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{STRINGS.GAME_TITLE}</h1>
        <div style={styles.scoreBoard}>
          <small>{STRINGS.SCORE_LABEL}</small>
          <br />
          <strong>{score}</strong>
        </div>
      </div>

      <div style={styles.board}>
        {gridBackground}

        <AnimatePresence>
          {tiles.map((tile) => (
            <motion.div
              key={tile.id}
              layoutId={String(tile.id)}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                x: tile.x * (CELL_SIZE + GAP),
                y: tile.y * (CELL_SIZE + GAP),
              }}
              transition={{ type: 'tween', stiffness: 500, damping: 40 }}
              style={{
                ...styles.tile,
                backgroundColor: COLORS[tile.val] || '#3c3a32',
                color: tile.val <= 4 ? '#776e65' : '#f9f6f2',
              }}
            >
              <motion.span
                key={tile.val}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {tile.val}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div style={styles.overlay}>
              <motion.div style={styles.modal}>
                <h2 style={getModalTitleStyle(status === 'WON')}>
                  {status === 'WON'
                    ? STRINGS.GAME_STATUS.WON
                    : STRINGS.GAME_STATUS.LOST}
                </h2>
                <p>Final Score: {score}</p>
                <button onClick={init} style={styles.tryAgainButton}>
                  {STRINGS.BUTTONS.TRY_AGAIN}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button disabled={isLoading} onClick={init} style={styles.mainButton}>
        {STRINGS.BUTTONS.NEW_GAME}
      </button>

      <div style={styles.controlsRow}>
        <button
          onClick={requestAiHint}
          disabled={isLoading || status !== 'PLAYING'}
          style={styles.mainButton}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={styles.miniSpinner}
            />
          ) : (
            <>{STRINGS.BUTTONS.GET_HINT}</>
          )}
        </button>
        {aiHint && (
          <motion.span style={styles.hintText}>
            {STRINGS.AI.HINT_PREFIX} <strong>{aiHint}</strong>
          </motion.span>
        )}
      </div>

      <span style={styles.footerNote}>
        {STRINGS.NOTES.MODEL_USED} {AI_MODEL}
      </span>
      <span style={styles.footerNote}>{STRINGS.NOTES.AI_LATENCY}</span>
      <span style={styles.footerNote}>
        {STRINGS.NOTES.OLLAMA_USAGE} {AI_MODEL}
      </span>
      <a
        href="https://ollama.com/download"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.externalLink}
      >
        {STRINGS.NOTES.OLLAMA_DOWNLOAD_LINK}
      </a>
    </div>
  );
}
