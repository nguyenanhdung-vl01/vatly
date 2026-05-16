// ============= Chuyển động thẳng đều =============
let motionState = {
    running: false,
    position: 0,
    time: 0,
    startTime: 0
};

function updateVelocityDisplay() {
    document.getElementById('velocityValue').textContent = document.getElementById('velocitySlider').value;
}

function startMotion() {
    motionState.running = true;
    motionState.startTime = Date.now();
    drawMotion();
}

function pauseMotion() {
    motionState.running = false;
}

function resetMotion() {
    motionState.running = false;
    motionState.position = 0;
    motionState.time = 0;
    document.getElementById('positionDisplay').textContent = '0';
    document.getElementById('timeDisplay').textContent = '0.0';
    drawMotion();
}

function drawMotion() {
    const canvas = document.getElementById('motionCanvas');
    const ctx = canvas.getContext('2d');
    const velocity = parseFloat(document.getElementById('velocitySlider').value);

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Update position if running
    if (motionState.running) {
        motionState.time = (Date.now() - motionState.startTime) / 1000;
        motionState.position = velocity * motionState.time;
        
        document.getElementById('positionDisplay').textContent = motionState.position.toFixed(2);
        document.getElementById('timeDisplay').textContent = motionState.time.toFixed(1);
    }

    // Draw object (square)
    const maxDistance = canvas.width - 50;
    const scale = maxDistance / 100; // Scale: 1 meter = scale pixels
    const objX = Math.min(50 + motionState.position * scale, canvas.width - 30);
    
    ctx.fillStyle = '#667eea';
    ctx.fillRect(objX, canvas.height - 50, 25, 25);
    
    // Draw path
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 37);
    ctx.lineTo(objX, canvas.height - 37);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw axis labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('0 m', 40, canvas.height - 5);
    ctx.fillText(`${(motionState.position).toFixed(1)} m`, objX - 10, canvas.height - 30);

    if (motionState.running) {
        requestAnimationFrame(drawMotion);
    }
}

// ============= Rơi tự do =============
let gravityState = {
    running: false,
    height: 300,
    time: 0,
    startTime: 0,
    initialHeight: 300,
    g: 10
};

function updateHeightDisplay() {
    const val = document.getElementById('heightSlider').value;
    document.getElementById('heightValue').textContent = val;
    gravityState.initialHeight = parseFloat(val);
    resetGravity();
}

function startGravity() {
    gravityState.running = true;
    gravityState.startTime = Date.now();
    gravityState.time = 0;
    drawGravity();
}

function resetGravity() {
    gravityState.running = false;
    gravityState.height = gravityState.initialHeight;
    gravityState.time = 0;
    document.getElementById('heightDisplay').textContent = gravityState.initialHeight;
    document.getElementById('gravityVelocityDisplay').textContent = '0';
    document.getElementById('fallTimeDisplay').textContent = '0.0';
    drawGravity();
}

function drawGravity() {
    const canvas = document.getElementById('gravityCanvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Draw building/reference
    ctx.fillStyle = '#999';
    ctx.fillRect(canvas.width - 40, canvas.height - 200, 30, 200);

    // Update height if running
    if (gravityState.running) {
        gravityState.time = (Date.now() - gravityState.startTime) / 1000;
        const h = gravityState.initialHeight - 0.5 * gravityState.g * gravityState.time * gravityState.time;
        
        if (h <= 0) {
            gravityState.height = 0;
            gravityState.running = false;
        } else {
            gravityState.height = h;
        }

        const velocity = gravityState.g * gravityState.time;
        document.getElementById('heightDisplay').textContent = gravityState.height.toFixed(2);
        document.getElementById('gravityVelocityDisplay').textContent = velocity.toFixed(2);
        document.getElementById('fallTimeDisplay').textContent = gravityState.time.toFixed(2);
    }

    // Calculate pixel position (scale: 1 meter = 1 pixel)
    const scale = (canvas.height - 100) / gravityState.initialHeight;
    const ballY = canvas.height - 50 - gravityState.height * scale;

    // Draw ball
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(100, ballY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw velocity vector
    if (gravityState.time > 0) {
        const velocity = gravityState.g * gravityState.time;
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(100, ballY);
        ctx.lineTo(100, ballY + Math.min(velocity * 5, 100));
        ctx.stroke();
        
        ctx.fillStyle = '#FF6B6B';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, 120, ballY + 30);
    }

    // Draw height scale on the left
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let h = 0; h <= gravityState.initialHeight; h += 50) {
        const y = canvas.height - 50 - h * scale;
        ctx.beginPath();
        ctx.moveTo(70, y);
        ctx.lineTo(85, y);
        ctx.stroke();
        
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${h}m`, 65, y + 4);
    }

    // Draw height indicator
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(85, ballY);
    ctx.lineTo(canvas.width - 60, ballY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (gravityState.running) {
        requestAnimationFrame(drawGravity);
    }
}

// ============= Sóng =============
let waveState = {
    running: false,
    time: 0,
    startTime: 0
};

function updateFrequencyDisplay() {
    document.getElementById('frequencyValue').textContent = document.getElementById('frequencySlider').value;
}

function updateAmplitudeDisplay() {
    document.getElementById('amplitudeValue').textContent = document.getElementById('amplitudeSlider').value;
}

function startWave() {
    waveState.running = true;
    waveState.startTime = Date.now();
    drawWave();
}

function stopWave() {
    waveState.running = false;
}

function drawWave() {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const frequency = parseFloat(document.getElementById('frequencySlider').value);
    const amplitude = parseFloat(document.getElementById('amplitudeSlider').value);

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height / 2);
        ctx.lineTo(i, canvas.height / 2 + 1);
        ctx.stroke();
    }

    // Calculate phase
    if (waveState.running) {
        waveState.time = (Date.now() - waveState.startTime) / 1000;
    }

    // Draw wave
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x < canvas.width; x += 2) {
        const phase = 2 * Math.PI * frequency * waveState.time;
        const y = canvas.height / 2 + amplitude * Math.sin((x / 50) * Math.PI / 2 - phase);
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Draw center line
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`f = ${frequency.toFixed(1)} Hz, A = ${amplitude} px`, 10, 20);
    ctx.fillText(`t = ${waveState.time.toFixed(2)} s`, 10, 40);

    if (waveState.running) {
        requestAnimationFrame(drawWave);
    }
}

// ============= Bảo toàn năng lượng =============
let energyState = {
    running: false,
    height: 250,
    time: 0,
    startTime: 0,
    initialHeight: 250,
    g: 10,
    m: 1
};

function updateInitialHeightDisplay() {
    const val = document.getElementById('initialHeightSlider').value;
    document.getElementById('initialHeightValue').textContent = val;
    energyState.initialHeight = parseFloat(val);
    resetEnergy();
}

function startEnergy() {
    energyState.running = true;
    energyState.startTime = Date.now();
    energyState.time = 0;
    drawEnergy();
}

function resetEnergy() {
    energyState.running = false;
    energyState.height = energyState.initialHeight;
    energyState.time = 0;
    
    const totalEnergy = energyState.m * energyState.g * energyState.initialHeight;
    document.getElementById('potentialEnergyDisplay').textContent = totalEnergy.toFixed(2);
    document.getElementById('kineticEnergyDisplay').textContent = '0.00';
    document.getElementById('totalEnergyDisplay').textContent = totalEnergy.toFixed(2);
    
    drawEnergy();
}

function drawEnergy() {
    const canvas = document.getElementById('energyCanvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Update height if running
    if (energyState.running) {
        energyState.time = (Date.now() - energyState.startTime) / 1000;
        const h = energyState.initialHeight - 0.5 * energyState.g * energyState.time * energyState.time;
        
        if (h <= 0) {
            energyState.height = 0;
            energyState.running = false;
        } else {
            energyState.height = h;
        }
    }

    // Calculate energies
    const PE = energyState.m * energyState.g * energyState.height;
    const velocity = energyState.g * energyState.time;
    const KE = 0.5 * energyState.m * velocity * velocity;
    const totalEnergy = PE + KE;

    document.getElementById('potentialEnergyDisplay').textContent = PE.toFixed(2);
    document.getElementById('kineticEnergyDisplay').textContent = KE.toFixed(2);
    document.getElementById('totalEnergyDisplay').textContent = totalEnergy.toFixed(2);

    // Scale
    const scale = (canvas.height - 100) / energyState.initialHeight;
    const ballY = canvas.height - 40 - energyState.height * scale;

    // Draw ball
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(100, ballY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw energy bar chart
    const barX = 300;
    const barWidth = 150;
    const maxHeight = 200;
    const initialTotalEnergy = energyState.m * energyState.g * energyState.initialHeight;
    
    // PE bar
    const peHeight = (PE / initialTotalEnergy) * maxHeight;
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(barX, canvas.height - 60 - peHeight, barWidth / 2 - 10, peHeight);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, canvas.height - 60 - peHeight, barWidth / 2 - 10, peHeight);
    
    // KE bar
    const keHeight = (KE / initialTotalEnergy) * maxHeight;
    ctx.fillStyle = '#51CF66';
    ctx.fillRect(barX + barWidth / 2, canvas.height - 60 - keHeight, barWidth / 2 - 10, keHeight);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX + barWidth / 2, canvas.height - 60 - keHeight, barWidth / 2 - 10, keHeight);

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PE', barX + (barWidth / 2 - 10) / 2, canvas.height - 30);
    ctx.fillText('KE', barX + barWidth / 2 + (barWidth / 2 - 10) / 2, canvas.height - 30);
    ctx.font = '12px Arial';
    ctx.fillText(`${PE.toFixed(1)} J`, barX + (barWidth / 2 - 10) / 2, canvas.height - 15);
    ctx.fillText(`${KE.toFixed(1)} J`, barX + barWidth / 2 + (barWidth / 2 - 10) / 2, canvas.height - 15);

    // Total energy line
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(barX - 10, canvas.height - 60);
    ctx.lineTo(barX + barWidth + 10, canvas.height - 60);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#764ba2';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`E = ${totalEnergy.toFixed(1)} J (hằng số)`, barX + barWidth + 20, canvas.height - 55);

    if (energyState.running) {
        requestAnimationFrame(drawEnergy);
    }
}

// ============= Tab switching =============
function showExperiment(expId) {
    // Hide all experiments
    const experiments = document.querySelectorAll('.experiment');
    experiments.forEach(exp => {
        exp.classList.remove('active');
    });

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected experiment
    document.getElementById(expId).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Draw the canvas for the active experiment
    if (expId === 'motion') {
        drawMotion();
    } else if (expId === 'gravity') {
        drawGravity();
    } else if (expId === 'wave') {
        drawWave();
    } else if (expId === 'energy') {
        drawEnergy();
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    drawMotion();
    drawGravity();
    drawWave();
    drawEnergy();
});
