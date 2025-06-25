import React, { useState, useEffect } from 'react';
import './App.css';

/*
 * Modern Tic Tac Toe Game React App
 * Features:
 * - Interactive 3x3 board
 * - Player turn indicators & status
 * - Game reset functionality
 * - Win/draw detection logic
 * - Styled with modern light theme and specified color palette
 * - Responsive and visually centered layout
 */

// Color tokens for inline styles
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ffab00',
  lightBg: '#ffffff',
  lightBorder: '#e9ecef',
  lightBoxShadow: '0 4px 20px rgba(25, 118, 210, 0.06)', // faded blue shadow for board area
  cellHighlight: '#f5f8ff',
};

// Small helper for board grid lines
const cellBorderStyle = (row, col) => ({
  borderTop: row === 0 ? "none" : `2px solid ${COLORS.primary}`,
  borderBottom: row === 2 ? "none" : `2px solid ${COLORS.primary}`,
  borderLeft: col === 0 ? "none" : `2px solid ${COLORS.primary}`,
  borderRight: col === 2 ? "none" : `2px solid ${COLORS.primary}`,
});

// PUBLIC_INTERFACE
function App() {
  // Board is flat array of 9 cells: 'X', 'O', or null
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState('');
  const [winnerInfo, setWinnerInfo] = useState({}); // {winner: 'X'|'O'|null, line: [i1,i2,i3]}
  const [hasDraw, setHasDraw] = useState(false);

  // Reset the game
  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo({});
    setHasDraw(false);
  };

  // Win/draw detection, called after every board change
  useEffect(() => {
    const res = calculateWinner(board);
    if (res.winner) {
      setWinnerInfo(res);
      setStatus(`Winner: Player ${res.winner}`);
      setHasDraw(false);
    } else if (board.every(cell => cell !== null)) {
      setHasDraw(true);
      setWinnerInfo({});
      setStatus('Draw! Nobody wins.');
    } else {
      setWinnerInfo({});
      setHasDraw(false);
      setStatus(`Next: Player ${isXNext ? 'X' : 'O'}`);
    }
  }, [board, isXNext]);

  // Handle player move
  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (board[idx] || winnerInfo.winner || hasDraw) return;
    const copy = [...board];
    copy[idx] = isXNext ? 'X' : 'O';
    setBoard(copy);
    setIsXNext(x => !x);
  }

  // Render turn/page/game info area
  function renderStatus() {
    return (
      <div style={{
        marginBottom: 16,
        fontSize: 20,
        fontWeight: 600,
        color: winnerInfo.winner
          ? COLORS.accent
          : hasDraw
            ? COLORS.secondary
            : COLORS.primary,
        letterSpacing: 0.5,
        minHeight: 28,
      }}>
        {status}
      </div>
    );
  }

  // Render player turn indicator bar (above the board)
  function renderPlayerIndicators() {
    // If game finished, highlight winner
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        gap: 28
      }}>
        <div style={{
          padding: "8px 24px",
          borderRadius: 16,
          background:
            winnerInfo.winner === 'X'
              ? COLORS.primary
              : isXNext && !winnerInfo.winner && !hasDraw
                ? COLORS.accent
                : "#f3f6fa",
          color:
            winnerInfo.winner === 'X'
              ? COLORS.lightBg
              : COLORS.primary,
          fontWeight: winnerInfo.winner === 'X' ? 700 : 500,
          fontSize: 18,
          border: 'none',
          letterSpacing: 0.5,
        }}>
          Player X
        </div>
        <div style={{
          fontWeight: 600,
          fontSize: 15,
          color: '#b0b0b0'
        }}>
          vs
        </div>
        <div style={{
          padding: "8px 24px",
          borderRadius: 16,
          background:
            winnerInfo.winner === 'O'
              ? COLORS.primary
              : !isXNext && !winnerInfo.winner && !hasDraw
                ? COLORS.accent
                : "#f3f6fa",
          color:
            winnerInfo.winner === 'O'
              ? COLORS.lightBg
              : COLORS.primary,
          fontWeight: winnerInfo.winner === 'O' ? 700 : 500,
          fontSize: 18,
          border: 'none',
          letterSpacing: 0.5,
        }}>
          Player O
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="App" style={{
      minHeight: '100vh',
      background: COLORS.lightBg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily:
        "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    }}>
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 320,
        minHeight: 410,
        background: '#fcfcfe',
        borderRadius: 24,
        boxShadow: COLORS.lightBoxShadow,
        padding: '36px 24px 24px 24px',
        marginTop: 32,
        maxWidth: '96vw'
      }}>
        <h1 style={{
          margin: 0,
          marginBottom: 12,
          color: COLORS.primary,
          fontWeight: 700,
          fontSize: '2.15rem',
          letterSpacing: 2,
        }}>
          Tic Tac Toe
        </h1>
        {renderPlayerIndicators()}
        {renderStatus()}
        <Board
          cells={board}
          winnerInfo={winnerInfo}
          handleCellClick={handleCellClick}
        />
        <button
          className="ttt-reset-button"
          style={{
            marginTop: 32,
            padding: "12px 40px",
            borderRadius: 10,
            border: "none",
            background: COLORS.accent,
            color: "#fff",
            outline: "none",
            boxShadow: "0 2px 8px rgba(255,171,0,0.07)",
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: 1,
            cursor: "pointer",
            opacity: board.some(Boolean) ? 1 : 0.55,
            transition: "opacity 0.2s"
          }}
          onClick={resetGame}
          disabled={board.every(cell => cell === null)}
        >
          Reset Game
        </button>
        <footer style={{
          marginTop: 20,
          fontSize: 13,
          color: COLORS.secondary + "b0",
          letterSpacing: ".2px"
        }}>
          Modern Tic Tac Toe © {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board: renders the 3x3 grid, applies win highlight
 */
function Board({ cells, winnerInfo, handleCellClick }) {
  // Display X or O with highlight if on winning line
  const winningLine = winnerInfo.line || [];
  return (
    <div
      className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateRows: 'repeat(3, 72px)',
        gridTemplateColumns: 'repeat(3, 72px)',
        gap: '0',
        background: '#ffffff',
        borderRadius: 22,
        border: `2.3px solid ${COLORS.primary}`,
        boxShadow: '0 0.5px 12px #79bcff1d',
        margin: '0 auto',
        marginTop: 10,
        marginBottom: 12,
        maxWidth: 218,
        width: '100%',
        userSelect: 'none',
        fontFamily: 'inherit'
      }}
    >
      {cells.map((cell, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const highlight = winningLine.includes(idx);
        return (
          <button
            className={`ttt-cell${highlight ? ' winner' : ''}`}
            key={idx}
            aria-label={`Cell ${row + 1}-${col + 1}`}
            disabled={!!cell || !!winnerInfo.winner}
            style={{
              ...cellBorderStyle(row, col),
              width: '100%',
              height: '100%',
              background: highlight
                ? COLORS.accent
                : (cell
                  ? COLORS.cellHighlight || '#f6f9ff'
                  : COLORS.lightBg),
              color: cell === 'X' ? COLORS.primary : cell === 'O' ? COLORS.secondary : COLORS.primary,
              fontWeight: 'bold',
              fontSize: 38,
              letterSpacing: '2px',
              cursor: cell || winnerInfo.winner ? 'default' : 'pointer',
              outline: 'none',
              borderRadius: row === 0 && col === 0 ? '20px 0 0 0'
                : row === 0 && col === 2 ? '0 20px 0 0'
                : row === 2 && col === 0 ? '0 0 0 20px'
                : row === 2 && col === 2 ? '0 0 20px 0'
                : '0',
              border: "none",
              transition: "background 0.13s, color 0.15s",
              boxShadow: highlight
                ? `0 2px 12px #ffab0042`
                : undefined
            }}
            onClick={() => handleCellClick(idx)}
          >
            {/* Only X/O, never null */}
            {cell}
          </button>
        );
      })}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * calculateWinner: Returns {winner: 'X'|'O'|null, line: [win1,win2,win3]|[]} if a player has won
 */
function calculateWinner(cells) {
  // 8 possible win lines
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diags
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line: line };
    }
  }
  return { winner: null, line: [] };
}

export default App;
