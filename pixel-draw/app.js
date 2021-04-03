// Create grid

const makeGrid = () => {
    // Add cells to grid
    for (let i = 0; i < 64; i++) {
        $('.grid').append('<div class="cell">');    
    };
};

makeGrid();

// Create color palette

const makePalette = () => {
    // Define Colors
    const PALETTE = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'white',
        'black'
    ]
    
    // Setup palette 
    for (let i = 0; i < PALETTE.length; i++ ) {
        // access the color
        const nextColor = PALETTE[i];
        // create button
        $('.palette').append('<button>');
        // apply background color to last button created
        $('.palette > button:last-child').css('background-color', nextColor);
       
    };

    // Make first button active
    $('.palette button').first().addClass('active');
};

makePalette();

// Color palette functionality

function onPaletteClick() {
    // Remove active class from current active button
    $('.palette button').removeClass('active'); 
    // Toggle active class from selected color
    if ( $('.palette button').hasClass() ) {
        $(this).toggleClass('active');
    } else {
        $(this).toggleClass('active');
    }
};

// Run color function palette when palette button is clicked
$('.palette button').click(onPaletteClick);

// Color input functionality
$('.color-input button').click( () => {
    // Store input value
    const addColor = $('.color-input input').val(); 
    // Remove active class from current active button
    $('.palette button').removeClass('active'); 

    // Verify input and add to list
    if (addColor.length > 0) {
        $('.palette').prepend('<button>');
        $('.palette > button:first-child').css('background-color', addColor).addClass('active');
        
    }
    // clear the input
    $('.color-input input').val("");

    

})

// Grid fill functionality

function onGridClick() {
    
    $('.grid .cell').click( function() {
        // Store color from button with active class
        const gridColor = $('.active').css('background-color');

        if ( $(this).css('background-color') === gridColor) {
            // Change background color of selected grid cell
            $(this).css('background-color', '');
        } else {
            $(this).css('background-color',gridColor);
        }
    });

}

onGridClick();

// Clear all cells functionality

function onClearClick() {
    // Remove background color from cells
    $('.grid .cell').css('background-color','');
}

// Run grid clear when button is clicked
$('.controls .clear').click(onClearClick);

// Fill all cells functionality

function onFillAllClick() {
    // Store color of active palette button
    const fillColor = $('.active').css('background-color');
    // Replace background color of all cells with active color
    $('.grid .cell').css('background-color', fillColor);
}

// Fill all cells when button is clicked
$('.controls .fill-all').click(onFillAllClick);

// Fill empty cells functionality

function onFillEmptyClick() {
    // Store each cell
    const elements = $('.grid .cell');
    // Store active color
    const activeColor = $('.active').css('background-color');

    // Check each cell for background color
    for(let i = 0; i < elements.length; i++) {
        let nextElement = $( elements[i] );
        if (nextElement.css('background-color') === 'rgba(0, 0, 0, 0)') {
            // If cell has no color, change background to the active color
            nextElement.css('background-color', activeColor);
        }
    }
}
// Fill all empty cells when button is clicked
$('.controls .fill-empty').click(onFillEmptyClick);
