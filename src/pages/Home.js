// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import './styles/Home.css';

const marks = Array.from({ length: 10 }, (_, i) => ({ value: i, label: `${i}` }));
function valuetext(value) { return `${value}`; }

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
    default: return "";
  }
}

function Home() {
  const [nValue, setNValue] = useState(null);
  const [mode, setMode] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [timing, setTiming] = useState(null);
  const [operations, setOperations] = useState([]);
  const [opsHoverReady, setOpsHoverReady] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setOpsHoverReady(prev => {
      const next = {};
      operations.forEach(op => {
        next[op] = prev[op] || false;
      });
      return next;
    });
  }, [operations]);

  const toggleOp = (op) => {
    setOperations(prev =>
      prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]
    );
    setOpsHoverReady(prev => ({ ...prev, [op]: false }));
  };

  const handleStartGame = () => {
    navigate('/game', {
      state: { nValue, mode, questionCount, timing, operations },
    });
  };

  return (
    <div className="home-container">
      <h1 className="home-title">n-back</h1>
      <p className="home-subtitle">
        A cursed game that will test the limits of your memory.
      </p>

      <h3 className="section-heading">Select n-value</h3>
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
          sx={{
            height: 10,
            '& .MuiSlider-track': { height: 10 },
            '& .MuiSlider-rail':  { height: 10 },
            '& .MuiSlider-thumb': { width: 24, height: 24 },
          }}
          color='black'
        />
      </div>

      {nValue === null ? (
        <p className="n-description">Choose wisely my friend</p>
      ) : (
        <>
          <p className="n-label">n = {nValue}</p>
          <p className="n-description">{nDescription(nValue)}</p>
        </>
      )}

      <div className="side-by-side">
        <div>
          <h3 className="section-heading">Select Mode</h3>
          <div className="button-group">
            {['Untimed', 'Timed'].map(m => (
              <button
                key={m}
                className={`mode-button ${mode === m ? 'selected' : ''}`}
                onClick={() => {
                  setMode(m);
                  if (m === 'Untimed') setTiming(null);
                  else setQuestionCount(null);
                }}
              >
                {m === 'Untimed' ? 'No Time Limit' : 'Time Limit'}
              </button>
            ))}
          </div>
        </div>

        {mode && (
          <div>
            <h3 className="section-heading">
              {mode === 'Untimed' ? 'Number of Questions' : 'Game Duration'}
            </h3>
            <div className="button-group">
              {(mode === 'Untimed' ? [15, 30, 45] : [60000, 300000, 600000]).map(val => {
                const isTime = mode === 'Timed';
                const selected = isTime ? timing === val : questionCount === val;
                return (
                  <button
                    key={val}
                    className={`mode-button ${selected ? 'selected' : ''}`}
                    onClick={() => isTime ? setTiming(val) : setQuestionCount(val)}
                  >
                    {isTime ? `${val / 60000} min` : val}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode && (
          <div className="operations-group">
            <h3 className="section-heading">Types of Operations</h3>
            <div className="button-group">
              {['+', '-', '÷', '×'].map(op => {
                const selected = operations.includes(op);
                const hoverReady = opsHoverReady[op];
                return (
                  <button
                    key={op}
                    className={[
                      'mode-button',
                      selected && 'selected',
                      selected && hoverReady && 'deselect-hover'
                    ].filter(Boolean).join(' ')}
                    onClick={() => toggleOp(op)}
                    onMouseLeave={() => {
                      if (selected) {
                        setOpsHoverReady(prev => ({ ...prev, [op]: true }));
                      }
                    }}
                  >
                    {op}
                  </button>
                );
              })}
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
          (mode === 'Untimed' && questionCount === null) ||
          (mode === 'Timed' && timing === null) ||
          operations.length === 0    
        }
      >
        Start Game
      </button>
    </div>
  );
}

export default Home;
