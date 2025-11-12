import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Calculate function - evaluates a mathematical expression
 * @param {string} expression - The mathematical expression to evaluate
 * @returns {string} - The result of the calculation or error message
 */
function calculate(expression) {
  try {
    // Remove whitespace
    expression = expression.trim();
    
    if (!expression) {
      return 'Error: Empty expression';
    }

    // Replace calculator symbols with JavaScript operators
    let jsExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Validate expression (only allow numbers, operators, parentheses, and decimal points)
    if (!/^[\d+\-*/.%() ]+$/.test(jsExpression)) {
      return 'Error: Invalid characters';
    }

    // Evaluate the expression
    // Using Function constructor as a safer alternative to eval
    const result = Function('"use strict"; return (' + jsExpression + ')')();
    
    // Check if result is valid
    if (typeof result !== 'number' || !isFinite(result)) {
      return 'Error: Invalid result';
    }

    // Round to avoid floating point errors
    const rounded = Math.round(result * 1000000000) / 1000000000;
    
    return rounded.toString();
  } catch (error) {
    return 'Error: Invalid expression';
  }
}

// API endpoint
app.post('/calculate', (req, res) => {
  const { expression } = req.body;
  
  if (typeof expression !== 'string') {
    return res.status(400).json({ 
      error: 'Expression must be a string' 
    });
  }

  const result = calculate(expression);
  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Calculator backend server running on http://localhost:${PORT}`);
});

