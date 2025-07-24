# 🧠 n-back Memory Game

A cursed memory game that challenges your brain with arithmetic operations and n-back recall. Built using React, this app is designed to test short-term memory and attention, either in timed or untimed modes.

## 🚀 Features

- Choose your desired **n-value** (0 to 9)
- Select between **Timed** (1 min, 5 min, 10 min) or **Untimed** (15, 30, 45 questions) modes
- Practice different **arithmetic operations**: addition (`+`), subtraction (`-`), multiplication (`×`), and division (`÷`)
- Immediate feedback after each answer: **Correct!** or the correct answer shown
- Automatically starts timing after the first n questions
- Clean UI and intuitive game flow

---

## 🎮 How to Play

1. Choose your **n-back** level (n = 0 to 9)
2. Select a game mode:
   - **Untimed**: Fixed number of questions
   - **Timed**: Unlimited questions within a time limit
3. Choose one or more math operations
4. The first `n` questions will appear one by one (3 seconds each) for memorization.
5. Starting from the (n+1)th question, enter the answer to the question shown **n questions ago**.

---

## 🛠 Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (v14 or above)
- npm

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/VishalJeyaram/n-back.git
cd n-back
npm install
```

### Start Development Server

npm start
