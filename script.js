// script.js

const canvas = document.getElementById('brownian-canvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- Walker Parameters ---
let x = canvas.width / 2;
let y = canvas.height / 2;
const stepSize = 4;
let hue = Math.random() * 360; // Start with a random color

function draw() {
    
    // 1. Fading Effect
    ctx.fillStyle = 'rgba(40, 26, 12, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Calculate the new random step
    const dx = (Math.random() - 0.5) * 2 * stepSize;
    const dy = (Math.random() - 0.5) * 2 * stepSize;
    
    const newX = x + dx;
    const newY = y + dy;

    // 3. Draw the single step segment
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = `hsla(${hue}, 100%, 75%, 0.4)`; 
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Update the walker's position
    x = newX;
    y = newY;
    hue = (hue + 0.1) % 360;

    // 5. Handle Edges: If walker goes off-screen, reset to center
    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        x = canvas.width / 2;
        y = canvas.height / 2;
    }

    // 6. Request the next animation frame
    requestAnimationFrame(draw);
}

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reset walker to the new center
    x = canvas.width / 2;
    y = canvas.height / 2;
    
    // Clear the old trajectory with a solid fill
    ctx.fillStyle = 'rgba(40, 26, 12, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Start the animation
draw();
