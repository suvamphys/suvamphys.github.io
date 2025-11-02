// script.js

const canvas = document.getElementById('brownian-canvas');
const ctx = canvas.getContext('2d');

// --- Walker Parameters ---
let x, y, hue; // We will set these in setupCanvas
const stepSize = 4;

// --- NEW: Mouse Interaction Parameters ---
const repulsionRadius = 150; // How close the mouse must be to affect the particle
const repulsionStrength = 10; // How strongly the particle is pushed away

// This object will store the mouse's current position
let mouse = {
    x: null,
    y: null
};

// --- NEW: Event listener to update mouse position ---
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// --- NEW: Event listener for when mouse leaves window ---
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// --- Setup function for one walker ---
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Start the walker in the center
    x = canvas.width / 2;
    y = canvas.height / 2;
    hue = Math.random() * 360;
    
    // Clear the canvas with a solid fill
    ctx.fillStyle = 'rgba(40, 26, 12, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function draw() {
    
    // 1. Fading Effect
    ctx.fillStyle = 'rgba(40, 26, 12, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Calculate the random (Brownian) step
    const dx_rand = (Math.random() - 0.5) * 2 * stepSize;
    const dy_rand = (Math.random() - 0.5) * 2 * stepSize;

    // --- NEW: Calculate Mouse Repulsion Step ---
    let dx_mouse = 0;
    let dy_mouse = 0;

    if (mouse.x !== null) {
        // Get the vector from the mouse to the particle
        const vecX = x - mouse.x;
        const vecY = y - mouse.y;
        
        // Calculate the distance
        const dist = Math.sqrt(vecX * vecX + vecY * vecY);

        // If the mouse is within the repulsion radius...
        if (dist < repulsionRadius) {
            // Calculate the normalized direction vector
            const normX = vecX / dist;
            const normY = vecY / dist;
            
            // Calculate a force that's strongest at the center
            const force = (1 - dist / repulsionRadius) * repulsionStrength;
            
            // Apply the force to our mouse-step
            dx_mouse = normX * force;
            dy_mouse = normY * force;
        }
    }
    
    // 3. Combine both steps and find the new position
    const newX = x + dx_rand + dx_mouse;
    const newY = y + dy_rand + dy_mouse;

    // 4. Draw the single step segment
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = `hsla(${hue}, 100%, 75%, 0.4)`; 
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5. Update the walker's position
    x = newX;
    y = newY;
    hue = (hue + 0.1) % 360;

    // 6. Handle Edges: Reset to center
    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        x = canvas.width / 2;
        y = canvas.height / 2;
    }

    // 7. Request the next animation frame
    requestAnimationFrame(draw);
}

// --- Event Listeners and Startup ---
window.addEventListener('resize', setupCanvas);

setupCanvas(); // Call setup once at the start
draw();        // Start the animation
