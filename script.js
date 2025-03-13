// Game elements
const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');
const winMessage = document.getElementById('win-message');
const playAgainBtn = document.getElementById('play-again-btn');

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let isProcessing = false;
let moves = 0;
let timer = 0;
let timerInterval;

// Card icons (Font Awesome)
const cardIcons = [
    'fa-heart', 'fa-star', 'fa-bolt', 'fa-cloud',
    'fa-bell', 'fa-moon', 'fa-sun', 'fa-fire'
];

// Initialize game
function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    isProcessing = false;
    moves = 0;
    timer = 0;
    clearInterval(timerInterval);
    
    // Reset UI
    timerElement.textContent = 'Time: 0s';
    movesElement.textContent = 'Moves: 0';
    gameBoard.innerHTML = '';
    winModal.classList.remove('active');
    
    // Create card pairs
    const cardPairs = [...cardIcons, ...cardIcons];
    
    // Shuffle cards
    shuffleArray(cardPairs);
    
    // Create card elements
    cardPairs.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardIndex = index;
        card.dataset.cardValue = icon;
        
        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">
                <i class="fas ${icon}"></i>
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
    
    // Start timer
    startTimer();
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start game timer with minutes and seconds display
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        if (minutes > 0) {
            timerElement.textContent = `Time: ${minutes}m ${seconds}s`;
        } else {
            timerElement.textContent = `Time: ${seconds}s`;
        }
    }, 1000);
}

// Handle card flip
function flipCard() {
    const card = this;
    
    // Prevent flipping if already processing, card is flipped or matched
    if (
        isProcessing || 
        flippedCards.length >= 2 || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched')
    ) {
        return;
    }
    
    // Flip card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = `Moves: ${moves}`;
        
        isProcessing = true;
        
        // Check if cards match
        const firstCard = flippedCards[0];
        const secondCard = flippedCards[1];
        
        if (firstCard.dataset.cardValue === secondCard.dataset.cardValue) {
            // Match found
            handleMatch();
        } else {
            // No match
            handleMismatch();
        }
    }
}

// Handle matching cards
function handleMatch() {
    flippedCards.forEach(card => {
        setTimeout(() => {
            card.classList.add('matched');
        }, 500);
    });
    
    matchedPairs++;
    
    // Reset for next turn
    setTimeout(() => {
        flippedCards = [];
        isProcessing = false;
        
        // Check if game is complete
        if (matchedPairs === cardIcons.length) {
            endGame();
        }
    }, 800);
}

// Handle mismatched cards
function handleMismatch() {
    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.remove('flipped');
        });
        
        // Reset for next turn
        flippedCards = [];
        isProcessing = false;
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    
    // Prepare win message
    const timeTaken = timer;
    const totalMoves = moves;
    
    let minutes = Math.floor(timeTaken / 60);
    let seconds = timeTaken % 60;
    let timeText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    // Calculate stars (performance rating)
    let stars = 3;
    if (moves > cardIcons.length * 2) {
        stars = 2;
    }
    if (moves > cardIcons.length * 3) {
        stars = 1;
    }
    
    // Update win message
    winMessage.innerHTML = `
        You completed the game in ${timeText} with ${totalMoves} moves.<br>
        Performance: ${'★'.repeat(stars)}${'☆'.repeat(3-stars)}
    `;
    
    // Add celebration animation to all cards
    cards.forEach(card => {
        card.classList.add('celebration');
    });
    
    // Show win modal with slight delay
    setTimeout(() => {
        winModal.classList.add('active');
    }, 1000);
}

// Event listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start the game when page loads
window.addEventListener('load', initGame);
