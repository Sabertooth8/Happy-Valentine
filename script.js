/* ============================================
   Valentine's Day Landing Page — Script
   ============================================ */

// ---------- Preloader ----------
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 2000);
});

// ---------- Scroll Reveal ----------
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ---------- Floating Hearts Canvas ----------
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let hearts = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Heart {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;         // start scattered
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 10 + 6;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.15 + 0.03;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.sway = Math.random() * 30 + 10;
        this.swaySpeed = Math.random() * 0.002 + 0.001;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.time = 0;

        // Alternate between gold & pink
        const colors = [
            'rgba(212, 168, 83,',    // gold
            'rgba(242, 160, 179,',   // pink
            'rgba(232, 120, 138,',   // pink-medium
            'rgba(184, 134, 11,',    // gold-deep
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.time += 1;
        this.y -= this.speedY;
        this.x += Math.sin(this.time * this.swaySpeed + this.swayOffset) * 0.3;
        this.rotation += this.rotationSpeed;

        if (this.y < -30) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.size / 15, this.size / 15);
        ctx.globalAlpha = this.opacity;

        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.bezierCurveTo(-7, -15, -15, -5, 0, 8);
        ctx.bezierCurveTo(15, -5, 7, -15, 0, -5);
        ctx.closePath();

        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
        ctx.restore();
    }
}

// Create hearts - fewer for performance
const heartCount = Math.min(Math.floor(window.innerWidth / 35), 30);
for (let i = 0; i < heartCount; i++) {
    hearts.push(new Heart());
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    animationId = requestAnimationFrame(animateHearts);
}

animateHearts();

// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---------- Parallax subtle on hero ----------
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const hero = document.querySelector('.hero-content');
            if (hero && scrollY < window.innerHeight) {
                hero.style.transform = `translateY(${scrollY * 0.15}px)`;
                hero.style.opacity = 1 - (scrollY / window.innerHeight) * 0.6;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ---------- Rose Petals in Hero ----------
(function () {
    const petalsContainer = document.getElementById('hero-petals');
    if (!petalsContainer) return;

    const petalCount = Math.min(Math.floor(window.innerWidth / 80), 15);

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('hero-petal');
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (6 + Math.random() * 8) + 's';
        petal.style.animationDelay = Math.random() * 10 + 's';
        petal.style.width = (8 + Math.random() * 8) + 'px';
        petal.style.height = (10 + Math.random() * 10) + 'px';

        // Randomize petal color between pink and gold tones
        const colors = [
            'radial-gradient(ellipse, rgba(242, 160, 179, 0.6), rgba(232, 120, 138, 0.2))',
            'radial-gradient(ellipse, rgba(212, 168, 83, 0.5), rgba(184, 134, 11, 0.2))',
            'radial-gradient(ellipse, rgba(255, 214, 224, 0.6), rgba(242, 160, 179, 0.2))',
        ];
        petal.style.background = colors[Math.floor(Math.random() * colors.length)];
        petalsContainer.appendChild(petal);
    }
})();

// ---------- Typing-like effect for letter (subtle) ----------
const letterBody = document.querySelectorAll('.letter-body');
const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transition = 'opacity 1s ease, transform 1s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            letterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

letterBody.forEach((p, i) => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(15px)';
    p.style.transitionDelay = `${i * 0.3}s`;
    letterObserver.observe(p);
});

// ---------- Sparkle cursor effect on special section ----------
const specialSection = document.querySelector('.special-section');
if (specialSection) {
    specialSection.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.85) {
            createSparkle(e.pageX, e.pageY);
        }
    });
}

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✦';
    sparkle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        font-size: ${Math.random() * 12 + 8}px;
        color: ${Math.random() > 0.5 ? '#D4A853' : '#F2A0B3'};
        z-index: 100;
        animation: sparkleAnim 1s ease-out forwards;
    `;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

// Add sparkle animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnim {
        0% { opacity: 1; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
        100% { opacity: 0; transform: scale(0.5) rotate(360deg) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// ---------- Page visibility — pause animation when hidden ----------
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        animateHearts();
    }
});

// ============================================
//  MINIGAME — Tangkap Cintaku (Catch the Love)
// ============================================
(function () {
    const gameArea = document.getElementById('game-area');
    const startBtn = document.getElementById('game-start-btn');
    const playAgainBtn = document.getElementById('game-play-again');
    const scoreEl = document.getElementById('game-score');
    const timerEl = document.getElementById('game-timer');
    const missedEl = document.getElementById('game-missed');
    const meterFill = document.getElementById('love-meter-fill');
    const rewardEl = document.getElementById('game-reward');
    const idleMsg = document.getElementById('game-idle-msg');

    if (!gameArea || !startBtn) return;

    const GOAL = 20;
    const GAME_DURATION = 30;

    let score = 0;
    let missed = 0;
    let timeLeft = GAME_DURATION;
    let gameRunning = false;
    let gameTimer = null;
    let spawnTimer = null;
    let fallingHearts = [];
    let gameLoopId = null;
    let hasWon = false;

    // Heart SVG templates (different sizes/styles)
    const heartSVGs = [
        `<svg viewBox="0 0 40 40" width="36" height="36"><path d="M20 35 C12 27 4 21 4 14 C4 9 8 5 13 5 C16 5 18 7 20 10 C22 7 24 5 27 5 C32 5 36 9 36 14 C36 21 28 27 20 35Z" fill="#F2A0B3" stroke="#E8788A" stroke-width="1"/></svg>`,
        `<svg viewBox="0 0 40 40" width="32" height="32"><path d="M20 35 C12 27 4 21 4 14 C4 9 8 5 13 5 C16 5 18 7 20 10 C22 7 24 5 27 5 C32 5 36 9 36 14 C36 21 28 27 20 35Z" fill="#E8788A" stroke="#C85A7C" stroke-width="1"/></svg>`,
        `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 35 C12 27 4 21 4 14 C4 9 8 5 13 5 C16 5 18 7 20 10 C22 7 24 5 27 5 C32 5 36 9 36 14 C36 21 28 27 20 35Z" fill="#FFD6E0" stroke="#F2A0B3" stroke-width="1"/></svg>`,
        `<svg viewBox="0 0 40 40" width="40" height="40"><path d="M20 35 C12 27 4 21 4 14 C4 9 8 5 13 5 C16 5 18 7 20 10 C22 7 24 5 27 5 C32 5 36 9 36 14 C36 21 28 27 20 35Z" fill="#D4A853" stroke="#B8860B" stroke-width="1"/></svg>`,
        `<svg viewBox="0 0 40 40" width="34" height="34"><path d="M20 35 C12 27 4 21 4 14 C4 9 8 5 13 5 C16 5 18 7 20 10 C22 7 24 5 27 5 C32 5 36 9 36 14 C36 21 28 27 20 35Z" fill="#C85A7C" stroke="#A04060" stroke-width="1"/></svg>`,
    ];

    // Special golden heart (worth bonus)
    const goldenHeart = `<svg viewBox="0 0 40 40" width="44" height="44"><path d="M20 35 C12 27 4 21 4 14 C4 9 8 5 13 5 C16 5 18 7 20 10 C22 7 24 5 27 5 C32 5 36 9 36 14 C36 21 28 27 20 35Z" fill="#D4A853" stroke="#B8860B" stroke-width="1.5"/><text x="20" y="22" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">✦</text></svg>`;

    function resetGame() {
        score = 0;
        missed = 0;
        timeLeft = GAME_DURATION;
        hasWon = false;
        scoreEl.textContent = '0';
        timerEl.textContent = GAME_DURATION;
        missedEl.textContent = '0';
        meterFill.style.width = '0%';
        rewardEl.classList.remove('show');

        // Clear existing hearts
        gameArea.querySelectorAll('.falling-heart, .game-over-overlay').forEach(el => el.remove());
        fallingHearts = [];
    }

    function startGame() {
        resetGame();
        gameRunning = true;
        startBtn.style.display = 'none';
        if (idleMsg) idleMsg.style.display = 'none';

        // Start timer
        gameTimer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;

            if (timeLeft <= 5) {
                timerEl.style.color = '#C85A7C';
            }

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        // Start spawning
        scheduleSpawn();

        // Start game loop
        gameLoop();
    }

    function scheduleSpawn() {
        if (!gameRunning) return;

        // Speed increases as time progresses
        const elapsed = GAME_DURATION - timeLeft;
        const baseInterval = 800;
        const minInterval = 350;
        const interval = Math.max(minInterval, baseInterval - (elapsed * 15));

        spawnTimer = setTimeout(() => {
            spawnHeart();
            scheduleSpawn();
        }, interval + Math.random() * 400);
    }

    function spawnHeart() {
        if (!gameRunning) return;

        const areaRect = gameArea.getBoundingClientRect();
        const heartEl = document.createElement('div');
        heartEl.classList.add('falling-heart');

        // 12% chance of golden heart (worth 2 points)
        const isGolden = Math.random() < 0.12;
        heartEl.innerHTML = isGolden ? goldenHeart : heartSVGs[Math.floor(Math.random() * heartSVGs.length)];
        heartEl.dataset.points = isGolden ? '2' : '1';
        if (isGolden) heartEl.dataset.golden = 'true';

        const maxX = areaRect.width - 50;
        const startX = Math.random() * maxX;
        heartEl.style.left = startX + 'px';
        heartEl.style.top = '-50px';
        heartEl.style.setProperty('--wobble-duration', (1.5 + Math.random()) + 's');

        // Fall speed increases over time
        const elapsed = GAME_DURATION - timeLeft;
        const baseFallSpeed = 1.2;
        const fallSpeed = baseFallSpeed + (elapsed * 0.04) + Math.random() * 0.5;

        const heartData = {
            el: heartEl,
            x: startX,
            y: -50,
            speed: fallSpeed,
            active: true,
            points: isGolden ? 2 : 1,
        };
        fallingHearts.push(heartData);

        // Click/tap handler
        const onCatch = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!heartData.active) return;
            heartData.active = false;
            catchHeart(heartData, e);
        };

        heartEl.addEventListener('click', onCatch);
        heartEl.addEventListener('touchstart', onCatch, { passive: false });

        gameArea.appendChild(heartEl);
    }

    function catchHeart(heartData, e) {
        const el = heartData.el;
        const points = heartData.points;
        score += points;
        scoreEl.textContent = score;

        // Update love meter
        const progress = Math.min((score / GOAL) * 100, 100);
        meterFill.style.width = progress + '%';

        // Burst effect
        const rect = el.getBoundingClientRect();
        const areaRect = gameArea.getBoundingClientRect();
        const cx = rect.left - areaRect.left + rect.width / 2;
        const cy = rect.top - areaRect.top + rect.height / 2;

        // Create burst particles
        const bursts = points === 2
            ? ['✨', '💛', '✦']
            : ['💕', '♥', '✧'];
        bursts.forEach((emoji, i) => {
            const burst = document.createElement('div');
            burst.classList.add('click-burst');
            burst.textContent = emoji;
            burst.style.left = (cx + (Math.random() - 0.5) * 30) + 'px';
            burst.style.top = (cy + (Math.random() - 0.5) * 20) + 'px';
            burst.style.animationDelay = (i * 0.08) + 's';
            gameArea.appendChild(burst);
            setTimeout(() => burst.remove(), 800);
        });

        // Score popup
        const pop = document.createElement('div');
        pop.classList.add('score-pop');
        pop.textContent = points === 2 ? '+2 ✦' : '+1';
        pop.style.left = cx + 'px';
        pop.style.top = cy + 'px';
        gameArea.appendChild(pop);
        setTimeout(() => pop.remove(), 900);

        // Remove heart with scale-down
        el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        el.style.transform = 'scale(0)';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 250);

        // Check win
        if (score >= GOAL && !hasWon) {
            hasWon = true;
            setTimeout(() => {
                endGame(true);
            }, 400);
        }
    }

    function gameLoop() {
        if (!gameRunning) return;

        const areaHeight = gameArea.clientHeight;

        fallingHearts.forEach(h => {
            if (!h.active) return;
            h.y += h.speed;
            h.el.style.top = h.y + 'px';

            // Heart fell past bottom
            if (h.y > areaHeight + 10) {
                h.active = false;
                h.el.remove();
                missed++;
                missedEl.textContent = missed;
            }
        });

        // Cleanup inactive
        fallingHearts = fallingHearts.filter(h => h.active || h.el.parentNode);

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function endGame(won) {
        gameRunning = false;
        clearInterval(gameTimer);
        clearTimeout(spawnTimer);
        cancelAnimationFrame(gameLoopId);

        // Remove remaining hearts with fade
        fallingHearts.forEach(h => {
            if (h.el.parentNode) {
                h.el.style.transition = 'opacity 0.5s ease';
                h.el.style.opacity = '0';
                setTimeout(() => h.el.remove(), 500);
            }
        });

        timerEl.style.color = '';

        if (won || score >= GOAL) {
            // Show reward
            setTimeout(() => {
                rewardEl.classList.add('show');
                rewardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 600);
        } else {
            // Show game over in game area
            const overlay = document.createElement('div');
            overlay.classList.add('game-over-overlay');
            overlay.innerHTML = `
                <h3>Waktu Habis! ⏰</h3>
                <p>Kamu menangkap <strong>${score}</strong> dari <strong>${GOAL}</strong> hati</p>
                <button class="game-btn" id="retry-btn">
                    <span>Coba Lagi 💪</span>
                </button>
            `;
            gameArea.appendChild(overlay);

            overlay.querySelector('#retry-btn').addEventListener('click', () => {
                overlay.remove();
                startGame();
            });
        }

        startBtn.style.display = 'inline-flex';
        startBtn.querySelector('span').textContent = 'Main Lagi';
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            rewardEl.classList.remove('show');
            startGame();
        });
    }
})();

// ============================================
//  MUSIC PLAYER — Our Playlist
// ============================================
(function () {
    // === PLAYLIST CONFIGURATION ===
    // Add your songs here. Each entry: { file, title, artist }
    // If only file is provided, title/artist will be parsed from filename
    const PLAYLIST = [
        { file: 'Music/Nadhif Basalamah - bergema sampai selamanya (Official Lyric Video).mp3' },
        { file: 'Music/Nadhif_Basalamah_-_kota_ini_tak_sama_tanpamu_(mp3.pm).mp3', title: 'Kota Ini Tak Sama Tanpamu', artist: 'Nadhif Basalamah' },
        { file: 'Music/DEABDIL_-_SPONTAN_tanpa_UHUY_(mp3.pm).mp3', title: 'Spontan', artist: 'Deabdil' },
        { file: 'Music/ANDRA_AND_THE_BACKBONE_-_10_Sempurna_(mp3.pm).mp3', title: 'Sempurna', artist: 'Andra and The Backbone' },
        { file: 'Music/Ariel_NOAH_-_Moshimo_Mata_Itsuka_(mp3.pm).mp3', title: 'Moshimo Mata Itsuka', artist: 'Ariel NOAH' },
        { file: 'Music/Bunga_Citra_Lestari_-_Karena_Ku_Cinta_Kau_(mp3.pm).mp3', title: 'Karena Ku Cinta Kau', artist: 'Bunga Citra Lestari' },
        { file: 'Music/D4vd_-_Here_with_me_(mp3.pm).mp3', title: 'Here With Me', artist: 'D4vd' },
        { file: 'Music/Sheila_on_7_-_bila_kau_tak_disampingku_(mp3.pm).mp3', title: 'Bila Kau Tak Disampingku', artist: 'Sheila on 7' },
        { file: 'Music/The_Walters_-_I_Love_You_So_(mp3.pm).mp3', title: 'I Love You So', artist: 'The Walters' },
    ];

    // Parse title/artist from filename if not provided
    PLAYLIST.forEach(song => {
        if (!song.title || !song.artist) {
            // Remove path and extension
            let name = song.file.split('/').pop().replace(/\.\w+$/, '');
            // Remove common suffixes
            name = name.replace(/\s*\(Official.*?\)/gi, '')
                .replace(/\s*\(Lyric.*?\)/gi, '')
                .replace(/\s*\[Official.*?\]/gi, '')
                .replace(/\s*\(Audio.*?\)/gi, '')
                .trim();
            // Try to split by " - "
            const parts = name.split(' - ');
            if (parts.length >= 2) {
                song.artist = song.artist || parts[0].trim();
                song.title = song.title || parts.slice(1).join(' - ').trim();
            } else {
                song.title = song.title || name;
                song.artist = song.artist || 'Unknown';
            }
        }
    });

    if (PLAYLIST.length === 0) return;

    // DOM elements
    const toggleBtn = document.getElementById('player-toggle');
    const playerBody = document.getElementById('player-body');
    const closeBtn = document.getElementById('player-close');
    const discOuter = document.querySelector('.disc-outer');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const progressBar = document.getElementById('player-progress');
    const progressFilled = document.getElementById('progress-filled');
    const progressThumb = document.getElementById('progress-thumb');
    const currentTimeEl = document.getElementById('progress-current');
    const durationEl = document.getElementById('progress-duration');
    const btnPlay = document.getElementById('btn-play');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnRepeat = document.getElementById('btn-repeat');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistList = document.getElementById('playlist-list');
    const playlistCount = document.getElementById('playlist-count');

    if (!toggleBtn || !playerBody) return;

    let audio = new Audio();
    let currentIndex = 0;
    let isPlaying = false;
    let repeatMode = false; // false = no repeat, true = repeat all

    // Set initial volume
    audio.volume = 0.7;

    // Build playlist UI
    function buildPlaylist() {
        playlistCount.textContent = PLAYLIST.length + ' lagu';
        playlistList.innerHTML = '';

        PLAYLIST.forEach((song, i) => {
            const li = document.createElement('li');
            li.classList.add('playlist-item');
            li.dataset.index = i;
            li.innerHTML = `
                <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
                <div class="pl-info">
                    <div class="pl-title">${song.title}</div>
                    <div class="pl-artist">${song.artist}</div>
                </div>
                <div class="pl-equalizer">
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                </div>
            `;
            li.addEventListener('click', () => {
                loadTrack(i);
                playAudio();
            });
            playlistList.appendChild(li);
        });
    }

    function loadTrack(index) {
        currentIndex = index;
        const song = PLAYLIST[index];
        audio.src = song.file;
        trackTitle.textContent = song.title;
        trackArtist.textContent = song.artist;
        progressFilled.style.width = '0%';
        progressThumb.style.left = '0%';
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';

        // Update active in playlist
        document.querySelectorAll('.playlist-item').forEach(el => {
            el.classList.remove('active', 'playing');
        });
        const activeItem = playlistList.querySelector(`[data-index="${index}"]`);
        if (activeItem) activeItem.classList.add('active');
    }

    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            discOuter.classList.add('spinning');
            const activeItem = playlistList.querySelector('.playlist-item.active');
            if (activeItem) activeItem.classList.add('playing');
        }).catch(err => {
            console.log('Playback blocked:', err);
        });
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        discOuter.classList.remove('spinning');
        document.querySelectorAll('.playlist-item').forEach(el => {
            el.classList.remove('playing');
        });
    }

    function togglePlay() {
        if (isPlaying) {
            pauseAudio();
        } else {
            if (!audio.src || audio.src === window.location.href) {
                loadTrack(0);
            }
            playAudio();
        }
    }

    function nextTrack() {
        let next = currentIndex + 1;
        if (next >= PLAYLIST.length) {
            next = repeatMode ? 0 : 0; // always wrap around
        }
        loadTrack(next);
        playAudio();
    }

    function prevTrack() {
        // If more than 3s into song, restart; otherwise go previous
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        let prev = currentIndex - 1;
        if (prev < 0) prev = PLAYLIST.length - 1;
        loadTrack(prev);
        playAudio();
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Update progress bar
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressFilled.style.width = pct + '%';
            progressThumb.style.left = pct + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        if (repeatMode) {
            nextTrack();
        } else if (currentIndex < PLAYLIST.length - 1) {
            nextTrack();
        } else {
            // End of playlist
            pauseAudio();
            loadTrack(0);
        }
    });

    // Seek on progress bar click
    progressBar.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
    });

    // Volume
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    // Event listeners
    btnPlay.addEventListener('click', togglePlay);
    btnNext.addEventListener('click', nextTrack);
    btnPrev.addEventListener('click', prevTrack);

    btnRepeat.addEventListener('click', () => {
        repeatMode = !repeatMode;
        btnRepeat.classList.toggle('active', repeatMode);
    });

    // Toggle player open/close
    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.add('hidden');
        playerBody.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        playerBody.classList.remove('open');
        toggleBtn.classList.remove('hidden');
    });

    // Initialize
    buildPlaylist();
    loadTrack(0);

    // Autoplay after preloader finishes
    function tryAutoplay() {
        playAudio();
    }

    // Wait for user interaction (browsers block autoplay without interaction)
    // Try autoplay immediately, if it fails, play on first click/touch
    setTimeout(() => {
        tryAutoplay();
    }, 2500);

    // Fallback: play on first user interaction if autoplay was blocked
    const startOnInteraction = () => {
        if (!isPlaying) {
            playAudio();
        }
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('touchstart', startOnInteraction);
    };
    document.addEventListener('click', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);
})();

// ============================================
//  COUNTDOWN TIMER — Valentine + Anniversary
// ============================================
(function () {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    const msgEl = document.getElementById('countdown-msg');
    const arrivedEl = document.getElementById('cd-arrived');

    if (!daysEl) return;

    // Dates
    const valentineDate = new Date('2026-02-14T00:00:00').getTime();
    const anniversaryDate = new Date('2027-02-12T00:00:00').getTime();

    // Check if Valentine has arrived
    const isValentine = Date.now() >= valentineDate;

    // Pick the active target
    const target = isValentine ? anniversaryDate : valentineDate;

    // === Update section heading dynamically ===
    if (isValentine) {
        const sectionLabel = document.querySelector('#countdown .section-label');
        const sectionTitle = document.querySelector('#countdown .section-title');
        if (sectionLabel) sectionLabel.textContent = 'Menghitung setiap detik bersama';
        if (sectionTitle) sectionTitle.textContent = 'Menuju Anniversary Kita 💕';
        if (msgEl) msgEl.textContent = 'Setiap detik bersamamu membawa kita semakin dekat ke anniversary pertama kita... 💕';

        // Update the arrived section text for anniversary context
        if (arrivedEl) {
            const arrivedTitle = arrivedEl.querySelector('.cd-arrived-title');
            const arrivedText = arrivedEl.querySelector('.cd-arrived-text');
            const arrivedEmoji = arrivedEl.querySelector('.cd-arrived-emoji');
            if (arrivedEmoji) arrivedEmoji.textContent = '🎉💝🥂';
            if (arrivedTitle) arrivedTitle.textContent = 'Happy Anniversary, Sayang!';
            if (arrivedText) arrivedText.textContent = 'Tepat satu tahun kita bersama! Terima kasih sudah menjadi bagian terindah dalam hidupku. Aku mencintaimu, selamanya. 💕';
        }
    }

    // === Valentine Popup Logic ===
    if (isValentine) {
        const popupOverlay = document.getElementById('valentine-popup');
        const popupCloseBtn = document.getElementById('popup-close-btn');
        const heartsRain = document.getElementById('popup-hearts-rain');

        function showValentinePopup() {
            if (!popupOverlay) return;
            popupOverlay.style.display = 'flex';
            // Trigger entrance animation after a frame
            requestAnimationFrame(() => {
                popupOverlay.classList.add('show');
            });
            // Create mini hearts rain in popup
            if (heartsRain) {
                for (let i = 0; i < 20; i++) {
                    const heart = document.createElement('span');
                    heart.classList.add('popup-mini-heart');
                    heart.textContent = ['💕', '💖', '💝', '♥', '🌹'][Math.floor(Math.random() * 5)];
                    heart.style.left = Math.random() * 100 + '%';
                    heart.style.animationDelay = Math.random() * 3 + 's';
                    heart.style.animationDuration = (2 + Math.random() * 3) + 's';
                    heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
                    heartsRain.appendChild(heart);
                }
            }
        }

        function closeValentinePopup() {
            if (!popupOverlay) return;
            popupOverlay.classList.remove('show');
            setTimeout(() => {
                popupOverlay.style.display = 'none';
            }, 500);
        }

        if (popupCloseBtn) {
            popupCloseBtn.addEventListener('click', closeValentinePopup);
        }
        // Also close on overlay click (outside card)
        if (popupOverlay) {
            popupOverlay.addEventListener('click', (e) => {
                if (e.target === popupOverlay) closeValentinePopup();
            });
        }

        // Show popup after preloader finishes (3s delay)
        setTimeout(showValentinePopup, 3000);
    }

    // === Countdown Tick ===
    function updateValue(el, newVal) {
        const padded = String(newVal).padStart(2, '0');
        if (el.textContent !== padded) {
            el.textContent = padded;
            el.classList.remove('flip');
            void el.offsetWidth; // force reflow
            el.classList.add('flip');
        }
    }

    function tick() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            // Target date arrived!
            updateValue(daysEl, 0);
            updateValue(hoursEl, 0);
            updateValue(minutesEl, 0);
            updateValue(secondsEl, 0);
            if (msgEl) msgEl.style.display = 'none';
            if (arrivedEl) {
                arrivedEl.style.display = 'block';
                arrivedEl.querySelector('.cd-arrived-inner').classList.add('visible');
            }
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        updateValue(daysEl, d);
        updateValue(hoursEl, h);
        updateValue(minutesEl, m);
        updateValue(secondsEl, s);

        requestAnimationFrame(() => setTimeout(tick, 1000));
    }

    tick();
})();

// ============================================
//  LOVE POEM — Typewriter Effect
// ============================================
(function () {
    const poemBody = document.getElementById('poem-body');
    if (!poemBody) return;

    const lines = poemBody.querySelectorAll('.poem-line');
    if (lines.length === 0) return;

    let started = false;
    let currentLine = 0;

    // Store original text and clear all lines
    const lineTexts = [];
    lines.forEach(line => {
        lineTexts.push(line.innerHTML);
        if (line.innerHTML.trim() !== '&nbsp;') {
            line.textContent = '';
        } else {
            line.innerHTML = '&nbsp;';
        }
    });

    function typeNextLine() {
        if (currentLine >= lines.length) return;

        const line = lines[currentLine];
        const text = lineTexts[currentLine];

        // Empty lines (spacers)
        if (text.trim() === '&nbsp;') {
            line.innerHTML = '&nbsp;';
            line.classList.add('typed');
            currentLine++;
            setTimeout(typeNextLine, 300);
            return;
        }

        line.classList.add('typing');
        let charIndex = 0;

        function typeChar() {
            if (charIndex <= text.length) {
                line.textContent = text.substring(0, charIndex);
                charIndex++;
                const speed = 35 + Math.random() * 25; // natural variation
                setTimeout(typeChar, speed);
            } else {
                // Done typing this line
                line.classList.remove('typing');
                line.classList.add('typed');
                line.innerHTML = text; // restore original HTML (for emoji)
                currentLine++;
                setTimeout(typeNextLine, 400);
            }
        }

        typeChar();
    }

    // Start typing when scrolled into view
    const poemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                setTimeout(typeNextLine, 600);
                poemObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    poemObserver.observe(poemBody);
})();

// ============================================
//  WISH UPON A STAR — Interactive Night Sky
// ============================================
(function () {
    const canvas = document.getElementById('stars-canvas');
    const popup = document.getElementById('stars-wish-popup');
    const popupText = document.getElementById('wish-popup-text');
    const popupClose = document.getElementById('wish-popup-close');
    const foundEl = document.getElementById('stars-found');
    const totalEl = document.getElementById('stars-total');

    if (!canvas || !popup) return;

    const ctx = canvas.getContext('2d');
    const wrapper = canvas.parentElement;

    // Wishes to reveal
    const WISHES = [
        "Semoga senyummu tidak pernah pudar, dan hatiku selalu menjadi alasan di baliknya 💕",
        "Aku berdoa, di setiap langkah hidupmu ada kebahagiaan yang tak pernah habis 🌸",
        "Semoga cinta kita tumbuh lebih kuat dari hari ke hari, tanpa batas waktu ∞",
        "Kuharap setiap mimpimu menjadi kenyataan, dan aku ada di sisimu saat itu terjadi ✨",
        "Semoga kita selalu menemukan rumah dalam pelukan satu sama lain 🏠💛",
        "Aku berharap, di setiap kesulitan, kamu selalu ingat bahwa ada aku yang mencintaimu tanpa syarat 🤍",
        "Semoga kita selalu punya alasan untuk tertawa bersama, bahkan di hari terburuk sekalipun 😊",
        "Kuharap detik ini, kamu tahu betapa berharganya kehadiranmu dalam hidupku 💎",
        "Semoga Tuhan selalu menjaga hatimu dan memberikan yang terbaik untukmu 🤲",
        "Aku berdoa kita tetap bersama... selamanya dan selamanya lagi 💕🌟",
    ];

    let starsData = [];
    let found = 0;
    let animFrame;

    function resize() {
        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;
        initStars();
    }

    function initStars() {
        starsData = [];
        const w = canvas.width;
        const h = canvas.height;

        // Background stars (decorative, not clickable)
        for (let i = 0; i < 120; i++) {
            starsData.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.2 + 0.3,
                brightness: Math.random() * 0.5 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                clickable: false,
            });
        }

        // Wish stars (clickable, brighter, larger)
        const usedPositions = [];
        WISHES.forEach((wish, i) => {
            let x, y, tooClose;
            do {
                x = 40 + Math.random() * (w - 80);
                y = 30 + Math.random() * (h - 60);
                tooClose = usedPositions.some(p =>
                    Math.hypot(p.x - x, p.y - y) < 50
                );
            } while (tooClose && usedPositions.length < 20);

            usedPositions.push({ x, y });

            starsData.push({
                x, y,
                r: Math.random() * 2 + 2.5,
                brightness: 0.8,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                clickable: true,
                wishIndex: i,
                discovered: false,
                glowRadius: 0,
            });
        });

        if (totalEl) totalEl.textContent = WISHES.length;
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        starsData.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
            const alpha = star.brightness + twinkle * 0.3;

            ctx.beginPath();

            if (star.clickable) {
                // Larger, glowing wish star
                const glow = star.discovered ? 0.15 : 0.25 + twinkle * 0.1;
                const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 6);
                gradient.addColorStop(0, `rgba(255, 223, 130, ${glow})`);
                gradient.addColorStop(0.5, `rgba(255, 223, 130, ${glow * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.arc(star.x, star.y, star.r * 6, 0, Math.PI * 2);
                ctx.fill();

                // Star core
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                const color = star.discovered
                    ? `rgba(180, 180, 200, ${alpha * 0.4})`
                    : `rgba(255, 230, 160, ${alpha})`;
                ctx.fillStyle = color;
                ctx.fill();

                // Cross sparkle
                if (!star.discovered) {
                    ctx.strokeStyle = `rgba(255, 230, 160, ${alpha * 0.5})`;
                    ctx.lineWidth = 0.5;
                    const sparkleLen = star.r * 2 + twinkle * 2;
                    ctx.beginPath();
                    ctx.moveTo(star.x - sparkleLen, star.y);
                    ctx.lineTo(star.x + sparkleLen, star.y);
                    ctx.moveTo(star.x, star.y - sparkleLen);
                    ctx.lineTo(star.x, star.y + sparkleLen);
                    ctx.stroke();
                }
            } else {
                // Small background star
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 230, ${Math.max(0, alpha)})`;
                ctx.fill();
            }
        });

        animFrame = requestAnimationFrame(draw);
    }

    // Click handler
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);

        for (const star of starsData) {
            if (!star.clickable || star.discovered) continue;

            const dist = Math.hypot(star.x - mx, star.y - my);
            if (dist < star.r * 6) {
                // Found a wish star!
                star.discovered = true;
                found++;
                if (foundEl) foundEl.textContent = found;

                // Show popup
                popupText.textContent = WISHES[star.wishIndex];
                popup.classList.add('show');
                break;
            }
        }
    });

    // Close popup
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            popup.classList.remove('show');
        });
    }

    // Initialize when visible
    const starsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resize();
                draw(0);
                starsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    starsObserver.observe(wrapper);
    window.addEventListener('resize', () => {
        if (canvas.width > 0) resize();
    });
})();

// ============================================
//  BACK TO TOP + DOT NAVIGATION
// ============================================
(function () {
    const backToTop = document.getElementById('back-to-top');
    const dotNav = document.getElementById('dot-nav');

    if (!backToTop || !dotNav) return;

    const dotItems = dotNav.querySelectorAll('.dot-nav-item');
    const sections = [];

    // Gather section elements
    dotItems.forEach(item => {
        const sectionId = item.dataset.section;
        const el = document.getElementById(sectionId);
        if (el) sections.push({ id: sectionId, el, item });
    });

    // Dark sections for color adaptation
    const darkSections = ['stars'];

    function onScroll() {
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('hero')?.offsetHeight || 600;

        // Show/hide back to top
        if (scrollY > heroHeight) {
            backToTop.classList.add('visible');
            dotNav.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
            dotNav.classList.remove('visible');
        }

        // Determine active section
        let activeId = sections[0]?.id || 'hero';
        const viewMiddle = scrollY + window.innerHeight * 0.4;

        for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].el.offsetTop <= viewMiddle) {
                activeId = sections[i].id;
                break;
            }
        }

        // Update active dot
        dotItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === activeId);
        });

        // Check if we're in a dark section
        const inDark = darkSections.some(id => {
            const el = document.getElementById(id);
            if (!el) return false;
            const top = el.offsetTop;
            const bot = top + el.offsetHeight;
            const mid = scrollY + window.innerHeight / 2;
            return mid >= top && mid <= bot;
        });

        dotNav.classList.toggle('in-dark', inDark);
        backToTop.classList.toggle('in-dark', inDark);
    }

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Dot click — smooth scroll
    dotItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(item.dataset.section);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    onScroll(); // initial check
})();
