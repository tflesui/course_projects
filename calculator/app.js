// Variable definitions
let heldValue = null;
let nextValue = null;
let heldOperation = null;
const und = 'undefined';

// Function definitions
function showValue(location, value) {
   if (value === null) {
      $(location).text('');
   } else if (value == und) {
      $(location).text('Undefined');
   } else {
       $(location).text( Number(value) );
   }
}

function updateDisplay() {
    showValue('.held-value', heldValue);
    showValue('.next-value', nextValue);
}

function setHeldOperation(operation) {
    if( heldOperation !== null ) {
        heldValue = heldOperation(Number(heldValue), Number(nextValue));
    } else if( nextValue !== null) {
        heldValue = nextValue;
    }

    nextValue = null;
    heldOperation = operation;
}

function clearAll() {
    heldOperation = null;
    heldValue = null;
    nextValue = null;
}

function clearEntry() {
    nextValue = null;
}

function add(x,y) {
    return x + y;
}

function subtract(x,y) {
    return x - y;
}

function multiply(x,y) {
    return x * y;
}

function divide(x,y) {
    if ( y !== 0) {
        return x / y;
    } else {
        return und;
    }
}

function square(x) {
    return Math.pow(x,2);
}

function inverse(x) {
    return 1 / x;
}

function negate(x) {
    return x * -1;
}

// Click handlers

$('.digits button').click(function () {
    if (nextValue === null) {
        nextValue = '0';
    }
    nextValue = nextValue + $(this).text();
    updateDisplay();
});

$('.add').click(function () {
    setHeldOperation(add);
    $('.next-operation').html('&plus;');
    updateDisplay();
})

$('.subtract').click(function () {
    setHeldOperation(subtract);
    $('.next-operation').html('&minus;');
    updateDisplay();
})

$('.multiply').click(function () {
    setHeldOperation(multiply);
    $('.next-operation').html('&times;');
    updateDisplay();
})

$('.divide').click(function () {
    setHeldOperation(divide);
    $('.next-operation').html('&#247;');
    updateDisplay();
})

$('.square').click(function () {
    setHeldOperation(square);
    $('.next-operation').text('^2');
    updateDisplay();
})

$('.inverse').click(function () {
    setHeldOperation(inverse);
    $('.next-operation').text('1/x');
    updateDisplay();
})

$('.negate').click(function () {
    setHeldOperation(negate);
    $('.next-operation').text('+/-');
    updateDisplay();
})

$('.equals').click(function () {
    setHeldOperation(null); 
    $('.next-operation').text('');
    updateDisplay();
})

$('.clear-all').click(function () {
    clearAll();
    $('.next-operation').text('');
    updateDisplay();
})

$('.clear-entry').click(function() {
    clearEntry();
    updateDisplay();
})

