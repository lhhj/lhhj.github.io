// Get HTML elements
const gameBoard = document.getElementById('game-board');
const myAstronaut = document.getElementById('my-astronaut');
const connectButton = document.getElementById('connect-button');
const otherPeerIdInput = document.getElementById('other-peer-id');
const peerId = document.getElementById('my-peer-id');

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

    // If we have any connections, send the updated position to all peers
    connections.forEach(conn => conn.send(currentTop));
};

// This will run when the Peer is open and ready to start connections
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    peerId.value = id;
});

let connections = [];

// Wait for a connection
peer.on('connection', function(connection) {
    // Create a new astronaut for this connection
    const astronaut = document.createElement('div');
    astronaut.classList.add('astronaut');
    astronaut.style.background = 'red';
    astronaut.style.top = '0px';
    gameBoard.appendChild(astronaut);

    // Store the connection and associated astronaut
    connections.push({
        conn: connection,
        astronaut: astronaut
    });

    // Update astronaut's position when we receive data
    connection.on('data', function(data) {
        moveAstronaut(astronaut, data);
    });
});

// Make a connection when a button is clicked
connectButton.onclick = function() {
    const otherPeerId = otherPeerIdInput.value;
    const conn = peer.connect(otherPeerId);

    // Create a new astronaut for this connection
    const astronaut = document.createElement('div');
    astronaut.classList.add('astronaut');
    astronaut.style.background = 'red';
    astronaut.style.top = '0px';
    gameBoard.appendChild(astronaut);

    // Store the connection and associated astronaut
    connections.push({
        conn: conn,
        astronaut: astronaut
    });

    // Update astronaut's position when we receive data
    conn.on('data', function(data) {
        moveAstronaut(astronaut, data);
    });
};

// Listen for mousemove event on the game board
gameBoard.addEventListener('mousemove', handleMousemove);
