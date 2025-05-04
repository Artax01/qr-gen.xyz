// optMenu is open when clicked on a card
// the eventListener is in script.js file in Card class in render method
/**
 * Easily create BottomSheetMenu
 */
class BottomSheetMenu {
    constructor(menuId, options = {}) {
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
                    <div class="bsLabel">
                        <div class="bsTitle"></div>
                        <div class="bsCaption"></div>
                    </div>
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
        this.label = this.menu.querySelector('.bsLabel');
        this.infosContainer = this.menu.querySelector('.bsInfos');
        this.buttonsContainer = this.menu.querySelector('.bsButtons');

        this.isDragging = false;
        this.startY = 0;
        this.startHeight = options.height || 55; // must change this in the future

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

            let menuHeight = parseInt(this.content.style.height) < 55 ? this.hide() : this.setHeight(this.startHeight);
        }

        this.header.addEventListener('mousedown', dragStart);
        this.header.addEventListener('mousemove', dragging);
        this.header.addEventListener('mouseup', dragStop);
        this.header.addEventListener('touchstart', dragStart);
        this.header.addEventListener('touchmove', dragging);
        document.addEventListener('touchend', dragStop);
        this.overlay.addEventListener('click', () => this.hide());
    }

    setHeight(height) {
        this.content.style.height = `${height}vh`;
    }

    setTitle(title) {
        const el = document.createElement('div');
        el.id = 'bsTitle';
        el.className = 'unselectable';
        el.textContent = title;
        this.label.appendChild(el);
    }

    setCaption(caption) {
        const el = document.createElement('div');
        el.id = 'bsCaption';
        el.className = 'unselectable';
        el.textContent = caption;
        this.label.appendChild(el);
    }

    setInfos(htmlContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
    
        const elementsWithSrc = tempDiv.querySelectorAll('[src]');
        elementsWithSrc.forEach(element => {
            const src = element.getAttribute('src');
    
            if (src && src.startsWith('data:') && !src.startsWith('data:image/')) {
                element.setAttribute('src', '_NOT_VALID_URI_');
            }
        });
    
        const filtered = tempDiv.innerHTML.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                                                .replace(/\bon\w+="[^"]*"/gi, '')
                                                .replace(/\bon\w+='[^']*'/gi, '')
                                                .replace(/\bon\w+=\s*`[^`]*`/gi, '')
                                                .replace(/javascript:/gi, '')
                                                .replace(/vbscript:/gi, '')
                                                .replace(/\s(src|href)="javascript:[^"]*"/gi, '');
        this.infosContainer.innerHTML = filtered;
    }

    addButton(label, callback, options={}) {
        const button = document.createElement('div');
        button.id = options.id || '';
        button.className = options.className || '';
        button.style = options.style || '';

        if (options.disabled) {
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.4';
        }

        const el = document.createElement('p');
        el.textContent = label;
        button.appendChild(el);
        button.addEventListener('click', callback);
        this.buttonsContainer.appendChild(button);
    }

    addEventListener(id, event, callback) {
        let iDs = id.split(' ');

        for (let i = 0; i < iDs.length; i++) {
            const element = this.infosContainer.querySelector(`#${iDs[i]}`);
            if (element) {
                element.addEventListener(event, callback);
            } else {
                console.error(`Element with id ${iDs[i]} not found`);
            }
        }
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