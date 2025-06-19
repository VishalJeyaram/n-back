import React, { useState } from 'react';
import './styles/Home.css';
import Slider from '@mui/material/Slider';
import { useNavigate } from 'react-router-dom';

const marks = Array.from({ length: 10 }, (_, i) => ({
  value: i,
  label: `${i}`
}));

function valuetext(value) {
  return `${value}`;
}

function nDescription(n) {
  switch (n) {
    case 0: return "Zero? Bold of you to assume this is even a memory game.";
    case 1: return "N=1? Baby steps, I see. You got this... maybe.";
    case 2: return "The classic 2-back. Just enough to feel smart, but not cry. Respect.";
    case 3: return "Okay, okay. Someone’s getting serious now.";
    case 4: return "4-back? Flexing those neurons, aren’t we?";
    case 5: return "5? Alright Einstein, let’s see how long you last.";
    case 6: return "You must love pain. Or you’re just here to roast your own brain.";
    case 7: return "Ah yes, 7-back. Where dreams go to die.";
    case 8: return "At this point, you’re not playing the game. The game is playing you.";
    case 9: return "9? You okay? Blink twice if you need help.";
    case null: return " ddikdkdk"
    default: return " HELLO";
  }
}

function Home() {
  const [nValue, setNValue] = useState(null);
  const [mode, setMode] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [timing, setTiming] = useState(null);
  const [operations, setOperations] = useState([]);


  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game', {
      state: {
        nValue,
        mode,
        questionCount,
        timing,
        operations, 
      },
    });
  };


  return (
    <div className="home-container">
      <h1 className="home-title">n-back</h1>
      <p className="home-subtitle">A cursed game that will test the limits of your memory.</p>

      {nValue == null && <h3 className="section-heading">Select n-value</h3>}
      <div className="slider-container">
        <Slider
          aria-label="N Value"
          value={nValue ?? 0}
          onChange={(e, val) => setNValue(val)}
          getAriaValueText={valuetext}
          step={1}
          marks={marks}
          min={0}
          max={9}
          color="black"
        />
      </div>

      {nValue !== null && (
        <>
          <p className="n-label">n = {nValue}</p>
          <p className="n-description">{nDescription(nValue)}</p>
        </>
      )}

      <div className="side-by-side">
        <div>
          <h3 className="section-heading">Select Mode</h3>
          <div className="button-group">
            <button
              className={`mode-button ${mode === 'Untimed' ? 'selected' : ''}`}
              onClick={() => {
                setMode('Untimed');
                setTiming(null);
              }}
            >
              No Time Limit 
            </button>
            <button
              className={`mode-button ${mode === 'Timed' ? 'selected' : ''}`}
              onClick={() => {
                setMode('Timed');
                setQuestionCount(null);
              }}
            >
              Time Limit
            </button>
          </div>
        </div>

{mode && (
  <div>
    <h3 className="section-heading">
      {mode === 'Untimed' ? 'Number of Questions' : 'Game Duration'}
    </h3>

    <div className="button-group">
      {mode === 'Untimed'
        ? [15, 30, 45].map(count => (
            <button
              key={count}
              className={`mode-button ${questionCount === count ? 'selected' : ''}`}
              onClick={() => setQuestionCount(count)}
            >
              {count} 
            </button>
          ))
        : [60000, 300000, 600000].map(time => (
            <button
              key={time}
              className={`mode-button ${timing === time ? 'selected' : ''}`}
              onClick={() => setTiming(time)}
            >
              {time / 60000} min
            </button>
          ))}
    </div>
  </div>
)}


{mode && (
  <div>
    <h3 className="section-heading">Types of Operations</h3>

    <div className="button-group">
      {['+', '-', '÷', '×'].map(op => (
        <button
          key={op}
          className={`mode-button ${operations.includes(op) ? 'selected' : ''}`}
          onClick={() => {
            setOperations(prev =>
              prev.includes(op)
                ? prev.filter(o => o !== op) // deselect
                : [...prev, op] // select
            );
          }}
        >
          {op}
        </button>
      ))}
    </div>
  </div>
)}

      </div>

      <button
        className="start-button"
        onClick={handleStartGame}
        disabled={
          nValue === null ||
          mode === null ||
          (mode === "Untimed" && questionCount === null) ||
          (mode === "Timed" && timing === null)
        }
      >
        Start Game
      </button>
    </div>
  );
}

export default Home;
