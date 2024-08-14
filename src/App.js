import React, { useState, useEffect } from 'react';
import "./App.css"

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null);
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [score, setScore] = useState({ X: 0, O: 0 });

  useEffect(() => {
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      alert(`Winner: ${currentWinner}`);
      setScore(prevScore => ({
        ...prevScore,
        [currentWinner]: prevScore[currentWinner] + 1
      }));
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

    if (isXNext && mode === 'single') {
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

  const handleModeSelection = (selectedMode, playerXName, playerOName) => {
    setMode(selectedMode);
    setPlayerX(playerXName);
    setPlayerO(playerOName);
    resetGame();
  };

  const resetMode = () => {
    setMode(null);
    setPlayerX('');
    setPlayerO('');
    setScore({ X: 0, O: 0 });
    resetGame();
  };

  return (
    <div className="flex flex-col justify-center items-center m-5 p-5 text-4xl text-center text-white">
      {!mode ? (
        <ModeSelection onSelectMode={handleModeSelection} />
      ) : (
        <>
          <h1 className='font-black text-5xl my-5'>Tic Tac Toe</h1>
          <ScoreBoard playerX={playerX} playerO={playerO} score={score} />
          <Board squares={board} onClick={handleClick} />
          <p>{winner ? `Result: ${winner}` : `Current Player: ${isXNext ? playerX : playerO}`}</p>
          <button className='bg-blue-700 w-96 rounded p-5 m-5' onClick={resetGame}>Restart Game</button>
          <button className='bg-red-500 w-96 rounded p-5 m-5' onClick={resetMode}>Change Game Mode</button>
        </>
      )}
    </div>
  );
};

const ModeSelection = ({ onSelectMode }) => {
  const [playerXName, setPlayerXName] = useState('Player 1');
  const [playerOName, setPlayerOName] = useState('Player 2');

  return (
    <div className="flex flex-col items-center">
      <h2 className='m-5'>Select Game Mode</h2>
      <input
        type="text"
        placeholder="Player X Name"
        value={playerXName}
        onChange={(e) => setPlayerXName(e.target.value)}
        className="mb-2 p-2 rounded text-black"
      />
      <input
        type="text"
        placeholder="Player O Name"
        value={playerOName}
        onChange={(e) => setPlayerOName(e.target.value)}
        className="mb-2 p-2 rounded text-black"
      />
      <div>
        <button className='bg-blue-500 w-60 rounded p-3 m-2' onClick={() => onSelectMode('single', playerXName, 'Computer')}>Single Player</button>
        <button className='bg-green-500 w-60 rounded p-3 m-2' onClick={() => onSelectMode('multi', playerXName, playerOName)}>Multiplayer</button>
      </div>
      </div>
  );
};

const ScoreBoard = ({ playerX, playerO, score }) => (
  <div className="flex justify-between w-full mb-5">
    <div className="flex flex-col items-center">
      <h3>{playerX}</h3>
      <p>Score: {score.X}</p>
    </div>
    <div className="flex flex-col items-center">
      <h3>{playerO}</h3>
      <p>Score: {score.O}</p>
    </div>
  </div>
);

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
