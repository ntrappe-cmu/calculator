import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('')

  const handleNumberClick = (num) => {
    setDisplay(display + num)
  }

  const handleOperatorClick = (operator) => {
    // Prevent adding operator if display is empty
    if (display === '' && operator !== '-') return
    
    // Check if the last character is already an operator
    const lastChar = display.slice(-1)
    const operators = ['+', '-', '×', '÷', '%']
    if (operators.includes(lastChar)) {
      // Replace the last operator instead of adding a new one
      let op = operator
      if (operator === '*') op = '×'
      if (operator === '/') op = '÷'
      setDisplay(display.slice(0, -1) + op)
      return
    }
    
    // Replace calculator display symbols with the ones we'll show
    let op = operator
    if (operator === '*') op = '×'
    if (operator === '/') op = '÷'
    
    setDisplay(display + op)
  }

  const handleDecimalClick = () => {
    // Add decimal only if the last number doesn't already have one
    const parts = display.split(/[+\-×÷%]/)
    const lastPart = parts[parts.length - 1]
    if (!lastPart.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleClear = () => {
    setDisplay('')
  }

  const handleBackspace = () => {
    setDisplay(display.slice(0, -1))
  }

  const handleToggleSign = () => {
    if (display === '') return
    
    // Find the last number in the expression
    const regex = /(-?\d+\.?\d*)$/
    const match = display.match(regex)
    
    if (match) {
      const lastNumber = match[0]
      const position = match.index
      
      let newNumber
      if (lastNumber.startsWith('-')) {
        newNumber = lastNumber.substring(1)
      } else {
        newNumber = '-' + lastNumber
      }
      
      setDisplay(display.substring(0, position) + newNumber)
    }
  }

  const handleEquals = useCallback(async () => {
    if (display === '') return
    
    try {
      // Call backend API
      const response = await fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression: display }),
      })
      
      const data = await response.json()
      
      if (data.result) {
        setDisplay(data.result)
      } else if (data.error) {
        setDisplay('Error')
      }
    } catch (error) {
      console.error('Error calling backend:', error)
      setDisplay('Error: Cannot connect to server')
    }
  }, [display])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key

      // Numbers 0-9
      if (key >= '0' && key <= '9') {
        setDisplay((prev) => prev + key)
        return
      }

      // Operators
      if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        setDisplay((prev) => {
          // Prevent adding operator if display is empty
          if (prev === '' && key !== '-') return prev
          
          // Check if the last character is already an operator
          const lastChar = prev.slice(-1)
          const operators = ['+', '-', '×', '÷', '%']
          if (operators.includes(lastChar)) {
            // Replace the last operator instead of adding a new one
            let op = key
            if (key === '*') op = '×'
            if (key === '/') op = '÷'
            return prev.slice(0, -1) + op
          }
          
          // Replace calculator display symbols with the ones we'll show
          let op = key
          if (key === '*') op = '×'
          if (key === '/') op = '÷'
          
          return prev + op
        })
        return
      }

      // Decimal point
      if (key === '.') {
        setDisplay((prev) => {
          // Add decimal only if the last number doesn't already have one
          const parts = prev.split(/[+\-×÷%]/)
          const lastPart = parts[parts.length - 1]
          if (!lastPart.includes('.')) {
            return prev + '.'
          }
          return prev
        })
        return
      }

      // Equals
      if (key === 'Enter' || key === '=') {
        event.preventDefault() // Prevent default Enter behavior
        handleEquals()
        return
      }

      // Backspace
      if (key === 'Backspace') {
        setDisplay((prev) => prev.slice(0, -1))
        return
      }

      // Clear
      if (key === 'Escape' || key.toLowerCase() === 'c') {
        setDisplay('')
        return
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleEquals])

  return (
    <div className="calculator">
      <div className="display">{display || '0'}</div>
      <div className="buttons">
        <button className="btn btn-function" onClick={handleClear}>Clear</button>
        <button className="btn btn-function" onClick={handleBackspace}>⌫</button>
        <button className="btn btn-function" onClick={handleToggleSign}>+/-</button>
        <button className="btn btn-operator" onClick={() => handleOperatorClick('/')}>÷</button>
        
        <button className="btn btn-number" onClick={() => handleNumberClick('7')}>7</button>
        <button className="btn btn-number" onClick={() => handleNumberClick('8')}>8</button>
        <button className="btn btn-number" onClick={() => handleNumberClick('9')}>9</button>
        <button className="btn btn-operator" onClick={() => handleOperatorClick('*')}>×</button>
        
        <button className="btn btn-number" onClick={() => handleNumberClick('4')}>4</button>
        <button className="btn btn-number" onClick={() => handleNumberClick('5')}>5</button>
        <button className="btn btn-number" onClick={() => handleNumberClick('6')}>6</button>
        <button className="btn btn-operator" onClick={() => handleOperatorClick('-')}>-</button>
        
        <button className="btn btn-number" onClick={() => handleNumberClick('3')}>3</button>
        <button className="btn btn-number" onClick={() => handleNumberClick('2')}>2</button>
        <button className="btn btn-number" onClick={() => handleNumberClick('1')}>1</button>
        <button className="btn btn-operator" onClick={() => handleOperatorClick('+')}>+</button>
        
        <button className="btn btn-number" onClick={() => handleNumberClick('0')}>0</button>
        <button className="btn btn-number" onClick={handleDecimalClick}>.</button>
        <button className="btn btn-operator" onClick={() => handleOperatorClick('%')}>%</button>
        <button className="btn btn-equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  )
}

export default App
