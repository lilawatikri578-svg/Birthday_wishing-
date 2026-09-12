/* =========================================
   ELEMENTS
========================================= */

const fireworksCanvas =
    document.getElementById("fireworks");

const ctx =
    fireworksCanvas.getContext("2d");

const countdownScreen =
    document.getElementById("countdownScreen");

const birthdayScreen =
    document.getElementById("birthdayScreen");

const memoryScreen =
    document.getElementById("memoryScreen");

const letterScreen =
    document.getElementById("letterScreen");

const finalScreen =
    document.getElementById("finalScreen");

const countdownNumber =
    document.getElementById("countdownNumber");

const countdownText =
    document.getElementById("countdownText");

const music =
    document.getElementById("birthdayMusic");

const musicBtn =
    document.getElementById("musicBtn");


/* =========================================
   CANVAS SIZE
========================================= */

function resizeCanvas() {

    fireworksCanvas.width =
        window.innerWidth;

    fireworksCanvas.height =
        window.innerHeight;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================
   FIREWORKS
   ONLY ACTIVE DURING COUNTDOWN
========================================= */

let fireworksRunning = true;

let rockets = [];

let particles = [];


class Rocket {

    constructor() {

        this.x =
            Math.random() *
            fireworksCanvas.width;

        this.y =
            fireworksCanvas.height + 20;

        this.targetY =
            fireworksCanvas.height *
            (0.18 + Math.random() * 0.32);

        this.speed =
            8 + Math.random() * 3;

        this.dead = false;

        this.trail = [];
    }


    update() {

        this.trail.push({
            x: this.x,
            y: this.y
        });

        if (this.trail.length > 8) {
            this.trail.shift();
        }

        this.y -= this.speed;

        if (this.y <= this.targetY) {

            explode(
                this.x,
                this.y
            );

            this.dead = true;
        }
    }


    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            2.2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffffff";

        ctx.fill();

        ctx.beginPath();

        for (
            let i = 0;
            i < this.trail.length;
            i++
        ) {

            const p =
                this.trail[i];

            ctx.lineTo(
                p.x,
                p.y
            );
        }

        ctx.strokeStyle =
            "rgba(255,255,255,0.4)";

        ctx.stroke();
    }
}


class Particle {

    constructor(x, y, color) {

        this.x = x;
        this.y = y;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            Math.random() *
            5 + 2;

        this.vx =
            Math.cos(angle) * speed;

        this.vy =
            Math.sin(angle) * speed;

        this.life =
            1;

        this.decay =
            0.018 + Math.random() * 0.018;

        this.color = color;

        this.size =
            Math.random() * 2 + 1;
    }


    update() {

        this.x += this.vx;

        this.y += this.vy;

        this.vy += 0.045;

        this.vx *= 0.99;

        this.life -= this.decay;
    }


    draw() {

        ctx.globalAlpha =
            Math.max(this.life, 0);

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            this.color;

        ctx.fill();

        ctx.globalAlpha = 1;
    }
}


/* =========================================
   EXPLOSION
========================================= */

function explode(x, y) {

    const colors = [
        "#ff6fb5",
        "#ffd166",
        "#8be9fd",
        "#c77dff",
        "#ffffff"
    ];

    const color =
        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];

    const amount =
        45;

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        particles.push(
            new Particle(
                x,
                y,
                color
            )
        );
    }
}


/* =========================================
   LAUNCH ROCKET
========================================= */

function launchRocket() {

    if (!fireworksRunning) return;

    rockets.push(
        new Rocket()
    );
}


/* =========================================
   FIREWORK ANIMATION
========================================= */

function animateFireworks() {

    ctx.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );

    if (fireworksRunning) {

        for (
            let i = rockets.length - 1;
            i >= 0;
            i--
        ) {

            rockets[i].update();
            rockets[i].draw();

            if (rockets[i].dead) {

                rockets.splice(i, 1);
            }
        }

        for (
            let i = particles.length - 1;
            i >= 0;
            i--
        ) {

            particles[i].update();
            particles[i].draw();

            if (particles[i].life <= 0) {

                particles.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(
        animateFireworks
    );
}

animateFireworks();


/* =========================================
   FIREWORK TIMING
========================================= */

const rocketTimer =
    setInterval(() => {

        if (!fireworksRunning) {

            clearInterval(rocketTimer);

            return;
        }

        launchRocket();

    }, 650);


/* =========================================
   STOP FIREWORKS COMPLETELY
========================================= */

function stopFireworks() {

    fireworksRunning = false;

    rockets = [];

    particles = [];

    ctx.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );
}


/* =========================================
   SCREEN CHANGE
========================================= */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(s => {

            s.classList.remove("active");

        });

    screen.classList.add("active");
}


/* =========================================
   COUNTDOWN
========================================= */

let count = 3;

function runCountdown() {

    countdownNumber.textContent =
        count;

    countdownNumber.style.animation =
        "none";

    void countdownNumber.offsetWidth;

    countdownNumber.style.animation =
        "countdownPop 1s ease";

    if (count === 3) {

        countdownText.textContent =
            "Get Ready ❤️";

    } else if (count === 2) {

        countdownText.textContent =
            "Something beautiful is coming...";

    } else {

        countdownText.textContent =
            "For You, Saru ✨";

    }

    count--;

    if (count < 0) {

        /* VERY IMPORTANT:
           FIREWORKS STOP HERE */

        stopFireworks();

        showScreen(
            birthdayScreen
        );

        return;
    }

    setTimeout(
        runCountdown,
        1000
    );
}


/* START */

runCountdown();


/* =========================================
   MUSIC
========================================= */

let musicPlaying = false;


function startMusic() {

    music.volume = 0.45;

    music.play()
        .then(() => {

            musicPlaying = true;

            musicBtn.textContent =
                "🎵 Music ON";

        })
        .catch(() => {

            musicPlaying = false;

        });
}


musicBtn.addEventListener(
    "click",
    () => {

        if (!musicPlaying) {

            startMusic();

        } else {

            music.pause();

            musicPlaying = false;

            musicBtn.textContent =
                "🎵 Music";
        }
    }
);


/* =========================================
   FIRST USER TAP
========================================= */

document.addEventListener(
    "click",
    () => {

        if (!musicPlaying) {

            startMusic();

        }

    },
    {
        once: true
    }
);




/* =========================================
   BIRTHDAY → MEMORY
========================================= */

document
    .getElementById("birthdayNext")
    .addEventListener("click", () => {

        showScreen(memoryScreen);

    });


/* =========================================
   MEMORY VIDEO SLIDESHOW
========================================= */

// Videos
const memoryVideos = [
    "./v1.mp4",
    "./v2.mp4",
    "./v3.mp4"
];

// Captions
const videoCaptions = [
    "A beautiful memory ✨",
    "One more moment to remember 💕",
    "Some memories are simply special ❤️"
];


// Current video
let videoIndex = 0;


// Get HTML elements
const memoryVideo =
    document.getElementById("memoryVideo");

const memorySource =
    document.getElementById("memorySource");

const photoNumber =
    document.getElementById("photoNumber");

const photoCaption =
    document.getElementById("photoCaption");

const nextMemory =
    document.getElementById("nextMemory");


/* =========================================
   FIRST VIDEO
========================================= */

memorySource.src =
    memoryVideos[0];

photoNumber.textContent = "1";

photoCaption.textContent =
    videoCaptions[0];

memoryVideo.load();


/* =========================================
   NEXT MEMORY BUTTON
========================================= */

nextMemory.addEventListener("click", () => {

    // Stop current video
    memoryVideo.pause();


    // Go to next video
    videoIndex++;


    /* =====================================
       AFTER THIRD VIDEO
    ===================================== */

    if (videoIndex >= memoryVideos.length) {

    videoIndex = 0;

    // 3rd video ke baad LETTER screen
    showScreen(letterScreen);

    return;
    }

    /* =====================================
       VIDEO CHANGE ANIMATION
    ===================================== */

    memoryVideo.style.opacity = "0";

    memoryVideo.style.transform =
        "scale(0.92)";


    setTimeout(() => {

        // Change video
        memorySource.src =
            memoryVideos[videoIndex];

        // Reload new video
        memoryVideo.load();


        // Change number
        photoNumber.textContent =
            videoIndex + 1;


        // Change caption
        photoCaption.textContent =
            videoCaptions[videoIndex];


        // Show video
        memoryVideo.style.opacity = "1";

        memoryVideo.style.transform =
            "scale(1)";


        // Try to play automatically
        memoryVideo.play().catch(() => {});

    }, 300);

});


/* =========================================
   VIDEO ANIMATION
========================================= */

memoryVideo.style.transition =
    "opacity 0.5s ease, transform 0.5s ease";             
/* =========================================
   LETTER → FINAL
========================================= */

document
    .getElementById("letterNext")
    .addEventListener(
        "click",
        () => {

            showScreen(
                finalScreen
            );

        }
    );