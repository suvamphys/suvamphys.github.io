// script.js

const canvas = document.getElementById('brownian-canvas');
const ctx = canvas.getContext('2d');

// --- NEW: Walker Parameters ---
const numWalkers = 5; // Exactly 5 particles
const stepSize = 1;  // Small random jitter
const attractionStrength = 0.05; // How strongly they pull towards the mouse
const maxAttractionSpeed = 3;   // Cap the speed of attraction

let walkers = []; // Array to hold all walker objects

// This object will store the mouse's current position
let mouse = {
    x: null,
    y: null
};

// --- Event listener to update mouse position ---
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// --- Event listener for when mouse leaves window ---
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// --- Setup function for all walkers ---
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    walkers = []; // Clear previous walkers
    for (let i = 0; i < numWalkers; i++) {
        walkers.push({
            x: Math.random() * canvas.width,  // Random initial X position
            y: Math.random() * canvas.height, // Random initial Y position
            hue: Math.random() * 360          // Random start color
        });
    }
    
    // Clear the canvas with a solid fill
    ctx.fillStyle = 'rgba(40, 26, 12, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function draw() {
    
    // 1. Fading Effect (Runs ONCE per frame for the whole canvas)
    ctx.fillStyle = 'rgba(40, 26, 12, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Loop through every walker and update it
    walkers.forEach(walker => {
        // a. Calculate the random (Brownian) step
        const dx_rand = (Math.random() - 0.5) * 2 * stepSize;
        const dy_rand = (Math.random() - 0.5) * 2 * stepSize;

        // b. Calculate Mouse Attraction Step
        let dx_attraction = 0;
        let dy_attraction = 0;

        if (mouse.x !== null) {
            // Get the vector from the particle to the mouse
            const vecX = mouse.x - walker.x;
            const vecY = mouse.y - walker.y;
            
            // Calculate the distance
            const dist = Math.sqrt(vecX * vecX + vecY * vecY);

            if (dist > 1) { // Avoid division by zero if exactly on mouse
                // Normalize the vector (get direction)
                const normX = vecX / dist;
                const normY = vecY / dist;
                
                // Apply attraction force, capping its speed
                const currentAttractionSpeed = Math.min(dist * attractionStrength, maxAttractionSpeed);
                dx_attraction = normX * currentAttractionSpeed;
                dy_attraction = normY * currentAttractionSpeed;
            }
        }
        
        // c. Combine both steps and find the new position
        const newX = walker.x + dx_rand + dx_attraction;
        const newY = walker.y + dy_rand + dy_attraction;

        // d. Draw the single step segment
        ctx.beginPath();
        ctx.moveTo(walker.x, walker.y);
        ctx.lineTo(newX, newY);
        ctx.strokeStyle = `hsla(${walker.hue}, 100%, 75%, 0.4)`; 
        ctx.lineWidth = 1;
        ctx.stroke();

        // e. Update the walker's position
        walker.x = newX;
        walker.y = newY;
        walker.hue = (walker.hue + 0.1) % 360;

        // f. Handle Edges: If walker goes off-screen, bounce it back
        //    (Instead of resetting to center, which would look odd with attraction)
        if (walker.x < 0 || walker.x > canvas.width) {
            walker.x = Math.max(0, Math.min(canvas.width, walker.x)); // Clamp it to edge
            // You could also reverse direction for a bounce effect, but clamping is simpler here.
        }
        if (walker.y < 0 || walker.y > canvas.height) {
            walker.y = Math.max(0, Math.min(canvas.height, walker.y));
        }
    });

    // 3. Request the next animation frame
    requestAnimationFrame(draw);
}

// --- Event Listeners and Startup ---
window.addEventListener('resize', setupCanvas);

setupCanvas(); // Call setup once at the start
draw();        // Start the animation
