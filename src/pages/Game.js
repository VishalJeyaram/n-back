import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTimer, useStopwatch } from 'react-timer-hook';
import './styles/Game.css';

function getRandomInt() {
  return Math.floor(Math.random() * (11 - 1) + 1);
}

function division() {
  const product = getRandomInt();
  const num2 = getRandomInt();
  const num1 = product * num2;
  return [num1, num2, product];
}

function multiplication() {
  const num1 = getRandomInt();
  const num2 = getRandomInt();
  return [num1, num2, num1 * num2];
}

function addition() {
  const num1 = getRandomInt();
  const num2 = getRandomInt();
  return [num1, num2, num1 + num2];
}

function subtraction() {
  const product = getRandomInt();
  const num2 = getRandomInt();
  return [product + num2, num2, product];
}

const operationMap = {
  '+': addition,
  '-': subtraction,
  '÷': division,
  '×': multiplication,
};

function MyTimer({ expiryTimestamp }) {
  const { minutes, seconds } = useTimer({ expiryTimestamp });
  return <p className="section-heading">Timer: {minutes}:{seconds < 10 ? '0' : ''}{seconds}</p>;
}

function MyStopwatch() {
  const { minutes, seconds } = useStopwatch({ autoStart: true });
  return <p className="section-heading">Stopwatch: {minutes}:{seconds < 10 ? '0' : ''}{seconds}</p>;
}

function Game() {
  const location = useLocation();
  const { nValue, mode, questionCount, timing, operations } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [canAnswer, setCanAnswer] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Pre-generate questions
  useEffect(() => {
    if (!operations || operations.length === 0) return;

    const total = mode === 'Timed' ? 1000 : questionCount + nValue + 5;
    const generated = Array.from({ length: total }, () => {
      const op = operations[Math.floor(Math.random() * operations.length)];
      const [num1, num2, correct] = operationMap[op]();
      return { num1, num2, op, correct };
    });

    setQuestions(generated);
  }, [operations, mode, questionCount, nValue]);

  // Control question advancement
  useEffect(() => {
    if (questions.length === 0 || currentIndex >= questions.length) return;

    if (currentIndex < nValue) {
      setCanAnswer(false);
      const timer = setTimeout(() => setCurrentIndex(prev => prev + 1), 3000);
      return () => clearTimeout(timer);
    }

    if (startTime === null) setStartTime(new Date());
    setCanAnswer(true);
  }, [currentIndex, questions, nValue, startTime]);

  const expiryTimestamp = useMemo(() => {
    if (mode === 'Timed' && timing && startTime) {
      const end = new Date(startTime.getTime() + timing);
      return end;
    }
    return null;
  }, [startTime, timing, mode]);

  const handleSubmit = () => {
    const correctAnswer = questions[currentIndex - nValue].correct.toString();
    setFeedback(userAnswer === correctAnswer ? 'Correct!' : `Wrong! Correct was: ${correctAnswer}`);
    setUserAnswer('');
    setCurrentIndex(prev => prev + 1);
    setCanAnswer(false);
  };

  const currentQ = questions[currentIndex];
  const currentQuestionNumber = currentIndex - nValue + 1;
  const remainingQuestions = questionCount - currentQuestionNumber;

  return (
    <div className="game-container">
      <h1 className="game-title">{nValue}-back</h1>
      <p className="game-subtitle">Operations: {operations?.join(', ')}</p>

      {mode === 'Timed' && currentIndex >= nValue && (
        <p className="question-counter">
          Question {currentQuestionNumber} 
        </p>
      )}

        {mode === 'Untimed' && currentIndex >= nValue && currentQuestionNumber <= questionCount && (
        <p className="question-counter">
          Question {currentQuestionNumber} of {questionCount} &nbsp; | &nbsp;
          {remainingQuestions > 0 ? `${remainingQuestions} left` : 'Last Question'}
        </p>
      )}

      {currentQ && (
        <>
          <h2 className="operation-question">
            {currentQ.num1} {currentQ.op} {currentQ.num2} = ?
          </h2>

          {canAnswer ? (
            <>
              <div className='side-by-side'>

              <input
                type="number"
                className="input-answer"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Your Answer"
              />
              <button className="mode-button" onClick={handleSubmit}>Submit</button>
              </div>

            </>
          ) : (
            <p className="game-subtitle">Memorize this!</p>
          )}
        </>
      )}


      <p className="feedback">{feedback}</p>

      {startTime && mode === 'Timed' && <MyTimer expiryTimestamp={expiryTimestamp} />}
      {startTime && mode === 'Untimed' && <MyStopwatch />}
    </div>
  );
}

export default Game;
