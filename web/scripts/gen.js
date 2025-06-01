document.addEventListener('DOMContentLoaded', () => {

let activeCard = null;
let messageInput = document.getElementById('messageInput');
const generateButton = document.getElementById('generateButton');
Root.resetInput(messageInput, null, generateButton);


function generateQRCode(options = {}) {
    const container = Root.isHome() ? cardContainer.addCard(options) : document.querySelector("#image");
    if (container && !Root.isHome()) new Card().getQR(container);
}

/**
 * @name Card
 * @description Create card that contain generated qrcode
 * @method getCurrentTime
 * @method getCurrentDate
 * @method getQR
 * @method updateSize
 * @method downloadQR
 * @method render render the generated QRCode
*/
class Card {
    constructor(id, options = {}) {
        this.id = id;
        this.text = messageInput.value.trim();
        this.time = this.getCurrentTime();
        this.date = this.getCurrentDate();
        this.card = this.render();
        this.menu = null;
        this.colorLight = options.colorLight || "#FFFFFF";
        this.colorDark = options.colorDark || "#000000";
        this.getQR();
    }

    getCurrentTime() {
        const now = new Date();
        return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    getCurrentDate() {
        const now = new Date();
        return `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
    }
  
    getQR(container) {
        if (!container || container === null) {
            if (Root.isHome()) {
                container = this.card.querySelector('#image');
            } else {
                return;
            }
        }
        if (!this.text) {
            alert('Please enter a value to generate a qrcode.');
            return;
        }

        container.innerHTML = "";
        new QRCode(container, { text: this.text, width: 128, height: 128, colorLight: this.colorLight, colorDark: this.colorDark });

        if (Root.isHome()) { this.updateSize(); }

        messageInput.value = "";
        container.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    updateSize() {
        setTimeout(() => {
            const qrCodeImage = this.card.querySelector('.img_container img').src;
            fetch(qrCodeImage).then(response => response.blob()).then(blob => {
                this.size = Root.findUnit(blob.size);
                this.card.querySelector('#size').innerText = this.size;
            });
        },100);
    }

    downloadQR() {
        setTimeout(() => {
            const qrCodeImage = this.card.querySelector('.img_container img').src;
            fetch(qrCodeImage).then(response => response.blob()).then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = this.text;
                link.click();
                URL.revokeObjectURL(link.href);
            });
        }, 100);

        let i = document.getElementById('stats_download');
        i.innerText = parseInt(i.innerText) + 1;
    }

    render() {
        if (!Root.isHome()) return;

        const newCard = document.getElementById('card').cloneNode(true);
        const container = document.getElementById('card-container');

        newCard.id = String(`card${this.id}`);
        newCard.querySelector('#text').innerText = this.text;
        newCard.querySelector('#date_time').innerText = String(`${this.time}`);
        container.insertBefore(newCard, container.firstChild);
        newCard.classList.add('visible');

        newCard.addEventListener('click', () => {
            activeCard = this;

            this.menu = new BottomSheetMenu(`cardMenu`, { height: 65 });
            let image = this.card.querySelector('.img_container').innerHTML;
            this.menu.setInfos(`
                <div id="bsImage" class="bsImage unselectable">${image}</div>
                <div class="bsTextInfos">
                    <div id="bsName"></div>
                    <div id="bsDate">${this.time}, ${this.date}</div>
                </div>
            `);
            this.menu.menu.querySelector('#bsName').innerText = this.text;
            this.menu.addButton('Download', () => { this.downloadQR(); }, { className: 'primaryBtn' });
            this.menu.addButton('Delete', () => { cardContainer.removeCard(this.id); }, { className: 'secondaryBtn' });
            this.menu.show();
        });

        return newCard;
    }
}

/**
 * @name CardContainer
 * @description Container for generated qrcode classes instance
 * @method addCard
 * @method updateStatus
 */
class CardContainer {
    constructor() {
        this.cardList = [];
    }
  
    addCard(options = {}) {
        if (!messageInput.value.trim()) {
            alert('Please enter a value to generate a qrcode.');
            return;
        }
  
        const newCard = new Card(this.cardList.length, options);
        this.cardList.push(newCard);
        Root.resetInput(messageInput, null, null);
        this.updateStatus();

        let i = document.getElementById('stats_counter');
        i.innerText = parseInt(i.innerText) + 1;
    }

    removeCard(index) {
        const card = document.getElementById(`card${index}`);

        if (card) {
            card.remove();
            let removedCard = this.cardList.splice(index, 1);
            removedCard[0]["menu"].hide();
            this.updateStatus();

            let i = document.getElementById('stats_counter');
            i.innerText = parseInt(i.innerText) - 1;
        } else {
            alert("This card doesn't exist so it can't be delete!");
        }

    }
  
    updateStatus() {
        const container = document.getElementById('card-container');
        const qrcodeContainer = document.getElementById('qrcode');

        if (this.cardList.length === 0) {
            qrcodeContainer.classList.remove('active');
            container.classList.remove('visible');
        } else {
            qrcodeContainer.classList.add('active');
            container.classList.add('visible');
        }
    }
}










const cardContainer = new CardContainer();

const updateOnResize = () => {
    if (Root.isOnDesktop() && Root.isHome()) {
        messageInput.addEventListener("click", selectionMenu);

        const fileSelectButton  = document.getElementById('fileSelectButton'); // file import button
        const hiddenFileInput = document.getElementById('hiddenFileInput');

        hiddenFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                Root.resetInput(messageInput, hiddenFileInput, null);
                messageInput.value = file.name;
                cardContainer.addCard();
            }
        });
        
        fileSelectButton.addEventListener('click', (event) => {
            event.preventDefault();
            hiddenFileInput.click();
        });
    }
    else if (Root.isHome() && Root.isOnMobile()) {
        document.getElementById('createNewBtn').addEventListener('click', selectionMenu);
        selectionMenu();
    }
    
    if (!Root.isHome() || (Root.isOnDesktop() && Root.isHome())) {
        messageInput.addEventListener("input", () => {
            if (messageInput.value.trim().length === 0) {
                generateButton.style.opacity = 0.4;
            } else {
                generateButton.style.opacity = 1;
            }
        });

        messageInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                if (messageInput.value.trim().length > 0) {
                    generateQRCode();
                }
            }
        });

        generateButton.addEventListener("click", () => {
            if (messageInput.value.trim().length > 0) {
                generateQRCode();
            }
        });
    }
}

updateOnResize();











// =======================================================================
// ============================ BottomSheet Menu ==============================
// =======================================================================



function selectionMenu () {
    const selectionMenu = new BottomSheetMenu('selectionMenu', { height: 40 });
    selectionMenu.setTitle('Selection Menu');
    selectionMenu.setCaption('Choose what you want to generate.');
    selectionMenu.setInfos(`
        <div id="QRChoice">
            <img id="QRCodePreview" src="./assets/template_qrcode.jpg" alt=""></img>
            <div>Generate a new personalized QRCode -></div>
        </div>
    `);
    selectionMenu.addButton('Back', () => { selectionMenu.hide(); }, { className: 'secondaryBtn'});
    selectionMenu.addEventListener('QRChoice', 'click', createQRMenu);
    selectionMenu.show();
}

function createQRMenu() {
    const createQRMenu = new BottomSheetMenu('createQRMenu', { height: 99 });
    createQRMenu.setTitle('Create QRCode');
    createQRMenu.setCaption('Personalize your QRCode.');
    createQRMenu.setInfos(`
        <div id="bsImage" class="bsImage unselectable"></div>
        <p class="unselectable" style="opacity: 0.4; font-size: 0.8em; font-style: italic; text-align:center;">
            Please consider that when you change QRCode color, the QRCode can become unreadable ! 
            Especially when you change more than one color ! 
            (The constract must be high).
        </p>
        <div id="bsTextInfos">
            <div id="colorPicker" class="colorPicker">
                <div class="colorPickerContainer">
                    <p class="unselectable">ColorDark</p>
                    <input type="color" id="colorDark" value="#000000" class="colorInput">
                </div>
                <div class="colorPickerContainer">
                    <p class="unselectable">ColorLight</p>
                    <input type="color" id="colorLight" value="#FFFFFF" class="colorInput">
                </div>
            </div>
        </div>
        <div>
            <input id="messageInput" type="text" placeholder="Enter text or URL here...">
        </div>
    `);

    messageInput = createQRMenu.menu.querySelector('#messageInput');
    let colorDark = createQRMenu.menu.querySelector('#colorDark');
    let colorLight = createQRMenu.menu.querySelector('#colorLight');
    let container = document.getElementById('createQRMenu').querySelector('#bsImage');
    
    createQRMenu.addButton('Generate', () => { generateQRCode({ colorLight: colorLight.value, colorDark: colorDark.value }); createQRMenu.hide(); document.getElementById('selectionMenu').remove(); }, { id: "generateButton", className: "primaryBtn",  disabled: true });
    createQRMenu.addButton('Back', () => { createQRMenu.hide(); }, { className: 'secondaryBtn'});

    function generate() {
        container.innerHTML = "";
        if (messageInput.value.trim().length === 0) new QRCode(container, { text: " ", width: 128, height: 128, colorDark: colorDark.value, colorLight: colorLight.value });
        else new QRCode(container, { text: messageInput.value.trim(), width: 128, height: 128, colorDark: colorDark.value, colorLight: colorLight.value });
    }
    let timeout;
    createQRMenu.addEventListener('messageInput', 'input', () => {
        let generateButton = createQRMenu.menu.querySelector('#generateButton');
            if (messageInput.value.trim().length === 0) {
                generateButton.style.opacity = 0.4;
                generateButton.style.pointerEvents = 'none';
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => { generate(); }, 400);
                generateButton.style.opacity = 1;
                generateButton.style.pointerEvents = 'auto';
            }
    });

    createQRMenu.addEventListener('colorLight colorDark', 'change', () => { 
        clearTimeout(timeout);
        timeout = setTimeout(() => { generate(); }, 400);
    });
    generate();
    createQRMenu.show();
}
});