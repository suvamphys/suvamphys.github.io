// kuramoto.js

(function() {
    const canvas = document.getElementById('kuramoto-canvas');
    if (!canvas) return; // Stop if canvas isn't on the page
    const ctx = canvas.getContext('2d');

    // --- Simulation Parameters ---
    const N = 80; // Number of oscillators
    const K = 2.0; // Coupling strength
    const NAT_FREQ_STD_DEV = 0.5; // Spread of natural frequencies
    const TIME_STEP = 0.02;
    const REPULSION_RADIUS = 100;
    const REPULSION_STRENGTH = 0.5;
    
    let oscillators = [];
    let centerX, centerY, radius;

    let mouse = {
        x: null,
        y: null
    };

    // --- Helper: Gaussian random (for natural frequencies) ---
    function gaussianRandom(mean = 0, stdev = 1) {
        let u = 1 - Math.random(); // Converting [0,1) to (0,1]
        let v = Math.random();
        let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    }

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

    // --- Setup function ---
    function setupKuramoto() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        radius = Math.min(centerX, centerY) * 0.8;
        
        oscillators = [];
        for (let i = 0; i < N; i++) {
            oscillators.push({
                phase: Math.random() * 2 * Math.PI, // Random initial phase
                freq: gaussianRandom(0, NAT_FREQ_STD_DEV) // Natural frequency
            });
        }
    }

    // --- Draw/Update function ---
    function drawKuramoto() {
        // 1. Fading Effect
        ctx.fillStyle = 'rgba(40, 26, 12, 0.1)'; // Slower fade
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw the unit circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        let mouseActive = (mouse.x !== null && mouse.x > 0 && mouse.x < canvas.width && mouse.y > 0 && mouse.y < canvas.height);

        // 3. Update and Draw Oscillators
        oscillators.forEach((osc, i) => {
            
            // --- A: Calculate derivative (Kuramoto equation) ---
            let d_phase = osc.freq;
            let sum_sines = 0;
            for (let j = 0; j < N; j++) {
                sum_sines += Math.sin(oscillators[j].phase - osc.phase);
            }
            d_phase += (K / N) * sum_sines;

            // --- B: Calculate Mouse Repulsion ---
            // Get oscillator's x,y position
            let oscX = centerX + radius * Math.cos(osc.phase);
            let oscY = centerY + radius * Math.sin(osc.phase);
            
            if (mouseActive) {
                const vecX = oscX - mouse.x;
                const vecY = oscY - mouse.y;
                const dist = Math.sqrt(vecX * vecX + vecY * vecY);

                if (dist < REPULSION_RADIUS && dist > 1) {
                    // Repulsion force vector (from mouse to particle)
                    const forceX = vecX / dist;
                    const forceY = vecY / dist;
                    
                    // Tangent vector at the oscillator's position
                    const tangentX = -Math.sin(osc.phase);
                    const tangentY = Math.cos(osc.phase);
                    
                    // Project the repulsion force onto the tangent
                    const tangent_force_mag = (forceX * tangentX + forceY * tangentY);
                    
                    // Add this force to the phase derivative
                    const strength = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
                    d_phase += tangent_force_mag * strength;
                }
            }

            // --- C: Update phase (Euler integration) ---
            osc.phase += d_phase * TIME_STEP;
            osc.phase %= (2 * Math.PI); // Keep it 0-2PI

            // --- D: Draw the oscillator ---
            // Recalculate x,y in case phase changed
            let drawX = centerX + radius * Math.cos(osc.phase);
            let drawY = centerY + radius * Math.sin(osc.phase);
            
            ctx.beginPath();
            ctx.arc(drawX, drawY, 4, 0, 2 * Math.PI);
            // Color based on phase
            let hue = (osc.phase / (2 * Math.PI)) * 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 75%, 0.9)`;
            ctx.fill();
        });

        // 4. Loop
        requestAnimationFrame(drawKuramoto);
    }

    // --- Startup ---
    window.addEventListener('resize', setupKuramoto);
    setupKuramoto();
    drawKuramoto();

})(); // IIFE
