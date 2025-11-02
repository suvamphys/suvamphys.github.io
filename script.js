// script.js

const canvas = document.getElementById('brownian-canvas');
const ctx = canvas.getContext('2d');

// --- Walker Parameters ---
const numWalkers = 75; // <-- Set how many walkers you want
const stepSize = 3;   // <-- You might want a slightly smaller step
let walkers = [];     // Array to hold all walker objects

// --- NEW: Function to create or reset all walkers ---
function setupWalkers() {
    walkers = []; // Clear the old array
    for (let i = 0; i < numWalkers; i++) {
        walkers.push({
            x: canvas.width / 2,  // Start all in the center
            y: canvas.height / 2,
            hue: Math.random() * 360 // Give each a random start color
        });
    }
}

// --- MODIFIED: The main animation loop ---
function draw() {
    
    // 1. Fading Effect (Runs ONCE per frame)
    // This fades the *entire* canvas
    ctx.fillStyle = 'rgba(40, 26, 12, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Loop through every walker and update it
    walkers.forEach(walker => {
        // a. Calculate the new random step
        const dx = (Math.random() - 0.5) * 2 * stepSize;
        const dy = (Math.random() - 0.5) * 2 * stepSize;
        
        const newX = walker.x + dx;
        const newY = walker.y + dy;

        // b. Draw the single step segment
        ctx.beginPath();
        ctx.moveTo(walker.x, walker.y);
        ctx.lineTo(newX, newY);
        // Use the walker's specific hue
        ctx.strokeStyle = `hsla(${walker.hue}, 100%, 75%, 0.4)`; 
        ctx.lineWidth = 1;
        ctx.stroke();

        // c. Update the walker's position
        walker.x = newX;
        walker.y = newY;
        walker.hue = (walker.hue + 0.1) % 360; // Slowly cycle its color

        // d. Handle Edges: If walker goes off-screen, reset to center
        if (walker.x < 0 || walker.x > canvas.width || walker.y < 0 || walker.y > canvas.height) {
            walker.x = canvas.width / 2;
            walker.y = canvas.height / 2;
        }
    });


    // 3. Request the next animation frame
    requestAnimationFrame(draw);
}

// --- MODIFIED: Handle window resizing ---
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset all walkers to the new center
    setupWalkers(); 
    
    // Clear the old trajectory with a solid fill
    ctx.fillStyle = 'rgba(40, 26, 12, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// --- Initial Setup ---
setupWalkers(); // Create the walkers
draw();         // Start the animation
