document.addEventListener('DOMContentLoaded', function () {
    // optMenu is open when clicked on a card
    // the eventListener is in script.js file in CardContainer class
    
    var optMenu = document.getElementById('optMenu');
    var overlay = document.querySelector('.overlay');
    var optContent = document.querySelector('.optContent');

    let isDragging = false, startY, startHeight;

    let updateHeight = (height) => {
        optContent.style.height = `${height}vh`;
    };

    let hideOptMenu = () => {
        optMenu.classList.remove('active');
    };

    let dragStart = (e) => {
        isDragging = true;
        optMenu.classList.add('dragging');

        startY = e.pageY || e.touches?.[0].pageY;
        startHeight = parseInt(optContent.style.height);
    };

    let dragging = (e) => {
        if (!isDragging) return;
        
        let delta = startY - (e.pageY || e.touches?.[0].pageY);
        let newHeight = startHeight + (delta / window.innerHeight) * 100;
    
        updateHeight(newHeight);
    };

    let dragStop = () => {
        isDragging = false;
        optMenu.classList.remove('dragging');

        let menuHeight = parseInt(optContent.style.height);

        menuHeight < 50 ? hideOptMenu() : menuHeight > 65 ? updateHeight(95) : updateHeight(95);
    };


    updateHeight(95);
    optMenu.addEventListener('mousedown', dragStart);
    optMenu.addEventListener('mousemove', dragging);
    optMenu.addEventListener('mouseup', dragStop);

    optMenu.addEventListener('touchstart', dragStart);
    optMenu.addEventListener('touchmove', dragging);
    document.addEventListener('touchend', dragStop);

    overlay.addEventListener('click', hideOptMenu);
});