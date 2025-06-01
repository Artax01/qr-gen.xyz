class Root {
    constructor() {}
    
    /**detect if the client is desktop or mobile to adapt the app
     * the app is based on this limit (mobile <= 800px > desktop)*/
    static detectDevice() {
        return window.screen.width <= 800 ? 'mobile' : 'desktop';
    }

    static isHome() {
        let path = window.location.pathname.split('/');
        return (path.pop() === "index.html" || path.join('') === "qr-gen.xyz") ? true : false;
    }

    static isOnDesktop() {
        return Root.detectDevice() === 'desktop';
    }

    static isOnMobile() {
        return Root.detectDevice() === 'mobile';
    }

    static resetInput(messageInput, hiddenFileInput, generateButton) {
        if (messageInput && messageInput !== null) {
            messageInput.value = "";
        }
        if (hiddenFileInput && hiddenFileInput !== null) {
            hiddenFileInput.value = "";
        }
        if (generateButton && generateButton !== null) {
            generateButton.style.opacity = 0.4;
        }
    }

    static findUnit(size) {
        const units = Object.freeze(["B", "KB", "MB", "GB", "TB"]);
        let k = 0;
        while (size >= 1000) {
            size/=1000;
            k++;
        }
        return `${size.toFixed(2)} ${units[k]}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const burger_menu = document.getElementById('burger-menu');
    const darkMode = document.getElementById('darkMode');
    const side_menu = document.getElementById('side_menu');
    const _blur = document.getElementById('blur');
    
    let currentUserDevice = Root.detectDevice(); // current user device (mobile or desktop)

    document.documentElement.classList.toggle('dark_theme', window.matchMedia('(prefers-color-scheme: dark)').matches);
            
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
        document.documentElement.classList.toggle('dark_theme', matches);
    });

    function adjustUI() {
        if (Root.isHome()) {
            const qrcodeContainer = document.getElementById('qrcode');
            const search = document.getElementById('search');
            qrcodeContainer.style.height = `calc(100vh - ${document.querySelector('.navbar').clientHeight}px - ${search.clientHeight}px)`;
            if (Root.isOnMobile()) {
                search.style.display = 'none';
            } else {
                search.style.display = 'flex';
            }
        }
        // updateOnResize;

        currentUserDevice = Root.detectDevice();
    }

    window.addEventListener('resize', () => {
        if (Root.detectDevice() !== currentUserDevice) {
            adjustUI();
        }
    });

    adjustUI();

    // SIDE MENU PART

    if (burger_menu && side_menu && _blur) {
        burger_menu.addEventListener('click', function () {
            burger_menu.classList.toggle('active');
            side_menu.classList.toggle('active');
            _blur.classList.toggle('active');
        });
        _blur.addEventListener('click', function () {
            burger_menu.classList.toggle('active');
            side_menu.classList.toggle('active');
            _blur.classList.toggle('active');
        });
    }
    if (darkMode) {
        darkMode.addEventListener('click', function () {
            document.querySelector(':root').classList.toggle('dark_theme');
            darkMode.classList.toggle('active');
        });
    }
});