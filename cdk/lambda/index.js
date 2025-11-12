/**
 * AWS Lambda handler for calculator API
 * This file uses ES6 modules (.mjs) format
 */

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

/**
 * Lambda handler function - connected to calculate()
 * This is the entry point that AWS Lambda will call
 */
export const handler = async (event) => {
  // Enable CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { expression } = body;

    // Validate input
    if (typeof expression !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Expression must be a string' })
      };
    }

    // Call the calculate() function
    const result = calculate(expression);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result })
    };
  } catch (error) {
    // Return error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};