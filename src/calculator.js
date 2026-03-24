/**
 * Add two numbers together.
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} - The sum of a and b
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

function calculateWithDiscount(value1, value2, operationType, hasDiscount) {
  let result;

  if (operationType === "add") {
    result = add(value1, value2);
  } else if (operationType === "multiply") {
    result = multiply(value1, value2);
  } else {
    throw new Error("Unknown operation type");
  }

  if (hasDiscount) {
    result = result > 100 ? result * 0.9 : result * 0.95;
  }

  return result;
}

module.exports = { add, subtract, multiply, divide, calculateWithDiscount };
