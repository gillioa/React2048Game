import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game2048 from './Game';
import * as LogicModule from './useGameLogic';
import { STRINGS } from './constants';

describe('Game2048 Component', () => {
  const mockMove = jest.fn();
  const mockInit = jest.fn();
  const mockRequestAiHint = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(LogicModule, 'useGameLogic').mockReturnValue({
      tiles: [{ id: 1, val: 2, x: 0, y: 0 }],
      score: 100,
      status: 'PLAYING',
      isLoading: false,
      aiHint: null,
      move: mockMove,
      init: mockInit,
      requestAiHint: mockRequestAiHint,
    });
  });

  test('renders the game title and current score', () => {
    render(<Game2048 />);
    expect(screen.getByText(STRINGS.GAME_TITLE)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('calls move function when arrow keys are pressed', () => {
    render(<Game2048 />);

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(mockMove).toHaveBeenCalledWith('UP');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(mockMove).toHaveBeenCalledWith('RIGHT');
  });

  test('displays the "WON" modal when status changes to WON', () => {
    jest.spyOn(LogicModule, 'useGameLogic').mockReturnValue({
      tiles: [],
      score: 2048,
      status: 'WON',
      isLoading: false,
      aiHint: null,
      move: mockMove,
      init: mockInit,
      requestAiHint: mockRequestAiHint,
    });

    render(<Game2048 />);
    expect(screen.getByText(STRINGS.GAME_STATUS.WON)).toBeInTheDocument();

    const tryAgainBtn = screen.getByText(STRINGS.BUTTONS.TRY_AGAIN);
    fireEvent.click(tryAgainBtn);
    expect(mockInit).toHaveBeenCalled();
  });

  test('handles AI hint requests and displays loading state', async () => {
    jest.spyOn(LogicModule, 'useGameLogic').mockReturnValue({
      tiles: [],
      score: 0,
      status: 'PLAYING',
      isLoading: true,
      aiHint: 'LEFT',
      move: mockMove,
      init: mockInit,
      requestAiHint: mockRequestAiHint,
    });

    render(<Game2048 />);

    const hintButton = screen.getByRole('button', { name: '' });
    expect(hintButton).toBeDisabled();

    expect(screen.getByText('LEFT')).toBeInTheDocument();
  });

  test('calls init when "New Game" button is clicked', () => {
    render(<Game2048 />);
    const newGameBtn = screen.getByText(STRINGS.BUTTONS.NEW_GAME);
    fireEvent.click(newGameBtn);
    expect(mockInit).toHaveBeenCalled();
  });
});
