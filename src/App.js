import React, { useState, useEffect } from 'react';
import './App.css';
import { generatePuzzle, isValid } from './utils/sudokuLogic';

function SudokuCell({ value, isInitial, isSelected, isError, onClick }) {
  return (
    <div
      className={`sudoku-cell ${isInitial ? 'prefilled' : ''} ${isSelected ? 'selected' : ''} ${isError ? 'error' : ''}`}
      onClick={onClick}
    >
      {value !== 0 ? value : ''}
    </div>
  );
}

function NumberPad({ onNumberClick }) {
  return (
    <div className="number-pad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button key={num} onClick={() => onNumberClick(num)}>{num}</button>
      ))}
      <button onClick={() => onNumberClick(0)}>Clear</button>
    </div>
  );
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(Array(9).fill(0).map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null); // {row, col}
  const [difficulty, setDifficulty] = useState('easy');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'error'

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const { puzzle, solution } = generatePuzzle(difficulty);
    setBoard(puzzle.map(row => [...row]));
    setInitialBoard(puzzle.map(row => [...row]));
    setSolution(solution.map(row => [...row]));
    setSelectedCell(null);
    setGameStatus('playing');
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    // Prevent editing initial cells
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    // Check if game is won
    if (checkWin(newBoard)) {
      setGameStatus('won');
    }
  };

  const checkWin = (currentBoard) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0 || currentBoard[r][c] !== solution[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  const checkBoard = () => {
    let hasError = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0 && board[r][c] !== solution[r][c]) {
          hasError = true;
          break;
        }
      }
    }
    setGameStatus(hasError ? 'error' : 'playing');
  };

  const solveGame = () => {
    setBoard(solution.map(row => [...row]));
    setGameStatus('playing');
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleNumberInput(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, board, initialBoard]);

  return (
    <div className="sudokuAIApp">
      <h1>Sudoku AI</h1>

      <div className="game-controls">
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={startNewGame}>New Game</button>
        <button onClick={checkBoard}>Check</button>
        <button onClick={solveGame}>Solve</button>
      </div>

      {gameStatus === 'won' && <div className="status-message won">Congratulations! You solved the puzzle!</div>}
      {gameStatus === 'error' && <div className="status-message error">Some entries are incorrect. Keep trying!</div>}

      <div className="sudoku-grid">
        {board.map((row, rIdx) => (
          <div key={rIdx} className="grid-row">
            {row.map((val, cIdx) => (
              <SudokuCell
                key={cIdx}
                value={val}
                isInitial={initialBoard[rIdx][cIdx] !== 0}
                isSelected={selectedCell?.row === rIdx && selectedCell?.col === cIdx}
                isError={gameStatus === 'error' && val !== 0 && val !== solution[rIdx][cIdx]}
                onClick={() => handleCellClick(rIdx, cIdx)}
              />
            ))}
          </div>
        ))}
      </div>

      <NumberPad onNumberClick={handleNumberInput} />
    </div>
  );
}

export default App;
