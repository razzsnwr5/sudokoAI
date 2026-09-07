# Sudoku Game Logic

This document details the implementation logic for the Sudoku AI application.

## Rules of Sudoku
Sudoku is a logic-based, combinatorial number-placement puzzle. In classic Sudoku, the goal is to fill a $9 \times 9$ grid with digits so that each column, each row, and each of the nine $3 \times 3$ subgrids (also called "boxes" or "blocks") contain all of the digits from 1 to 9.

## Core Algorithms

### 1. The Solver (Backtracking)
The game uses a recursive backtracking algorithm to solve the puzzle.

**How it works:**
1. **Find Empty Cell**: The algorithm searches for an empty cell (marked as `0`).
2. **Trial and Error**: It attempts to place numbers from 1 to 9 in that cell.
3. **Validation**: For each number, it checks if the placement is legal (no duplicate in row, column, or $3 \times 3$ box).
4. **Recursion**: If a number is legal, it recursively attempts to solve the rest of the board.
5. **Backtrack**: If no number works for a cell, it returns to the previous cell and tries the next available number.
6. **Completion**: Once all cells are filled, the puzzle is solved.

**Complexity**:
- **Time Complexity**: In the worst case, the complexity is $O(9^{n^2})$, but the search space is drastically pruned by the validity checks.
- **Space Complexity**: $O(n^2)$ to store the board.

### 2. Puzzle Generation
Generating a high-quality Sudoku puzzle requires ensuring that the puzzle is both solvable and has a **unique solution**.

**Generation Process**:
1. **Full Board Creation**: The generator creates a completely solved $9 \times 9$ board using the backtracking solver with randomized number selection.
2. **Hole Digging**: The algorithm randomly selects a filled cell and removes its value.
3. **Uniqueness Verification**: After removing a number, the generator uses a modified solver to count all possible solutions for the resulting board.
    - If the solver finds more than one solution, the removal is reverted.
    - If exactly one solution exists, the removal is kept.
4. **Difficulty Adjustment**: This process repeats until a target number of clues remains:
    - **Easy**: $\sim 40$ clues.
    - **Medium**: $\sim 32$ clues.
    - **Hard**: $\sim 25$ clues.

## Implementation Details
- **Board Representation**: The board is represented as a 2D array of integers (`number[][]`).
- **State Management**: React's `useState` manages the board, the initial puzzle, and the solution, ensuring the UI stays in sync with the game state.
- **Input Handling**: Support for both on-screen number pads and keyboard input for accessibility and convenience.
