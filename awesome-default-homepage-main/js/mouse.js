document.addEventListener("DOMContentLoaded", () => {
    const smallCursor = document.querySelector(".smallCursor");
    const bigCursor = document.querySelector(".bigCursor");
    const canvas = document.getElementById("trailCanvas");
    const ctx = canvas.getContext("2d");

    let mouseX = -100, mouseY = -100;
    let currentX_big = 0, currentY_big = 0;

    const clickSound = new Audio('mouse-click-sound.mp3');

    // Trail settings
    let points = [];
    const TRAIL_LENGTH = 15; 

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        smallCursor.style.opacity = "1";
        bigCursor.style.opacity = "1";
        
        // Accurate trail points
        points.push({ x: mouseX, y: mouseY });
        if (points.length > TRAIL_LENGTH) points.shift();
    });

    document.addEventListener("mousedown", () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
        bigCursor.style.transform += " scale(0.85)";
    });

    document.addEventListener("mouseup", () => {
        bigCursor.style.transform = bigCursor.style.transform.replace(" scale(0.85)", "");
    });

    function draw() {
        // 1. SMALL DOT: Absolute 1:1 (Zero Lag)
        smallCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        // 2. BIG ROUND CIRCLE: Faster follow (High responsiveness)
        // Changed from 0.18 to 0.45 for "Exact" feel
        currentX_big += (mouseX - currentX_big) * 0.45; 
        currentY_big += (mouseY - currentY_big) * 0.45;
        bigCursor.style.transform = `translate3d(${currentX_big}px, ${currentY_big}px, 0) translate(-50%, -50%)`;

        // 3. THIN LASER TRAIL: Canvas Drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (points.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 255, 136, 0.4)";
            ctx.lineWidth = 1; // Very thin layer
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }

        requestAnimationFrame(draw);
    }
    draw();

    // Hover Interaction
    const handleHover = () => {
        const triggers = document.querySelectorAll('a, button, input');
        triggers.forEach(trig => {
            trig.addEventListener('mouseenter', () => bigCursor.classList.add('cursor-hover'));
            trig.addEventListener('mouseleave', () => bigCursor.classList.remove('cursor-hover'));
        });
    };
    handleHover();
});