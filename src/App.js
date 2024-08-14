import React, { useState, useEffect } from 'react';
import "./App.css"

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      alert(`Winner: ${currentWinner}`);
      setTimeout(resetGame, 2000); // Automatically restart the game after 2 seconds
    } else if (board.every(square => square !== null)) {
      setWinner('Tie');
      alert('The game is a tie!');
      setTimeout(resetGame, 2000); // Automatically restart the game after 2 seconds
    }
  }, [board]);

  const handleClick = (index) => {
    const newBoard = board.slice();
    if (winner || newBoard[index]) return;
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    if (isXNext) {
      setTimeout(() => {
        computerMove(newBoard);
      }, 500);
    }
  };

  const computerMove = (currentBoard) => {
    const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    if (randomIndex !== undefined) {
      currentBoard[randomIndex] = 'O';
      setBoard([...currentBoard]);
      setIsXNext(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col justify-center align-middle m-5 p-5 text-4xl text-center text-white">
      <h1>Tic Tac Toe</h1>
      <Board squares={board} onClick={handleClick} />
      <p>{winner ? `Result: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`}</p>
      <button onClick={resetGame}>Restart Game</button>
    </div>
  );
};

const Board = ({ squares, onClick }) => (
  <div className="grid grid-rows-3 grid-flow-col p-5 align-middle justify-center">
    {squares.map((square, index) => (
      <Square key={index} value={square} onClick={() => onClick(index)} />
    ))}
  </div>
);

const Square = ({ value, onClick }) => (
  <button type='button' className="text-white font-extrabold text-5xl bg-blue-300 hover:shadow-[0_0_15px_5px_rgba(100,116,256,1)] focus:ring-4 focus:ring-blue-300 rounded-lg px-5 py-2.5 me-2 mb-2 focus:outline-none w-28 h-28 " onClick={onClick}>
    {value}
  </button>
);

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default App;
