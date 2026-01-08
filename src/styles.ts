import { CSSProperties } from 'react';

export const GRID_SIZE = 4;
export const CELL_SIZE = 80;
export const GAP = 12;
const BOARD_SIZE = CELL_SIZE * GRID_SIZE + GAP * (GRID_SIZE - 1);
export const COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

const flexCenter: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const baseButton: CSSProperties = {
  ...flexCenter,
  backgroundColor: '#8f7a66',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#faf8ef',
    minHeight: '100vh',
    paddingTop: '40px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    width: BOARD_SIZE,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: { fontSize: '60px', fontWeight: 'bold', color: '#776e65', margin: 0 },
  scoreBoard: {
    backgroundColor: '#bbada0',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    textAlign: 'center',
  },
  board: {
    position: 'relative',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#bbada0',
    borderRadius: '6px',
    padding: GAP,
    display: 'grid',
    gridTemplateColumns: `repeat(4, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(4, ${CELL_SIZE}px)`,
    gap: GAP,
  },
  cell: { backgroundColor: 'rgba(238, 228, 218, 0.35)', borderRadius: '4px' },
  tile: {
    ...flexCenter,
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: '4px',
    zIndex: 10,
    fontSize: '30px',
    fontWeight: 'bold',
    top: GAP,
    left: GAP,
  },
  mainButton: {
    ...baseButton,
    marginTop: '20px',
    padding: '10px 20px',
  },
  overlay: {
    ...flexCenter,
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(238, 228, 218, 0.7)',
    zIndex: 100,
    borderRadius: '6px',
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    justifyItems: 'center',
  },
  hintButton: {
    ...baseButton,
    padding: '10px 20px',
    borderRadius: '3px',
    minWidth: '100px',
  },
  controls: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#bbada0',
    borderRadius: '6px',
    color: '#f9f6f2',
  },
  miniSpinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
  },
  hintText: {
    fontSize: '18px',
    color: '#776e65',
    backgroundColor: '#eee4da',
    padding: '5px 10px',
    borderRadius: '4px',
  },
  controlsRow: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  footerNote: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#776e65',
    marginTop: '5px',
  },
  externalLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
};

export const getModalTitleStyle = (isWon: boolean): CSSProperties => ({
  color: isWon ? '#edc22e' : '#776e65',
  fontSize: '2rem',
  marginBottom: '10px',
  fontWeight: 'bold',
});
