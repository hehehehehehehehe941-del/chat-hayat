import React, { useEffect, useMemo, useState } from 'react'

const PUZZLES = [
  {
    puzzle: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    solution: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
  },
  {
    puzzle: '009000000080605020501078000000000700706040102003000000000720908090301070000000400',
    solution: '329416857487695321561378249142983765756249183813567492674728936298354671935162478',
  },
  {
    puzzle: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
    solution: '435269781682571493197834562826195347374682915951743628519326874248957136763418259',
  },
]

const toGrid = (value) => value.split('').map(Number)
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

function App() {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [board, setBoard] = useState(() => toGrid(PUZZLES[0].puzzle))
  const [selected, setSelected] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [message, setMessage] = useState('Select a square to begin')
  const [complete, setComplete] = useState(false)

  const currentPuzzle = PUZZLES[puzzleIndex]
  const givens = useMemo(() => toGrid(currentPuzzle.puzzle), [currentPuzzle])
  const solution = useMemo(() => toGrid(currentPuzzle.solution), [currentPuzzle])

  useEffect(() => {
    if (complete) return undefined
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [complete])

  const newGame = () => {
    const nextIndex = (puzzleIndex + 1) % PUZZLES.length
    setPuzzleIndex(nextIndex)
    setBoard(toGrid(PUZZLES[nextIndex].puzzle))
    setSelected(null)
    setMistakes(0)
    setSeconds(0)
    setMessage('Select a square to begin')
    setComplete(false)
  }

  const chooseNumber = (number) => {
    if (selected === null || givens[selected] !== 0 || complete) return
    if (number === solution[selected]) {
      const nextBoard = [...board]
      nextBoard[selected] = number
      setBoard(nextBoard)
      setMessage('Nice move')
      if (nextBoard.every((value, index) => value === solution[index])) {
        setComplete(true)
        setMessage('Puzzle complete. Beautiful work!')
      }
    } else {
      setMistakes((value) => value + 1)
      setMessage('That number does not fit here')
    }
  }

  const erase = () => {
    if (selected === null || givens[selected] !== 0 || complete) return
    const nextBoard = [...board]
    nextBoard[selected] = 0
    setBoard(nextBoard)
    setMessage('Square cleared')
  }

  const giveHint = () => {
    if (selected === null || givens[selected] !== 0 || complete) {
      setMessage('Choose an empty square first')
      return
    }
    chooseNumber(solution[selected])
    setMessage('A little nudge in the right direction')
  }

  const selectedValue = selected !== null ? board[selected] : null
  const isRelated = (index) => selected !== null && (Math.floor(index / 9) === Math.floor(selected / 9) || index % 9 === selected % 9 || (Math.floor(index / 27) === Math.floor(selected / 27) && Math.floor((index % 9) / 3) === Math.floor((selected % 9) / 3)))

  return (
    <div className="game-shell">
      <header className="topbar">
        <div className="logo"><span className="logo-symbol">9</span><span>quiet<br /><b>grid</b></span></div>
        <div className="topbar-right"><span className="mini-status"><i></i> Daily puzzle</span><button className="help-button" title="How to play">?</button></div>
      </header>

      <main className="game-main">
        <section className="intro">
          <div><span className="kicker">SUNDAY, SEPTEMBER 06</span><h1>Take a little<br /><em>quiet time.</em></h1><p>One thoughtful puzzle. No rush.</p></div>
          <div className="stats"><div><span>TIME</span><strong>{formatTime(seconds)}</strong></div><div><span>MISTAKES</span><strong className={mistakes > 0 ? 'mistake-count' : ''}>{mistakes} <small>/ 3</small></strong></div></div>
        </section>

        <section className="play-layout">
          <div className="board-column">
            <div className="board-wrap">
              <div className="sudoku-board" aria-label="Sudoku board">
                {board.map((value, index) => {
                  const isGiven = givens[index] !== 0
                  const isSelected = selected === index
                  const sameNumber = selectedValue !== null && value !== 0 && value === selectedValue
                  return <button key={index} className={`cell ${isGiven ? 'given' : 'editable'} ${isSelected ? 'selected' : ''} ${isRelated(index) ? 'related' : ''} ${sameNumber ? 'same-number' : ''} ${Math.floor(index / 9) % 3 === 2 ? 'row-break' : ''} ${index % 9 % 3 === 2 ? 'col-break' : ''}`} onClick={() => setSelected(index)} aria-label={`Row ${Math.floor(index / 9) + 1}, column ${(index % 9) + 1}`}><span>{value || ''}</span></button>
                })}
              </div>
              <div className="board-message"><span className={complete ? 'message-dot complete-dot' : 'message-dot'}></span>{message}</div>
            </div>
            <div className="number-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => <button key={number} onClick={() => chooseNumber(number)} className={selectedValue === number ? 'number-active' : ''}>{number}</button>)}
              <button className="erase-button" onClick={erase}>⌫ <span>erase</span></button>
            </div>
          </div>

          <aside className="side-panel">
            <div className="side-card hint-card"><div className="card-icon">✦</div><div><span className="card-label">NEED A NUDGE?</span><h2>Stuck on a square?</h2><p>We will reveal the right number and keep your flow going.</p><button onClick={giveHint}>Give me a hint <span>→</span></button></div></div>
            <div className="side-card rules-card"><span className="card-label">THE BASICS</span><h2>Three things to remember</h2><ol><li><b>01</b><span>Each row needs <strong>1–9</strong>, once each.</span></li><li><b>02</b><span>Each column follows the same rule.</span></li><li><b>03</b><span>Every 3×3 box is its own little world.</span></li></ol></div>
            <button className="new-game" onClick={newGame}><span>↻</span> New puzzle</button>
          </aside>
        </section>
      </main>
      <footer className="footer"><span>Made for slow mornings</span><span>PUZZLE № {String(puzzleIndex + 1).padStart(3, '0')}</span></footer>
    </div>
  )
}

export default App
