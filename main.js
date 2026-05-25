/* =====================================================
   SORRY WEBSITE — main.js
   Redesigned with ♡  |  All original flow preserved
   ===================================================== */

'use strict';

// ─── DOM References ──────────────────────────────────
const loadingScreen = document.getElementById('loadingScreen');
const loadingBarFill = document.getElementById('loadingBarFill');
const glassCard = document.getElementById('glassCard');
const musicBtn = document.getElementById('musicBtn');
const musicLabelTxt = document.getElementById('musicLabelTxt');
const particlesCanvas = document.getElementById('particlesCanvas');
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const question = document.getElementById('question');
const microText = document.getElementById('microText');
const mainGif = document.getElementById('mainGif');
const btnGroup = document.getElementById('btnGroup');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const finalMsg = document.getElementById('finalMsg');

// ─── State Machine ────────────────────────────────────
const S = {
    INITIAL: 'initial',
    SORRY: 'sorry',
    THINK: 'think',
    SADLIFE: 'sadlife',
    RUN: 'run',
    FINAL: 'final'
};

let currentState = S.INITIAL;
let isRunning = false; // tracks if yesBtn is in "run-away" mode

const states = {
    [S.INITIAL]: {
        question: 'suno na…',
        micro: 'okay this took embarrassingly long to make',
        gif: 'images/cute.gif',
        gifStyle: null,
        yesLabel: 'bolo na 🤍',
        noLabel: 'nahi',
    },
    [S.SORRY]: {
        question: "Sorryyy yrr kal jyada rude ho gya tha na..",
        micro: 'took me a while but here we are',
        gif: 'images/sorry.png',
        gifStyle: { maxHeight: '280px', width: '100%' },
        yesLabel: 'accha theek hai',
        noLabel: 'nahi',
    },
    [S.THINK]: {
        question: 'soch lo ek baar…',
        micro: 'i mean it this time though',
        gif: 'images/download.gif',
        gifStyle: null,
        yesLabel: 'accha theek hai',
        noLabel: 'nahi sochna',
    },
    [S.SADLIFE]: {
        question: 'ek baar aur sochogi? 🥺',
        micro: "this gif is doing the work i can't",
        gif: 'images/sadlife.gif',
        gifStyle: null,
        yesLabel: 'chalo maan gayi',
        noLabel: 'nahi sochna',
    },
    [S.RUN]: {
        question: 'manja na… itna bhav bsss nee 😭',
        micro: 'this page took longer than my emotional stability',
        gif: 'images/run.gif',
        gifStyle: null,
        yesLabel: 'nahi',           // ← this one runs away on hover
        noLabel: 'haan theek hai', // ← this one leads to final
    }
};

// ─── Apply a state to the UI ──────────────────────────
function applyState(key) {
    const cfg = states[key];
    if (!cfg) return;

    currentState = key;
    isRunning = false;

    question.textContent = cfg.question;
    microText.textContent = cfg.micro;

    // Swap gif with a tiny cross-fade
    mainGif.style.opacity = '0';
    setTimeout(() => {
        mainGif.src = cfg.gif;

        // Reset gif sizing
        mainGif.style.maxHeight = '';
        mainGif.style.width = '';
        mainGif.style.height = '';

        if (cfg.gifStyle) {
            Object.assign(mainGif.style, cfg.gifStyle);
        }
        mainGif.style.opacity = '1';
    }, 180);

    yesBtn.textContent = cfg.yesLabel;
    noBtn.textContent = cfg.noLabel;

    // Make sure buttons are visible
    yesBtn.style.display = '';
    noBtn.style.display = '';
    btnGroup.style.display = '';

    // Reset running button
    yesBtn.classList.remove('btn-run');
    yesBtn.style.left = '';
    yesBtn.style.top = '';
    yesBtn.style.margin = '';
    yesBtn.style.position = '';
    yesBtn.style.zIndex = '';
    yesBtn.style.width = '';

    // Hide final message
    finalMsg.classList.remove('show');
    finalMsg.style.display = 'none';
}

// ─── Transition with card animation ──────────────────
function transitionTo(nextState) {
    // Block spamming
    if (glassCard.classList.contains('transitioning')) return;

    glassCard.classList.add('transitioning');

    setTimeout(() => {
        if (nextState === S.FINAL) {
            goFinal();
        } else {
            applyState(nextState);
        }

        // Remove after a beat to let new content paint
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                glassCard.classList.remove('transitioning');
            });
        });
    }, 320);
}

// ─── Final Screen ─────────────────────────────────────
function goFinal() {
    currentState = S.FINAL;
    isRunning = false;

    question.textContent = 'hehehe… i knew it PAL 🫶';
    microText.textContent = '';

    mainGif.style.opacity = '0';
    setTimeout(() => {
        mainGif.src = 'images/love.gif';
        mainGif.style.maxHeight = '';
        mainGif.style.width = '';
        mainGif.style.height = '';
        mainGif.style.opacity = '1';
    }, 180);

    btnGroup.style.display = 'none';

    // Reset running button
    yesBtn.classList.remove('btn-run');

    // Show final message
    finalMsg.style.display = 'flex';
    requestAnimationFrame(() => finalMsg.classList.add('show'));

    // Burst extra particles on final screen
    spawnHeartBurst();
}

// ─── Button Logic (yes) ───────────────────────────────
yesBtn.addEventListener('click', () => {
    if (isRunning) return; // in run mode, yesBtn runs — can't click

    switch (currentState) {
        case S.INITIAL: transitionTo(S.SORRY); break;
        case S.SORRY: transitionTo(S.FINAL); break;
        case S.THINK: transitionTo(S.FINAL); break;
        case S.SADLIFE: transitionTo(S.FINAL); break;
        // In RUN state yesBtn runs away — clicking does nothing
    }
});

// ─── Button Logic (no) ────────────────────────────────
noBtn.addEventListener('click', () => {
    switch (currentState) {
        case S.SORRY: transitionTo(S.THINK); break;
        case S.THINK: transitionTo(S.SADLIFE); break;
        case S.SADLIFE: transitionTo(S.RUN); break;
        case S.RUN: transitionTo(S.FINAL); break;
        // INITIAL "nahi" → no action (just a shy wiggle)
        case S.INITIAL:
            noBtn.style.animation = 'none';
            requestAnimationFrame(() => {
                noBtn.style.animation = '';
                noBtn.classList.add('wiggle');
                setTimeout(() => noBtn.classList.remove('wiggle'), 500);
            });
            break;
    }
});

// ─── Run-Away Button (hover in RUN state) ────────────
yesBtn.addEventListener('mouseenter', () => {
    if (currentState !== S.RUN) return;

    const margin = 56;
    const btnW = yesBtn.offsetWidth || 130;
    const btnH = yesBtn.offsetHeight || 46;

    if (!isRunning) {
        // Snap to fixed positioning from current location
        const rect = yesBtn.getBoundingClientRect();
        yesBtn.classList.add('btn-run');
        yesBtn.style.left = rect.left + 'px';
        yesBtn.style.top = rect.top + 'px';
        yesBtn.style.width = rect.width + 'px';
        yesBtn.style.margin = '0';
        isRunning = true;
    }

    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;

    const newX = Math.floor(Math.random() * (maxX - margin)) + margin;
    const newY = Math.floor(Math.random() * (maxY - margin)) + margin;

    yesBtn.style.left = newX + 'px';
    yesBtn.style.top = newY + 'px';
});

// Touch equivalent for run state — shrink on tap
yesBtn.addEventListener('touchstart', (e) => {
    if (currentState !== S.RUN) return;
    e.preventDefault();

    // On mobile: just wiggle the button, can't really run from touch
    yesBtn.style.transform = 'scale(0.88)';
    setTimeout(() => { yesBtn.style.transform = ''; }, 300);
}, { passive: false });

// ─── Loading Screen ───────────────────────────────────
function runLoadingBar() {
    let progress = 0;

    const tick = setInterval(() => {
        const step = Math.random() * 18 + 6;
        progress = Math.min(progress + step, 100);
        loadingBarFill.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(tick);

            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                musicBtn.classList.add('visible');

                setTimeout(() => {
                    glassCard.classList.add('visible');
                }, 180);
            }, 350);
        }
    }, 110);
}

// ─── Custom Cursor ────────────────────────────────────
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateCursorRing() {
    // Smooth lag follow
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Cursor expand on interactive elements
function onHoverIn() {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(2.2)';
    cursorRing.style.width = '50px';
    cursorRing.style.height = '50px';
    cursorRing.style.borderColor = 'rgba(244,160,181,0.85)';
}
function onHoverOut() {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.width = '34px';
    cursorRing.style.height = '34px';
    cursorRing.style.borderColor = 'rgba(244,160,181,0.5)';
}

document.addEventListener('mouseover', (e) => {
    if (e.target.closest('button, a, [role="button"]')) onHoverIn();
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest('button, a, [role="button"]')) onHoverOut();
});

// ─── Particles Canvas ─────────────────────────────────
const ctx = particlesCanvas.getContext('2d');
let parts = [];
let canvasW, canvasH;

const CHARS = ['♡', '✦', '·', '⋆', '˖', '✿'];

function resizeCanvas() {
    canvasW = particlesCanvas.width = window.innerWidth;
    canvasH = particlesCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

function mkParticle(randomY = false) {
    return {
        x: Math.random() * canvasW,
        y: randomY ? Math.random() * canvasH : canvasH + 20,
        size: Math.random() * 13 + 5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.7 + 0.25),
        alpha: Math.random() * 0.35 + 0.08,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        hue: Math.random() * 50 - 25,
        phase: Math.random() * Math.PI * 2,
    };
}

// Seed spread particles
for (let i = 0; i < 35; i++) parts.push(mkParticle(true));

function spawnHeartBurst() {
    for (let i = 0; i < 20; i++) {
        const p = mkParticle(false);
        p.x = canvasW / 2 + (Math.random() - 0.5) * 200;
        p.size = Math.random() * 18 + 10;
        p.char = '♡';
        p.alpha = 0.6;
        parts.push(p);
    }
}

function drawParticles(ts) {
    ctx.clearRect(0, 0, canvasW, canvasH);

    for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];

        // Gentle sway
        p.x += p.vx + Math.sin(ts * 0.0005 + p.phase) * 0.25;
        p.y += p.vy;

        // Fade as rises
        const lifeRatio = 1 - (p.y / canvasH);
        const a = p.alpha * Math.max(0, Math.min(1, lifeRatio * 2));

        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = `hsl(${340 + p.hue}, 72%, 82%)`;
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();

        // Recycle
        if (p.y < -24) {
            parts[i] = mkParticle(false);
        }
    }

    // Occasionally add new particles (cap at 55)
    if (Math.random() < 0.04 && parts.length < 55) {
        parts.push(mkParticle(false));
    }

    requestAnimationFrame(drawParticles);
}
requestAnimationFrame(drawParticles);

// ─── Ambient Music (HTML5 Audio) ───────────────────
let audio = null;
let isPlaying = false;

function initAudio() {
    audio = new Audio('song.mp3');
    audio.loop = true;
}

function tryPlayAudio() {
    if (!audio) initAudio();
    if (!isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.setAttribute('aria-pressed', 'true');
            musicLabelTxt.textContent = 'pause';
            removeInteractionListeners();
        }).catch(() => {
            // Autoplay blocked, will try again on user gesture
        });
    }
}

function handleUserInteraction() {
    tryPlayAudio();
}

function addInteractionListeners() {
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
}

function removeInteractionListeners() {
    document.removeEventListener('click', handleUserInteraction);
    document.removeEventListener('keydown', handleUserInteraction);
    document.removeEventListener('touchstart', handleUserInteraction);
    document.removeEventListener('mousemove', handleUserInteraction);
}

// Start listening for early gestures
addInteractionListeners();

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audio) initAudio();

    if (isPlaying) {
        audio.pause();
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('aria-pressed', 'false');
        musicLabelTxt.textContent = 'music';
        isPlaying = false;
        removeInteractionListeners();
    } else {
        audio.play().catch(err => {
            console.log('Playback prevented by browser autoplay policy:', err);
        });
        musicBtn.classList.add('playing');
        musicBtn.setAttribute('aria-pressed', 'true');
        musicLabelTxt.textContent = 'pause';
        isPlaying = true;
        removeInteractionListeners();
    }
});

// ─── Gif cross-fade style injection ──────────────────
mainGif.style.transition = 'opacity 0.35s ease';

// ─── Wiggle keyframe (no-btn in initial state) ────────
const wiggleStyle = document.createElement('style');
wiggleStyle.textContent = `
    @keyframes wiggleBtn {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-6px) rotate(-2deg); }
        40%      { transform: translateX(6px)  rotate(2deg);  }
        60%      { transform: translateX(-4px) rotate(-1deg); }
        80%      { transform: translateX(4px)  rotate(1deg);  }
    }
    .wiggle { animation: wiggleBtn 0.45s ease !important; }
`;
document.head.appendChild(wiggleStyle);

// ─── Boot ─────────────────────────────────────────────
window.addEventListener('load', () => {
    runLoadingBar();
    tryPlayAudio();
});
