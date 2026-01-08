import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useGameLogic } from './useGameLogic';
import { generateText } from 'ai';

let mockWinningScore = 2048;

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  get WINNING_SCORE() {
    return mockWinningScore;
  },
}));

jest.mock('ollama-ai-provider-v2', () => ({
  createOllama: () => () => ({}),
}));

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

const mockedGenerateText = generateText as unknown as jest.Mock;

describe('useGameLogic - Core Mechanics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWinningScore = 2048;
  });

  test('should handle tile merging and score updates', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.move('DOWN');
    });

    expect(result.current.tiles.length).toBeGreaterThan(0);
    randomSpy.mockRestore();
  });

  test('should trigger WON status when conditions are met', () => {
    mockWinningScore = 4;
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.1)
      .mockReturnValue(0.1);

    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.move('DOWN');
      result.current.move('UP');
    });

    expect(result.current.status).toBe('WON');
  });

  test('should trigger LOST status when board is full and no moves remain', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const { result } = renderHook(() => useGameLogic());

    act(() => {
      for (let i = 0; i < 2000; i++) {
        result.current.move('LEFT');
        result.current.move('UP');
        result.current.move('RIGHT');
        result.current.move('DOWN');
      }
    });

    expect(result.current.status).toBe('LOST');
  });

  test('should handle AI hint request cycle', async () => {
    mockedGenerateText.mockResolvedValue({ text: 'LEFT' });
    const { result } = renderHook(() => useGameLogic());

    const event = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent<HTMLElement>;

    await act(async () => {
      await result.current.requestAiHint(event);
    });

    expect(result.current.aiHint).toBe('LEFT');
    expect(result.current.isLoading).toBe(false);
  });

  test('should reset the game when init is called', () => {
    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.move('DOWN');
    });

    act(() => {
      result.current.init();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.status).toBe('PLAYING');
  });
});
