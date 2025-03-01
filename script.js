let papers = document.querySelectorAll('.paper');
let highestZ = papers.length;

papers.forEach((paper, index) => {
    // Set initial z-index
    paper.style.zIndex = index + 1;
    
    const startDrag = (e) => {
        e.preventDefault();
        const event = e.touches ? e.touches[0] : e;
        
        // Bring paper to front when dragging
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

    paper.addEventListener('mousedown', startDrag);
    paper.addEventListener('touchstart', startDrag, { passive: false });
    
    paper.ondragstart = function() {
        return false;
    };
}); 