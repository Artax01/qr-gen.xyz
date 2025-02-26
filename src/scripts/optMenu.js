    // optMenu is open when clicked on a card
    // the eventListener is in script.js file in CardContainer class
    
    var optMenu = document.getElementById('optMenu');
    var overlay = document.querySelector('.overlay');
    var optContent = document.querySelector('.optContent');
    const originalHeight = parseInt(optContent.style.height);

    let isDragging = false, startY, startHeight;

    let updateHeight = (height) => {
        optContent.style.height = `${height}vh`;
    };

    // export function fupdateHeight (height) {
    //     updateHeight(height);
    // };

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

        menuHeight < 55 ? hideOptMenu() : menuHeight > 65 ? updateHeight(55) : updateHeight(55);
    };


    // updateHeight(95);
    // optContent.style.height = 'fit-content';
    // updateHeight(originalHeight);
    optMenu.addEventListener('mousedown', dragStart);
    optMenu.addEventListener('mousemove', dragging);
    optMenu.addEventListener('mouseup', dragStop);

    optMenu.addEventListener('touchstart', dragStart);
    optMenu.addEventListener('touchmove', dragging);
    document.addEventListener('touchend', dragStop);

    overlay.addEventListener('click', hideOptMenu);