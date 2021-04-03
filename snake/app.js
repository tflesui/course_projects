// Our Initial state
let gameState = {

    canvas: new Array(20).fill(new Array(20).fill('')),

    playerScore: 0,

    initialSpeed: 175,

    // Initialize snake body and direction
    snake : {
            body: [ [9, 16], [9, 17], [9, 18], [9, 19] ],
            nextDirection: [0, -1]
    },

    // Initialize apple
    apple : {
        location: []
    },

    isGameRunning: null

};


// Render the State
function renderState() {

    const canvasElement = $('#canvas');
    canvasElement.empty();

    gameState.canvas.forEach( function(row, rowIndex) {
        row.forEach( function( segment, segmentIndex) {
            const segmentElement = $(`<div class="segment" data-x="${segmentIndex}" data-y="${rowIndex}"></div>`);
            canvasElement.append(segmentElement);
        })
    })

}

// Build snake
function buildSnake() {
    
    $('#score').text( gameState.playerScore );
    $('.segment').removeClass('snake')
    
    const snakeHead = gameState.snake.body[0];
    const snakeHeadX = snakeHead[0];
    const snakeHeadY = snakeHead[1];


    const newSnakeHeadX = snakeHeadX + gameState.snake.nextDirection[0]
    const newSnakeHeadY = snakeHeadY + gameState.snake.nextDirection[1]
    const newSnakeHead = [ newSnakeHeadX, newSnakeHeadY ]
    

    const snakeBody = gameState.snake.body.slice(1);

    let collide = snakeBody.find( section => {
        return section[0] === newSnakeHead[0] && section[1] === newSnakeHead[1]
    })
    
    if(collide){
        endGame();
    }

    // Check if apple coordinates match Snake Head coordinates
    if( gameState.apple.location[0] === newSnakeHead[0] && gameState.apple.location[1] === newSnakeHead[1] ){   
        // Add  points for eaten apple
        gameState.playerScore += 5;
        // Add to Snake Head (make Snake larger)
        gameState.snake.body.unshift(newSnakeHead);
        // Remove "eaten" Apple
        removeApple();
        // Give Apple new location
        gameState.apple.location = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
        // Update Apple on game board
        showApple();
    } else {
        // Remove tail and add to head
        gameState.snake.body.pop();
        gameState.snake.body.unshift(newSnakeHead);
    }

    // Draw Snake on page (update elements on game board)
    gameState.snake.body.forEach(function(coordinates) {
        // Grab coordinates from Snake body property
        let coordinateX = coordinates[0];
        let coordinateY = coordinates[1];
        const bodyPart = coordinates;
        const segmentElement = $(`[data-x="${coordinateX}"][data-y="${coordinateY}"]`);
        segmentElement.addClass('snake');

    })
    // If snake head coordinates go outside canvas then end the game
    if( newSnakeHeadX < 0 || newSnakeHeadX > 19 || newSnakeHeadY < 0 || newSnakeHeadY > 19 ){
        endGame();
    }
    
}


function showApple() {
    $('.segment').removeClass('apple');
    // Give apple random coordinates within canvas
    gameState.apple.location = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
    const appleLocation = gameState.apple.location;
    const snakeLocation = gameState.snake.body;
    
    const appleXCoordinate = appleLocation[0];
    const appleYCoordinate = appleLocation[1];
    // Display apple on page
    const appleElement = $(`[data-x="${appleXCoordinate}"][data-y="${appleYCoordinate}"]`);
    if (snakeLocation.indexOf(appleLocation) > -1) {
        showApple();
    } else{
        appleElement.addClass('apple');
    }
    
        
       
}

function removeSnake() {
    const canvasElement = $('#canvas');
    canvasElement.empty();
    // Show Game Over message
    $('.message').append('Game Over');
    // Remove Snake from game board
    $('.segment').removeClass('snake');
    // Clear coordinates of snake body
    gameState.snake.body = {};
}

function removeApple() {
    // Remove Apple from game board
    $('.segment').removeClass('apple');
    // Clear coordinates of current Apple location
    gameState.apple.location = [];
}

function endGame() {
    removeSnake();
    removeApple();
    clearInterval(myTimer);
    gameState.isGameRunning = false;
    checkGameOver();
 }


// Arrow Key listeners
$(window).on('keydown', function(event) {
    if (event.keyCode === 37 && gameState.snake.nextDirection[0] !== 1) {
        // Left direction
        gameState.snake.nextDirection = [-1, 0]
    }
    if (event.keyCode === 39 && gameState.snake.nextDirection[0] !== -1) {
        // Right direction
        gameState.snake.nextDirection = [1, 0]
    }
    if (event.keyCode === 38 && gameState.snake.nextDirection[1] !== 1) {
        // Up direction
        gameState.snake.nextDirection = [0, -1]
    }
    if (event.keyCode === 40 && gameState.snake.nextDirection[1] !== -1) {
        // Down direction
        gameState.snake.nextDirection = [0, 1]
    }
})
// Start game on button click
$('#start').on('click', () => {
        startGame();
        gameState.isGameRunning = true;
})
// Define timer variable to enable clearInterval()
let myTimer;

const startGame = () => {
    myTimer = setInterval(tick, gameState.initialSpeed);
    return myTimer;
}

// Refresh the screen in an interval
function tick() {
    buildSnake();
    gameState.playerScore++;
}

function buildInitialState() {
    renderState();
    buildSnake();
    showApple();
}


buildInitialState();