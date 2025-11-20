const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-screen');

let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Function to update the display
function updateDisplay() {
    display.value = displayValue;
}

// Function to handle number and decimal inputs
function inputDigit(digit) {
    if (waitingForSecondOperand === true) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        // Prevent multiple leading zeros, and append digit
        if (digit === '.') {
            // Only add decimal if it doesn't already exist
            if (!displayValue.includes('.')) {
                displayValue += digit;
            }
        } else {
            // Replace '0' if it's the only thing on screen, otherwise append
            displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }
    updateDisplay();
}

// Function to reset the calculator
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Function to perform the calculation
function performCalculation() {
    const inputValue = parseFloat(displayValue);

    if (operator === '+') return firstOperand + inputValue;
    if (operator === '-') return firstOperand - inputValue;
    if (operator === '*') return firstOperand * inputValue;
    if (operator === '/') {
        // Handle division by zero
        if (inputValue === 0) {
            return 'Error';
        }
        return firstOperand / inputValue;
    }
    return inputValue;
}

// Function to handle operators and equals
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        // Allows changing operator before entering second number
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        // Set the first operand if it's the start of a calculation
        firstOperand = inputValue;
    } else if (operator) {
        // If an operator is set, calculate the result
        const result = performCalculation();
        
        // Handle error case (e.g., division by zero)
        if (result === 'Error') {
            displayValue = result;
            firstOperand = null;
            operator = null;
        } else {
            displayValue = String(result);
            firstOperand = result;
        }
    }

    // Prepare for the next operand and set the new operator
    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Event listener for button clicks
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator') && value !== '=') {
        handleOperator(value);
        return;
    }

    if (value === '=') {
        if (firstOperand !== null && operator !== null) {
             // Use the stored operator to perform the final calculation
            handleOperator(operator); 
            operator = null; // Clear operator after equals
        }
        return;
    }

    if (value === 'all-clear') {
        resetCalculator();
        return;
    }

    inputDigit(value);
});

// Initialize the display
updateDisplay();