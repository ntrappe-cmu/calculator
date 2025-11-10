gi# Calculator App

A modern, full-stack calculator application built with React (frontend) and Node.js/Express (backend).

## Features

- **Numbers**: 0-9 and decimal point (.)
- **Operations**: Addition (+), Subtraction (-), Multiplication (×), Division (÷), Modulo (%)
- **Functions**: 
  - Clear: Reset the calculator
  - Backspace (⌫): Delete the last character
  - +/-: Toggle the sign of the current number
  - = : Calculate the result

## Architecture

### Frontend (React + Vite)
- Built with React 19 and Vite
- Displays calculator interface with all buttons
- Handles Clear and Backspace operations locally
- Sends expression to backend when "=" is pressed

### Backend (Node.js + Express)
- Express server running on port 3001
- Single endpoint: `POST /calculate`
- Takes a string expression and returns the calculated result
- Handles error cases (invalid expressions, division by zero, etc.)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

You need to run both the frontend and backend:

### Terminal 1 - Backend Server
```bash
npm run server
```
This starts the Express server on `http://localhost:3001`

### Terminal 2 - Frontend Development Server
```bash
npm run dev
```
This starts the Vite dev server (usually on `http://localhost:5173`)

## Usage

1. Open your browser and navigate to the frontend URL (displayed in Terminal 2)
2. Click number buttons to build your expression
3. Use operator buttons (+, -, ×, ÷, %) to add operations
4. Click "=" to send the expression to the backend and see the result
5. Use "Clear" to reset or "⌫" to delete the last character
6. Use "+/-" to toggle the sign of the current number

## API

### POST /calculate

**Request Body:**
```json
{
  "expression": "5+3*2"
}
```

**Response:**
```json
{
  "result": "11"
}
```

**Error Response:**
```json
{
  "error": "Expression must be a string"
}
```

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Node.js, Express
- **Styling**: CSS3 with modern gradients and shadows
- **Development**: ESLint for code quality

## Project Structure

```
calculator/
├── src/
│   ├── App.jsx          # Calculator component
│   ├── App.css          # Calculator styles
│   ├── main.jsx         # React entry point (unchanged)
│   └── index.css        # Global styles
├── server.js            # Express backend server
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Notes

- The backend uses a safe evaluation method for calculating expressions
- The display shows the full expression as you build it
- Results are rounded to avoid floating-point precision errors
- The calculator has a modern, gradient design with smooth animations
