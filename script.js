// Get all elements
const heartbeatBtn = document.getElementById('heartbeatBtn');
const heartbeatContainer = document.getElementById('heartbeatContainer');
const proposalSection = document.getElementById('proposalSection');
const successMessage = document.getElementById('successMessage');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const heartRain = document.getElementById('heartRain');
const celebrationMusic = document.getElementById('celebrationMusic');
const restartBtn = document.getElementById('restartBtn');

// State variables
let isProposalActive = false;
let isAnswered = false;
let isSuccessActive = false;
const hearts = ['❤️', '💕', '💖', '💗', '💝', '❤️‍🔥', '🥰', '💓', '🩵', '💜', '💙'];

// ============ YOUR PHOTOS — just add filenames here ============
const photos = [
    'pic1.png',
    'pic2.png',
    'pic3.png',
    'pic4.png',
    'pic5.png',
    'pic6.png',
    'pic7.png',
    'pic8.png',
    'pic9.png',
    'pic10.png',
    'pic11.png',
    'pic12.png',
    'pic13.png',
    'pic14.png',
    'pic15.png',
    'pic16.png',
    'pic17.png',
    // add as many as you want...
];

let slideshowInterval = null;
let currentPhotoIndex = 0;

// ============ STEP 1: CLICK HEARTBEAT ============
heartbeatBtn.addEventListener('click', () => {
    startProposal();
});

function startProposal() {
    heartbeatContainer.classList.add('hidden');
    proposalSection.classList.remove('hidden');
    isProposalActive = true;
    createHeartRain();
}

// ============ STEP 2: CREATE HEART RAIN ============
function createHeartRain() {
    heartRain.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const randomLeft = Math.random() * 100;
        heart.style.left = randomLeft + '%';

        const duration = 3 + Math.random() * 5;
        heart.style.animationDuration = duration + 's';

        const delay = Math.random() * 0.5;
        heart.style.animationDelay = delay + 's';

        const rotation = Math.random() * 360;
        heart.style.setProperty('--rotation', rotation + 'deg');

        heartRain.appendChild(heart);

        setTimeout(() => {
            if (isProposalActive && !isAnswered) {
                restartHeartAnimation(heart);
            }
        }, (duration + delay) * 1000);
    }
}

function restartHeartAnimation(heart) {
    const newHeart = heart.cloneNode(true);
    heartRain.replaceChild(newHeart, heart);

    const duration = 3 + Math.random() * 5;
    newHeart.style.animationDuration = duration + 's';

    setTimeout(() => {
        if (isProposalActive && !isAnswered) {
            restartHeartAnimation(newHeart);
        }
    }, duration * 1000);
}

// ============ STEP 3: YES BUTTON ============
yesBtn.addEventListener('click', () => {
    if (isAnswered) return;
    isAnswered = true;
    isProposalActive = false;
    isSuccessActive = true;

    proposalSection.classList.add('hidden');
    successMessage.classList.remove('hidden');

    document.querySelectorAll('.falling-heart').forEach(heart => heart.remove());

    playMusic();
    startSlideshow();
});

// ============ PLAY MUSIC ============
function playMusic() {
    celebrationMusic.currentTime = 0;

    const playPromise = celebrationMusic.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Music started playing!');
            })
            .catch(error => {
                console.log('Music playback failed:', error);
                document.addEventListener('click', () => {
                    celebrationMusic.play().catch(e => console.log('Could not play music'));
                }, { once: true });
            });
    }
}

// ============ SLIDESHOW ============
function startSlideshow() {
    if (photos.length === 0) return;

    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    currentPhotoIndex = 0;

    const img = document.getElementById('slideshowImg');
    img.src = shuffled[currentPhotoIndex];

    slideshowInterval = setInterval(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % shuffled.length;

        img.style.opacity = '0';

        setTimeout(() => {
            img.src = shuffled[currentPhotoIndex];
            img.style.opacity = '1';
        }, 400);

    }, 3000);
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// ============ RESTART BUTTON ============
restartBtn.addEventListener('click', () => {
    location.reload();
});

// ============ STEP 4: NO BUTTON ============
noBtn.addEventListener('click', () => {
    if (isAnswered) return;

    document.querySelectorAll('.falling-heart').forEach(heart => {
        heart.classList.add('black');
    });

    jumpButton();
});

function jumpButton() {
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 200;

    const currentScale = parseFloat(
        window.getComputedStyle(noBtn).transform.match(/scale\(([^)]+)\)/)?.[1] || 1
    );
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(${Math.max(currentScale - 0.05, 0.5)})`;
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isProposalActive && !isSuccessActive && successMessage.classList.contains('hidden')) {
        startProposal();
    }
    if (e.key === 'Escape') {
        location.reload();
    }
});

// ============ NO BUTTON JUMP ON HOVER ============
noBtn.addEventListener('mouseenter', () => {
    if (!isAnswered) jumpButton();
});

noBtn.addEventListener('touchstart', (e) => {
    if (!isAnswered) {
        e.preventDefault();
        jumpButton();
    }
});

// ============ CLEANUP ON UNLOAD ============
window.addEventListener('beforeunload', () => {
    celebrationMusic.pause();
    stopSlideshow();
});