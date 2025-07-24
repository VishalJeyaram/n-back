import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTimer, useStopwatch } from 'react-timer-hook';
import './styles/Game.css';

function getRandomInt() {
  return Math.floor(Math.random() * 10) + 1;
}
function division() {
  const product = getRandomInt(), num2 = getRandomInt();
  return [product * num2, num2, product];
}
function multiplication() {
  const a = getRandomInt(), b = getRandomInt();
  return [a, b, a * b];
}
function addition() {
  const a = getRandomInt(), b = getRandomInt();
  return [a, b, a + b];
}
function subtraction() {
  const product = getRandomInt(), num2 = getRandomInt();
  return [product + num2, num2, product];
}
const operationMap = { '+': addition, '-': subtraction, '÷': division, '×': multiplication };

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nValue, mode, questionCount, timing, operations } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [canAnswer, setCanAnswer] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalTime, setFinalTime] = useState('');
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [flashColor, setFlashColor] = useState(null);
  const [flashActive, setFlashActive] = useState(false);

  const inputRef = useRef(null);

  const generateQuestions = useCallback(() => {
    if (!operations?.length) return [];
    const total = mode === 'Timed'
      ? 1000
      : questionCount + nValue + 5;
    return Array.from({ length: total }, () => {
      const op = operations[Math.floor(Math.random() * operations.length)];
      const [num1, num2, correct] = operationMap[op]();
      return { num1, num2, op, correct };
    });
  }, [operations, mode, questionCount, nValue]);

  useEffect(() => {
    setQuestions(generateQuestions());
  }, [generateQuestions]);

  const { minutes, seconds, restart } = useTimer({
    expiryTimestamp: new Date(), 
    autoStart: false,
    onExpire: () => {
      setFinalTime('0:00');
      setGameOver(true);
    }
  });

  const { minutes: sm, seconds: ss } = useStopwatch({ autoStart: true });

  useEffect(() => {
    if (gameOver || !questions.length || currentIndex >= questions.length) return;

    if (currentIndex < nValue) {
      setCanAnswer(false);
      const t = setTimeout(() => setCurrentIndex(i => i + 1), 3000);
      return () => clearTimeout(t);
    }

    if (startTime === null) {
      const now = new Date();
      setStartTime(now);
      if (mode === 'Timed') {
        restart(new Date(now.getTime() + timing), true);
      }
    }

    setCanAnswer(true);
  }, [questions, currentIndex, nValue, startTime, gameOver, mode, timing, restart]);

  useEffect(() => {
    if (canAnswer && inputRef.current) inputRef.current.focus();
  }, [canAnswer, currentIndex]);

  const handleSubmit = () => {
    const correctStr = String(questions[currentIndex - nValue].correct);
    const ok = userAnswer === correctStr;
    setIsCorrect(ok);
    setFeedback(ok ? 'Correct!' : `Wrong! Correct was: ${correctStr}`);
    setUserAnswer('');

    const newAnswered = answeredCount + 1;
    setAnsweredCount(newAnswered);
    if (ok) setCorrectCount(c => c + 1);

    const finishUntimed = mode === 'Untimed' && newAnswered >= questionCount;
    if (finishUntimed) {
      setFinalTime(`${sm}:${String(ss).padStart(2,'0')}`);
    }

    const advance = () => {
      finishUntimed ? setGameOver(true) : setCurrentIndex(i => i + 1);
    };

    if (flashEnabled) {
      setFlashColor(ok ? 'correct' : 'wrong');
      setFlashActive(true);
      setTimeout(() => {
        setFlashActive(false);
        advance();
      }, 80);
    } else {
      advance();
    }
  };

  const resetGame = () => {
    setQuestions(generateQuestions());
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback('');
    setIsCorrect(null);
    setCanAnswer(false);
    setStartTime(null);
    setAnsweredCount(0);
    setCorrectCount(0);
    setGameOver(false);
    setFinalTime('');
    setFlashActive(false);
  };

  const currentQ = questions[currentIndex];
  const qNum = currentIndex - nValue + 1;
  const totalSec = minutes * 60 + seconds;
  const timerColor =
    totalSec <= 10 ? 'red-timer' :
    totalSec <= 30 ? 'orange-timer' : 'green-timer';

  return (
    <div className="game-container">
      {flashEnabled && flashActive && (
        <div className={`flash-overlay ${flashColor}`} />
      )}

      <button
        className="flash-toggle"
        onClick={() => setFlashEnabled(f => !f)}
      >
        Flash: {flashEnabled ? 'On' : 'Off'}
      </button>

      {gameOver ? (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Game Over</h2>
            <p>
              Score: {mode === 'Untimed'
                ? `${correctCount} / ${answeredCount}`
                : `${correctCount}`}
            </p>
            <p>Time: {mode === 'Timed'
              ? `${Math.floor(timing/60000)}:${String((timing%60000)/1000).padStart(2,'0')}`
              : finalTime
            }</p>
            <div className="modal-buttons">
              <button className="mode-button" onClick={resetGame}>
                Restart
              </button>
              <button className="mode-button" onClick={() => navigate('/')}>
                Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="game-title">{nValue}-back</h1>
          <p className="game-subtitle">
            Operations: {operations.join(', ')}
          </p>

          {mode === 'Timed' && canAnswer && (
            <div className="question-timer">
              <p className="question-counter">Question {qNum}</p>
              <p className={`section-heading timer-inline ${timerColor}`}>
                {minutes}:{String(seconds).padStart(2,'0')}
              </p>
            </div>
          )}

          {mode === 'Untimed' && canAnswer && (
            <div className="question-timer">
              <p className="question-counter">
                Question {qNum} of {questionCount}
              </p>
              <p className="section-heading timer-inline stopwatch-inline">
                {sm}:{String(ss).padStart(2,'0')}
              </p>
            </div>
          )}

          {currentQ && (
            <>
              <h2 className="operation-question">
                {currentQ.num1} {currentQ.op} {currentQ.num2} = ?
              </h2>

              {canAnswer ? (
                <div className="side-by-side">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input-answer"
                value={userAnswer}
                onChange={e => {
                  const onlyDigits = e.target.value.replace(/\D+/g, '');
                  setUserAnswer(onlyDigits);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Your Answer"
              />
                  <button className="mode-button" onClick={handleSubmit}>
                    Press Enter or click here to submit
                  </button>
                </div>
              ) : (
                <p className="game-subtitle">Memorize this!</p>
              )}
            </>
          )}

          <p className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            {feedback}
          </p>
        </>
      )}
    </div>
  );
}
