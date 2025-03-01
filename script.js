let papers = document.querySelectorAll('.paper');
let highestZ = papers.length;
let clickCount = 0;  // Track number of clicks
let activeIntervals = [];  // Track active heart showers

// Add confetti function
function createConfetti() {
    const colors = ['#ff718d', '#fdff6a', '#7afcff', '#ff7c7c'];
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Spread confetti across the screen
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.top = '-20px';
        
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Create confetti when page loads with 2 second delay
window.addEventListener('load', () => {
    // First wave after 2 seconds
    setTimeout(() => {
        createConfetti();
        // Second wave 500ms after first wave
        setTimeout(createConfetti, 500);
    }, 2000);  // 2000ms = 2 seconds
});

// Add love shower function
function createLoveShower() {
    const heartColors = [
        { emoji: ['❤️', 'babu'], count: 40 },    // Red hearts with babu
        { emoji: ['🤍', 'babu'], count: 40 },    // White hearts with babu
        { emoji: ['💗', 'babu'], count: 40 },    // Pink hearts with babu
        { emoji: ['💚', 'babu'], count: 40 },    // Green hearts with babu
        { emoji: ['💜', 'babu'], count: 40 },    // Purple hearts with babu
        { emoji: ['💛', 'babu'], count: 40 }     // Yellow hearts with babu
    ];

    // Start a new continuous shower for the current color
    if (clickCount < heartColors.length) {
        const currentSet = heartColors[clickCount];
        const interval = setInterval(() => {
            // Randomly choose between heart and text
            const content = Math.random() > 0.5 ? currentSet.emoji[0] : currentSet.emoji[1];
            createEmoji([content], (Math.random() * 2 + 2) + 's');
        }, 200);
        
        activeIntervals.push(interval);
        
        if (clickCount === heartColors.length - 1) {
            setTimeout(() => {
                activeIntervals.forEach(interval => clearInterval(interval));
                activeIntervals = [];
                clickCount = 0;
            }, 5000);
        }
        
        clickCount++;
    }
}

// Add collision detection function
function checkCollision(heart, paper) {
    const heartRect = heart.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();
    
    return !(heartRect.right < paperRect.left || 
             heartRect.left > paperRect.right || 
             heartRect.bottom < paperRect.top || 
             heartRect.top > paperRect.bottom);
}

function createEmoji(emojiArray, duration) {
    const love = document.createElement('div');
    love.className = 'love-emoji';
    const content = emojiArray[Math.floor(Math.random() * emojiArray.length)];
    love.innerHTML = content;
    love.style.left = Math.random() * 100 + 'vw';
    love.style.animationDuration = duration;
    // Adjust size based on content type
    love.style.fontSize = content === 'babu' ? '18px' : (Math.random() * 30 + 25) + 'px';
    // Add special styling for text
    if (content === 'babu') {
        love.style.color = '#ff89a0';
        love.style.fontFamily = "'Homemade Apple', cursive";
    }
    document.body.appendChild(love);

    setTimeout(() => love.remove(), 4000);
}

// Add click handler for senkae paper instead of heart paper
const senkaePaper = document.querySelector('.paper.senkae');
if (senkaePaper) {
    senkaePaper.addEventListener('click', createLoveShower);
    senkaePaper.addEventListener('touchstart', (e) => {
        e.preventDefault();
        createLoveShower();
    });
}

papers.forEach((paper, index) => {
    paper.style.zIndex = index + 1;
    
    const startDrag = (e) => {
        // Only check for senkae paper now
        if (paper.classList.contains('senkae')) {
            return;
        }

        e.preventDefault();
        const event = e.touches ? e.touches[0] : e;
        
        highestZ += 1;
        paper.style.zIndex = highestZ;
        paper.classList.add('dragging');

        let shiftX = event.clientX - paper.getBoundingClientRect().left;
        let shiftY = event.clientY - paper.getBoundingClientRect().top;

        paper.style.transform = 'none';
        paper.style.position = 'absolute';

        function moveAt(pageX, pageY) {
            paper.style.left = pageX - shiftX + 'px';
            paper.style.top = pageY - shiftY + 'px';
        }

        moveAt(event.pageX, event.pageY);

        function onMove(e) {
            const moveEvent = e.touches ? e.touches[0] : e;
            moveAt(moveEvent.pageX, moveEvent.pageY);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });

        const endDrag = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            paper.classList.remove('dragging');
        };

        paper.onmouseup = endDrag;
        paper.ontouchend = endDrag;
    };

    // Only add drag listeners to non-senkae papers
    if (!paper.classList.contains('senkae')) {
        paper.addEventListener('mousedown', startDrag);
        paper.addEventListener('touchstart', startDrag, { passive: false });
        paper.ondragstart = function() {
            return false;
        };
    }
}); 