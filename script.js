// script.js

const canvas = document.getElementById('brownian-canvas');
const ctx = canvas.getContext('2d');

// --- Walker Parameters ---
const numWalkers = 5; 
const stepSize = 1;  
const attractionStrength = 0.05; 
const maxAttractionSpeed = 3;   

let walkers = []; 

let mouse = {
    x: null,
    y: null
};

// --- Event listeners (no change) ---
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// --- Setup function (no change) ---
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    walkers = []; 
    for (let i = 0; i < numWalkers; i++) {
        walkers.push({
            x: Math.random() * canvas.width,  
            y: Math.random() * canvas.height, 
            hue: Math.random() * 360          
        });
    }
    
    ctx.fillStyle = 'rgba(40, 26, 12, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function draw() {
    
    // 1. Fading Effect
    ctx.fillStyle = 'rgba(40, 26, 12, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Loop through every walker and update it
    walkers.forEach(walker => {
        // a. Calculate random step
        const dx_rand = (Math.random() - 0.5) * 2 * stepSize;
        const dy_rand = (Math.random() - 0.5) * 2 * stepSize;

        // b. Calculate Mouse Attraction
        let dx_attraction = 0;
        let dy_attraction = 0;

        if (mouse.x !== null) {
            const vecX = mouse.x - walker.x;
            const vecY = mouse.y - walker.y;
            const dist = Math.sqrt(vecX * vecX + vecY * vecY);

            if (dist > 1) { 
                const normX = vecX / dist;
                const normY = vecY / dist;
                const currentAttractionSpeed = Math.min(dist * attractionStrength, maxAttractionSpeed);
                dx_attraction = normX * currentAttractionSpeed;
                dy_attraction = normY * currentAttractionSpeed;
            }
        }
        
        // c. Combine steps and find new position
        const newX = walker.x + dx_rand + dx_attraction;
        const newY = walker.y + dy_rand + dy_attraction;

        // d. Draw the trajectory line
        ctx.beginPath();
        ctx.moveTo(walker.x, walker.y);
        ctx.lineTo(newX, newY);
        // --- MODIFIED ---
        // Fainter, thicker line for the trajectory tail
        ctx.strokeStyle = `hsla(${walker.hue}, 100%, 75%, 0.2)`; 
        ctx.lineWidth = 2; // Was 1
        // --- END MODIFIED ---
        ctx.stroke();

        // --- NEW ---
        // Draw the "particle" itself as a solid circle
        ctx.beginPath();
        // The '3' is the radius, making a 6px wide circle
        ctx.arc(newX, newY, 3, 0, Math.PI * 2); 
        // Use a high-opacity fill to make it look solid
        ctx.fillStyle = `hsla(${walker.hue}, 100%, 75%, 0.9)`; 
        ctx.fill();
        // --- END NEW ---

        // e. Update the walker's position
        walker.x = newX;
        walker.y = newY;
        walker.hue = (walker.hue + 0.1) % 360;

        // f. Handle Edges
        if (walker.x < 0 || walker.x > canvas.width) {
            walker.x = Math.max(0, Math.min(canvas.width, walker.x));
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
setupCanvas(); 
draw();
