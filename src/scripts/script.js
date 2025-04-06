const fileSelectButton  = document.getElementById('fileSelectButton'); // file import button
const hiddenFileInput = document.getElementById('hiddenFileInput');
const messageInput = document.getElementById('messageInput'); // text field for qrcode value
const generateButton = document.getElementById('generateButton'); // generate qrcode based on the input value
const statusMsg = document.getElementById('status-msg');
const qrcodeContainer = document.getElementById('qrcode');
const container = document.getElementById('card-container'); // card container inside qrcode block
const optImage = document.getElementById('optImage');
const optName = document.getElementById('optName');
const optDate = document.getElementById('optDate');
const downloadButton = document.getElementById('downloadBtn');

/**detect if the client is desktop or mobile to adapt the app
the app is based on this limit (mobile <= 800px > desktop)*/
let containerHeight = container.clientHeight; // height of the qrcode container
let containerWidth = container.clientWidth; // width of the qrcode container
let currentUserDevice = detectDevice(); // current user device (mobile or desktop)
let activeCard = null; // current active card (the one that is clicked)

function detectDevice() {
  return window.screen.width <= 800 ? 'mobile' : 'desktop';
}

function adjustUI() {
    //check if the height and width of the qrcode container change
    const navbarHeight = document.querySelector('.navbar').clientHeight;
    qrcodeContainer.style.height = detectDevice() === 'mobile' ? `calc(100vh - ${navbarHeight}px - ${document.querySelector('#search').clientHeight}px)` : `calc(100vh - ${navbarHeight}px)`;
    currentUserDevice = detectDevice();
}

window.addEventListener('resize', () => {
    if (detectDevice() !== currentUserDevice) {
        adjustUI();
    }
});

adjustUI();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
    document.documentElement.classList.toggle('dark_theme', matches);
});

resetInput();







/**
 * @name Card
 * @description Create card that contain generated qrcode
 * @function getCurrentTime
 * @function getCurrentDate
 * @function getQR
 * @function updateSize
 * @function downloadQR
 * @function render render the generated QRCode
 */
class Card {
    constructor(id, text) {
        this.id = id;
        this.text = text || messageInput.value.trim();
        this.time = this.getCurrentTime();
        this.date = this.getCurrentDate();
        this.card = this.render();
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
  
    getQR() {
        const imageContainer = this.card.querySelector('#image');

        if (!this.text) {
            alert('Please enter a value to generate a qrcode.');
            return;
        }

        new genQR(imageContainer, this.text, 128);
        this.updateSize();

        let i = document.getElementById('stats_counter');
        i.innerText = parseInt(i.innerText) + 1;
    }


    updateSize() {
        setTimeout(() => {
            const qrCodeImage = this.card.querySelector('.img_container img').src;
            fetch(qrCodeImage).then(response => response.blob()).then(blob => {
                this.size = findUnit(blob.size);
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
        const newCard = document.getElementById('card').cloneNode(true);

        newCard.id = String(`card${this.id}`);
        newCard.querySelector('#text').innerText = this.text;
        newCard.querySelector('#date_time').innerText = String(`${this.time}`);
        container.insertBefore(newCard, container.firstChild);
        newCard.classList.add('visible');

        newCard.addEventListener('click', () => {
            activeCard = this;

            const imageHTML = newCard.querySelector('.img_container').innerHTML;
            optImage.innerHTML = imageHTML;
            optName.innerText = this.text;
            optDate.innerText = `${this.time}, ${this.date}`;
            optMenu.classList.add('active');
        });

        return newCard;
    }
}




/**
 * @name CardContainer
 * @description Container for generated qrcode classes instance
 * @function addCard
 * @function updateStatus
 */
class CardContainer {
  constructor() {
    this.cardList = [];
  }

  addCard() {
    if (!messageInput.value.trim()) {
        alert('Please enter a value to generate a qrcode.');
        return;
    }

    const newCard = new Card(this.cardList.length);
    this.cardList.push(newCard);
    resetInput();
    this.updateStatus();
  }

  updateStatus() {
    if (this.cardList.length === 0) {
        statusMsg.classList.remove('active');
        statusMsg.innerText = "No QRCode generated yet.";
        qrcodeContainer.classList.remove('active');
        container.classList.remove('visible');
    } else {
        statusMsg.classList.add('active');
        statusMsg.innerText = "Layer";
        qrcode.classList.add('active');
        container.classList.add('visible');
    }
  }
}

const cardContainer = new CardContainer();



                                                                                                                                              
                                                                                                                                                      

messageInput.addEventListener('input', function () {
    generateButton.style.display = messageInput.value ? "flex" : "none";
});

messageInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        cardContainer.addCard();
    }
});

hiddenFileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        resetInput();
        messageInput.value = file.name;
        cardContainer.addCard();
    }
});

fileSelectButton.addEventListener('click', (event) => {
  event.preventDefault();
  hiddenFileInput.click();
});

generateButton.addEventListener('click', () => {
    cardContainer.addCard();
});

downloadButton.addEventListener('click', () => {
    if (activeCard) {
        activeCard.downloadQR();
    } else {
        alert('Please select a QRCode to download.');
    }
});

// deleteButton.addEventListener('click', () => {
//     if (activeCard) {
//         activeCard.card.remove();
//         cardContainer.cardList = cardContainer.cardList.filter(card => card !== activeCard);
//         activeCard = null;
//         resetInput();
//         cardContainer.updateStatus();
//     } else {
//         alert('Please select a QRCode to delete.');
//     }
// });



/**
 * @name resetInput
 * @description reset the input field value
 */                                                                                                                                           
function resetInput() {
  messageInput.value = "";
  hiddenFileInput.value = "";
  generateButton.style.display = "none";
  messageInput.style.borderRadius = `10px`;
}

/**
 * @name findUnit
 * @description find the unit of the generated QRCode size
 * @param size  the size in bits of the QRCode
 */
function findUnit(size) {
    const units = Object.freeze(["B", "KB", "MB", "GB", "TB"]);
    let k = 0;
    while (size >= 1000) {
        size/=1000;
        k++;
    }
    return `${size.toFixed(2)} ${units[k]}`;
}

// function findMonth(nb) {
//     const months = ["January", "Febuary", "March", "April", "Mai", "June", "July", "August", "September", "October", "November", "December"];
//     return String(months[nb]);
// }