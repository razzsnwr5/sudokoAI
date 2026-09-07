/**
 * Sudoku Logic Engine
 * This module handles the generation, solving, and validation of Sudoku puzzles.
 */

/**
 * Checks if it is legal to place a number in a given cell.
 * @param {number[][]} board - The 9x9 Sudoku board.
 * @param {number} row - Row index (0-8).
 * @param {number} col - Column index (0-8).
 * @param {number} num - Number to place (1-9).
 * @returns {boolean} True if legal, false otherwise.
 */
export function isValid(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

/**
 * Solves a Sudoku board using recursive backtracking.
 * @param {number[][]} board - The 9x9 board to solve.
 * @returns {boolean} True if solved, false if no solution exists.
 */
export function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found for this cell
      }
    }
  }
  return true; // All cells filled
}

/**
 * Counts the number of solutions for a given board.
 * Used to ensure a generated puzzle has a unique solution.
 * @param {number[][]} board - The 9x9 board.
 * @param {number} limit - Limit on the number of solutions to find.
 * @returns {number} Total number of solutions found (up to limit).
 */
export function countSolutions(board, limit = 2) {
  let solutions = 0;

  function backtrack() {
    if (solutions >= limit) return;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              backtrack();
              board[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    solutions++;
  }

  // Copy board to avoid mutating original
  const boardCopy = board.map(row => [...row]);
  backtrack();
  return solutions;
}

/**
 * Generates a random fully solved Sudoku board.
 * @returns {number[][]} A completed 9x9 board.
 */
function generateFullBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  function fillBoard() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (let num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (fillBoard()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillBoard();
  return board;
}

/**
 * Generates a Sudoku puzzle based on the specified difficulty.
 * @param {string} difficulty - 'easy', 'medium', or 'hard'.
 * @returns {{ puzzle: number[][], solution: number[][] }} The puzzle and its solution.
 */
export function generatePuzzle(difficulty = 'easy') {
  const solution = generateFullBoard();
  const puzzle = solution.map(row => [...row]);

  let cluesToRemove;
  switch (difficulty) {
    case 'easy': cluesToRemove = 9 * 9 - 40; break;
    case 'medium': cluesToRemove = 9 * 9 - 32; break;
    case 'hard': cluesToRemove = 9 * 9 - 25; break;
    default: cluesToRemove = 9 * 9 - 40;
  }

  let removed = 0;
  while (removed < cluesToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      const temp = puzzle[row][col];
      puzzle[row][col] = 0;

      // Verify uniqueness
      if (countSolutions(puzzle) !== 1) {
        puzzle[row][col] = temp; // Revert if not unique
      } else {
        removed++;
      }
    }
  }

  return { puzzle, solution };
}
