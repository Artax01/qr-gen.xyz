// optMenu is open when clicked on a card
// the eventListener is in script.js file in Card class in render method
/**
 * Easily create BottomSheetMenu
 */
class BottomSheetMenu {
    constructor(menuId) {
        this.menu = document.createElement('div');
        this.menu.id = menuId;
        this.menu.className = 'bsMenu';

        this.menu.innerHTML = `
            <div class="overlay"></div>
            <div class="bsContent">
                <div class="bsHeader">
                    <div class="drag-icon">
                        <span></span>
                    </div>
                </div>
                <div class="bsBody">
                    <div class="bsInfos"></div>
                    <div class="bsButtons"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.menu);

        this.overlay = this.menu.querySelector('.overlay');
        this.content = this.menu.querySelector('.bsContent');
        this.header = this.menu.querySelector('.bsHeader');
        this.body = this.menu.querySelector('.bsBody');
        this.infosContainer = this.menu.querySelector('.bsInfos');
        this.buttonsContainer = this.menu.querySelector('.bsButtons');

        this.isDragging = false;
        this.startY = 0;
        this.startHeight = 55; // must change this in the future

        this.setHeight(0);
        this.bindEvents();
    }

    bindEvents() {
        const dragStart = (e) => {
            this.isDragging = true;
            this.menu.classList.add('dragging');
            this.startY = e.pageY || e.touches?.[0].pageY;
            this.startHeight = parseInt(this.content.style.height) || this.originalHeight;
        };

        const dragging = (e) => {
            if (!this.isDragging) return;
            let delta = this.startY - (e.pageY || e.touches?.[0].pageY);
            let newHeight = this.startHeight + (delta / window.innerHeight) * 100;
            this.setHeight(newHeight);
        };

        const dragStop = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.menu.classList.remove('dragging');

            let menuHeight = parseInt(this.content.style.height) <55 ? this.hide() : this.setHeight(this.startHeight);
        }

        this.menu.addEventListener('mousedown', dragStart);
        this.menu.addEventListener('mousemove', dragging);
        this.menu.addEventListener('mouseup', dragStop);
        this.menu.addEventListener('touchstart', dragStart);
        this.menu.addEventListener('touchmove', dragging);
        document.addEventListener('touchend', dragStop);
        this.overlay.addEventListener('click', () => this.hide());
    }

    setHeight(height) {
        this.content.style.height = `${height}vh`;
    }

    setInfos(htmlContent) {
        this.infosContainer.innerHTML = htmlContent;
    }

    addButton(label, callback, options={}) {
        const button = document.createElement('div');
        button.id = options.id || '';
        button.className = options.className || '';

        button.innerHTML = `<p>${label}</p>`;
        button.addEventListener('click', callback);
        this.buttonsContainer.appendChild(button);
    }

    clearInfos() {
        this.infosContainer.innerHTML = '';
    }

    clearButtons() {
        this.buttonsContainer.innerHTML = '';
    }

    show() {
        this.menu.classList.add('active');
        setTimeout(() => {
            this.setHeight(this.startHeight);
        }, 300)
    }

    hide() {
        this.menu.classList.remove('active');
        let cardMenu = document.getElementById(this.menu.id);
        setTimeout(() => {
            cardMenu.remove();
        }, 500);
    }
}