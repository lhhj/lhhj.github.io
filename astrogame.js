// Get HTML elements
// Create score variables for each player
const gameBoard = document.getElementById('game-board');
const myAstronaut = document.getElementById('my-astronaut');
const otherAstronaut = document.getElementById('other-astronaut');
const connectButton = document.getElementById('connect-button');
const otherPeerIdInput = document.getElementById('other-peer-id');
const peerId = document.getElementById('my-peer-id');
//spawn points for astronauts
const spawnTop = gameBoard.offsetHeight - myAstronaut.offsetHeight; // Bottom of the game area
const spawnLeft = (gameBoard.offsetWidth / 2) - (myAstronaut.offsetWidth / 2); // Center of the game area

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

  


// Create a new Peer without API key
const peer = new Peer();

// Function to move astronaut
const moveAstronaut = (element, top, left) => {
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  };  

// Function to handle mouse move
const handleMousemove = (event) => {
    const rect = gameBoard.getBoundingClientRect();
    
    let currentTop = event.clientY - rect.top;
    if(currentTop < 0) currentTop = 0;
    if(currentTop > 550) currentTop = 550; // 550 is the game-board height - astronaut height
  
    let currentLeft = event.clientX - rect.left;
    if(currentLeft < 0) currentLeft = 0;
    if(currentLeft > rect.width) currentLeft = rect.width; // game-board width
  
    moveAstronaut(myAstronaut, currentTop, currentLeft);
  
    // If we have a connection, send the updated position
    if (conn) {
      conn.send({top: currentTop, left: currentLeft});
    }
  };
  

// This will run when the Peer is open and ready to start connections
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    peerId.value = id;
});

let conn = null;
moveAstronaut(otherAstronaut, spawnTop, spawnLeft);

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
            moveAstronaut(otherAstronaut, data.top, data.left);
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

// existing code...

// get HTML elements for targets and bullets
const targetsDiv = document.getElementById('targets');
const bulletsDiv = document.getElementById('bullets');

// array to hold current targets and bullets
let targets = [];
let bullets = [];

// function to create a new target
// function to create a new target
function createTarget() {
    const target = document.createElement('div');
    target.className = 'target';
    target.style.left = '0px';
    target.style.top = '0px'; // spawn at the top of the canvas
    targetsDiv.appendChild(target);
    targets.push(target);
  }
// function to create a new bullet
function shootBullet() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.left = myAstronaut.style.left;
  bullet.style.top = myAstronaut.style.top;
  bulletsDiv.appendChild(bullet);
  bullets.push(bullet);
}

// function to move targets and bullets and check for collisions
function animate() {
  targets.forEach(target => {
    const left = parseInt(target.style.left);
    if (left < gameBoard.offsetWidth) {
      target.style.left = (left + 1) + 'px';
    } else {
      targetsDiv.removeChild(target);
      targets = targets.filter(t => t !== target);
    }
  });

  bullets.forEach(bullet => {
    const top = parseInt(bullet.style.top);
    if (top > 0) {
      bullet.style.top = (top - 1) + 'px';
    } else {
      bulletsDiv.removeChild(bullet);
      bullets = bullets.filter(b => b !== bullet);
    }

    targets.forEach(target => {
      const targetRect = target.getBoundingClientRect();
      const bulletRect = bullet.getBoundingClientRect();
      if (bulletRect.left < targetRect.right &&
          bulletRect.right > targetRect.left &&
          bulletRect.top < targetRect.bottom &&
          bulletRect.bottom > targetRect.top) {
        // collision detected!
        targetsDiv.removeChild(target);
        bulletsDiv.removeChild(bullet);
        targets = targets.filter(t => t !== target);
        bullets = bullets.filter(b => b !== bullet);
        // increment score...
        myScore++;
        updateScoreDisplay();
        if (conn) {
            conn.send({ type: 'score', value: myScore });
        }
      }
    });
  });

  requestAnimationFrame(animate);
}

// create a new target every 2 seconds
setInterval(createTarget, 2000);

// listen for spacebar or mouse click to shoot
window.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    shootBullet();
  }
});
gameBoard.addEventListener('click', shootBullet);

// start the animation
animate();
