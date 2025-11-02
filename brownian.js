// brownian.js

// Make sure to wrap ALL code in a function to avoid conflicts
(function() {
    const canvas = document.getElementById('brownian-canvas');
    if (!canvas) return; // Stop if canvas isn't on the page
    const ctx = canvas.getContext('2d');

    // --- Walker Parameters ---
    const numWalkers = 5;
    const stepSize = 4; // Back to being noisy
    const attractionStrength = 0.05;
    const maxAttractionSpeed = 3;
    let walkers = [];

    let mouse = {
        x: null,
        y: null
    };

    // --- Mouse listener (MODIFIED) ---
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // --- Setup function (MODIFIED) ---
    function setupCanvas() {
        // Set size from CSS-defined size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
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

    // --- Draw function (MODIFIED) ---
    function draw() {
        // 1. Fading Effect
        ctx.fillStyle = 'rgba(40, 26, 12, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Loop walkers
        walkers.forEach(walker => {
            // a. Random step
            const dx_rand = (Math.random() - 0.5) * 2 * stepSize;
            const dy_rand = (Math.random() - 0.5) * 2 * stepSize;

            // b. Mouse Attraction
            let dx_attraction = 0;
            let dy_attraction = 0;
            if (mouse.x !== null) {
                // Check if mouse is inside this canvas
                if (mouse.x > 0 && mouse.x < canvas.width && mouse.y > 0 && mouse.y < canvas.height) {
                    const vecX = mouse.x - walker.x;
                    const vecY = mouse.y - walker.y;
                    const dist = Math.sqrt(vecX * vecX + vecY * vecY);
                    if (dist > 1) {
                        const normX = vecX / dist;
                        const normY = vecY / dist;
                        const speed = Math.min(dist * attractionStrength, maxAttractionSpeed);
                        dx_attraction = normX * speed;
                        dy_attraction = normY * speed;
                    }
                }
            }
            
            // c. Combine steps
            const newX = walker.x + dx_rand + dx_attraction;
            const newY = walker.y + dy_rand + dy_attraction;

            // d. Draw trajectory
            ctx.beginPath();
            ctx.moveTo(walker.x, walker.y);
            ctx.lineTo(newX, newY);
            ctx.strokeStyle = `hsla(${walker.hue}, 100%, 75%, 0.2)`; 
            ctx.lineWidth = 2;
            ctx.stroke();

            // e. Draw particle
            ctx.beginPath();
            ctx.arc(newX, newY, 3, 0, Math.PI * 2); 
            ctx.fillStyle = `hsla(${walker.hue}, 100%, 75%, 0.9)`; 
            ctx.fill();

            // f. Update position & handle edges
            walker.x = newX;
            walker.y = newY;
            walker.hue = (walker.hue + 0.1) % 360;
            if (walker.x < 0 || walker.x > canvas.width) walker.x = Math.max(0, Math.min(canvas.width, walker.x));
            if (walker.y < 0 || walker.y > canvas.height) walker.y = Math.max(0, Math.min(canvas.height, walker.y));
        });

        // 3. Loop
        requestAnimationFrame(draw);
    }

    // --- Startup ---
    window.addEventListener('resize', setupCanvas);
    setupCanvas();
    draw();

})(); // Immediately-invoked function expression (IIFE)
