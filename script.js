let papers = document.querySelectorAll('.paper');
let highestZ = papers.length;

papers.forEach((paper, index) => {
    // Set initial z-index in reverse order
    paper.style.zIndex = index + 1;
    
    paper.addEventListener('mousedown', function(e) {
        // Bring to front
        highestZ += 1;
        paper.style.zIndex = highestZ;
        paper.classList.add('dragging');
        
        let shiftX = e.clientX - paper.getBoundingClientRect().left;
        let shiftY = e.clientY - paper.getBoundingClientRect().top;

        // Remove the transform when dragging
        paper.style.transform = 'none';
        paper.style.position = 'absolute';

        function moveAt(pageX, pageY) {
            paper.style.left = pageX - shiftX + 'px';
            paper.style.top = pageY - shiftY + 'px';
        }

        moveAt(e.pageX, e.pageY);

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        paper.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            paper.classList.remove('dragging');
            paper.onmouseup = null;
        };
    });

    paper.ondragstart = function() {
        return false;
    };
}); 