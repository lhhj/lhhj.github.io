// Get HTML elements
// Create score variables for each player
const gameBoard = document.getElementById('game-board');
const myAstronaut = document.getElementById('my-astronaut');
const otherAstronaut = document.getElementById('other-astronaut');
const connectButton = document.getElementById('connect-button');
const otherPeerIdInput = document.getElementById('other-peer-id');
const peerId = document.getElementById('my-peer-id');
// Create score variables for each player
let myScore = 0;
let otherScore = 0;

// Create HTML elements to display the scores
const myScoreElement = document.getElementById('my-score');
const otherScoreElement = document.getElementById('other-score');

// Update the display whenever a player's score changes
function updateScoreDisplay() {
  myScoreElement.innerText = myScore;
  otherScoreElement.innerText = otherScore;
}

// Increment a player's score every second they are connected
setInterval(function() {
  if (conn) {
    myScore++;
    updateScoreDisplay();
    conn.send({ type: 'score', value: myScore });
  }
}, 1000);   


// Create a new Peer without API key
const peer = new Peer();

// Function to move astronaut
const moveAstronaut = (element, top) => {
    element.style.top = `${top}px`;
};

// Function to handle mouse move
const handleMousemove = (event) => {
    const rect = gameBoard.getBoundingClientRect();
    let currentTop = event.clientY - rect.top;

    if(currentTop < 0) currentTop = 0;
    if(currentTop > 550) currentTop = 550; // 550 is the game-board height - astronaut height

    moveAstronaut(myAstronaut, currentTop);

    // If we have a connection, send the updated position
    if (conn) {
        conn.send(currentTop);
    }
};

// This will run when the Peer is open and ready to start connections
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    peerId.value = id;
});

let conn = null;

// Wait for a connection
peer.on('connection', function(connection) {
    conn = connection;

    // Update other astronaut's position when we receive data
    conn.on('data', function(data) {
        if (data.type === 'score') {
            otherScore = data.value;
            updateScoreDisplay();
          } 
        else {
            moveAstronaut(otherAstronaut, data)
        };
    });
});

// Make a connection when a button is clicked
connectButton.onclick = function() {
    const otherPeerId = otherPeerIdInput.value;
    conn = peer.connect(otherPeerId);

    // Update other astronaut's position when we receive data
    conn.on('data', function(data) {
        moveAstronaut(otherAstronaut, data);
    });
};

// Listen for mousemove event on the game board
gameBoard.addEventListener('mousemove', handleMousemove);