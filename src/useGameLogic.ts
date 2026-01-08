import { useState, useEffect, useCallback, useRef } from 'react';
import { generateText } from 'ai';
import { createOllama } from 'ollama-ai-provider-v2';
import { GRID_SIZE } from './styles';
import { WINNING_SCORE, AI_MODEL, AI_PROMPT, STRINGS } from './constants';

const ollama = createOllama();

export type Tile = {
  id: number;
  val: number;
  x: number;
  y: number;
  merged?: boolean;
};
export type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'PLAYING' | 'WON' | 'LOST';

function formatTilesToString(tiles: Tile[]): string {
  const grid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));
  tiles.forEach((t) => (grid[t.y][t.x] = t.val));
  return grid
    .map((row) => row.map((v) => (v === 0 ? '.' : v)).join('\t'))
    .join('\n');
}

export function useGameLogic() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiHint, setAiHint] = useState<MoveDirection | string | null>(null);
  const idCounter = useRef(0);

  const spawn = useCallback(
    (current: Tile[], quantity = 1, initialSet = false): Tile[] => {
      let returnTiles = current;

      // Iterate based on the number of tiles requested to be added
      for (let i = 0; i < quantity; i++) {
        /**
         * SPATIAL TRACKING:
         * Create a lookup set of "x-y" strings for all currently occupied coordinates.
         * This allows for O(1) checks when scanning for empty spots.
         */
        const occupied = new Set(returnTiles.map((t) => `${t.x}-${t.y}`));
        const empty = [];

        /**
         * GRID SCANNING:
         * Iterate through the entire grid defined by GRID_SIZE.
         * If a coordinate is not in the 'occupied' set, it is added to the 'empty' list.
         */
        for (let x = 0; x < GRID_SIZE; x++) {
          for (let y = 0; y < GRID_SIZE; y++) {
            if (!occupied.has(`${x}-${y}`)) empty.push({ x, y });
          }
        }

        // Safety check: If no empty cells remain, stop trying to spawn tiles.
        if (empty.length === 0) return returnTiles;

        /**
         * RANDOM PLACEMENT:
         * Pick a random coordinate from the list of available empty cells.
         */
        const { x, y } = empty[Math.floor(Math.random() * empty.length)];

        /**
         * TILE GENERATION:
         * 1. ID: Uses a ref-based counter to ensure every tile has a unique key for React rendering.
         * 2. VAL:
         *.   - 90% chance to spawn a '2'.
         *    - 10% chance to spawn a '4'.
         *    - Force '2' if 'initialSet' is true (standard 2048 start-game behavior).
         */
        returnTiles = [
          ...returnTiles,
          {
            id: idCounter.current++,
            val: Math.random() < 0.9 ? 2 : initialSet ? 2 : 4,
            x,
            y,
          },
        ];
      }

      return returnTiles;
    },
    []
  );

  const init = useCallback(() => {
    idCounter.current = 0;
    setTiles(spawn([], Math.random() * (17 - 1) + 1, true));
    setScore(0);
    setStatus('PLAYING');
    setAiHint(null);
    setIsLoading(false);
  }, [spawn]);

  useEffect(() => {
    init();
  }, [init]);

  const checkGameOver = (currentTiles: Tile[]) => {
    /**
     * WIN CONDITION:
     * Check if any tile on the board has reached or exceeded the WINNING_SCORE.
     * This is checked first to prioritize a win over a potential loss.
     */
    if (currentTiles.some((t) => t.val >= WINNING_SCORE)) return 'WON';

    /**
     * EMPTY SPACE CHECK:
     * If the total number of tiles is less than the total grid capacity,
     * the player can still move or spawn new tiles.
     */
    if (currentTiles.length < GRID_SIZE * GRID_SIZE) return 'PLAYING';

    /**
     * BOARD RECONSTRUCTION:
     * To check for possible merges efficiently, we convert the flat Tile array
     * into a 2D coordinate-based grid (matrix) for easier adjacency lookups.
     */
    const board: number[][] = Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0));
    currentTiles.forEach((t) => (board[t.y][t.x] = t.val));

    /**
     * ADJACENCY LOGIC (MERGE CHECK):
     * When the board is full, the game only continues if there are adjacent tiles
     * with the same value. We iterate through every cell and check:
     * 1. Horizontal neighbors (Right)
     * 2. Vertical neighbors (Down)
     */
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const val = board[y][x];
        if (
          // Check right: if not on the last column and value matches neighbor to the right
          (x < GRID_SIZE - 1 && val === board[y][x + 1]) ||
          // Check down: if not on the last row and value matches neighbor below
          (y < GRID_SIZE - 1 && val === board[y + 1][x])
        ) {
          // A merge is still possible; the game continues
          return 'PLAYING';
        }
      }
    }

    /**
     * LOSS CONDITION:
     * If the board is full and no horizontal or vertical merges are possible,
     * the player has no moves left.
     */
    return 'LOST';
  };

  const move = useCallback(
    (dir: MoveDirection) => {
      // Prevent moves if the game is already over (WON or LOST)
      if (status !== 'PLAYING') return;

      setTiles((prev) => {
        let moved = false;
        let scoreGain = 0;

        // Create a deep copy of tiles and reset the 'merged' flag for the new turn
        const workingTiles = prev.map((t) => ({ ...t, merged: false }));

        /**
         * SORTING LOGIC:
         * To process movements correctly, tiles must be moved in order based on the direction.
         * e.g., If moving 'UP', the tiles already at the top (lowest Y) must move first
         * to clear space or act as merge targets for tiles below them.
         */
        workingTiles.sort((a, b) => {
          if (dir === 'UP') return a.y - b.y;
          if (dir === 'DOWN') return b.y - a.y;
          if (dir === 'LEFT') return a.x - b.x;
          return b.x - a.x;
        });

        const nextState: Tile[] = [];
        for (const tile of workingTiles) {
          let currentTile: Tile | null = { ...tile };
          let curX = currentTile.x;
          let curY = currentTile.y;

          // INFINITE LOOP: Keep sliding the tile in 'dir' until it hits a boundary or another tile
          for (;;) {
            // Calculate movement vector based on direction
            const dx = dir === 'LEFT' ? -1 : dir === 'RIGHT' ? 1 : 0;
            const dy = dir === 'UP' ? -1 : dir === 'DOWN' ? 1 : 0;
            const nx = curX + dx;
            const ny = curY + dy;

            // Boundary Check: Stop if the tile hits the edge of the grid
            if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;

            // Collision Check: Find if there is already a tile at the destination (nextState)
            const blocker = nextState.find((t) => t.x === nx && t.y === ny);
            if (!blocker) {
              // Path is empty: Update current position and continue sliding
              curX = nx;
              curY = ny;
              moved = true;
            } else if (blocker.val === currentTile.val && !blocker.merged) {
              /**
               * MERGE LOGIC:
               * 1. Values must match.
               * 2. The target tile (blocker) must not have merged already this turn.
               */
              blocker.val *= 2;
              blocker.merged = true;
              scoreGain += blocker.val;
              moved = true;

              // Tile is consumed by the merge; stop processing this specific tile
              currentTile = null;
              break;
            } else {
              // Path is blocked by a different value or a tile that already merged
              break;
            }
          }

          // If the tile wasn't consumed by a merge, add it to the next board state
          if (currentTile) {
            currentTile.x = curX;
            currentTile.y = curY;
            nextState.push(currentTile);
          }
        }

        /**
         * FINALIZATION:
         * Only update the game state if at least one tile actually changed position or merged.
         */
        if (moved) {
          setScore((s) => s + scoreGain);

          // Add a new random tile to the board
          const withNew = spawn(nextState);

          // Evaluate if the move resulted in a Win or a Loss
          const nextStatus = checkGameOver(withNew);
          if (nextStatus !== 'PLAYING') setStatus(nextStatus);
          return withNew;
        }

        // If no movement occurred, return the previous state to prevent unnecessary re-renders
        return prev;
      });
    },
    [spawn, status]
  );

  const requestAiHint = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAiHint(null);
    try {
      const { text } = await generateText({
        model: ollama(AI_MODEL),
        prompt: AI_PROMPT + formatTilesToString(tiles),
      });
      const cleanMove = text.trim().toUpperCase();
      const directions: MoveDirection[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      setAiHint(
        directions.includes(cleanMove as MoveDirection)
          ? (cleanMove as MoveDirection)
          : STRINGS.AI.ERROR
      );
    } catch (error) {
      console.error('AI Request failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { tiles, score, status, isLoading, aiHint, move, init, requestAiHint };
}
