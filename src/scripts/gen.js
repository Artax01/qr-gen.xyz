document.addEventListener('DOMContentLoaded', () => {

const root = new AppTools();
let activeCard = null; // current active card (the one that is clicked)
root.resetInput(messageInput, null, generateButton);


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

if (root.isHome()) {
    const fileSelectButton  = document.getElementById('fileSelectButton'); // file import button
    const hiddenFileInput = document.getElementById('hiddenFileInput');
    // const downloadButton = document.getElementById('downloadBtn');
    // const deleteButton = document.getElementById('deleteBtn');

    hiddenFileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            root.resetInput(messageInput, hiddenFileInput, null);
            messageInput.value = file.name;
            cardContainer.addCard();
        }
    });
    
    fileSelectButton.addEventListener('click', (event) => {
      event.preventDefault();
      hiddenFileInput.click();
    });

    // downloadButton.addEventListener('click', () => {
    //     if (activeCard) {
    //         activeCard.downloadQR();
    //     } else {
    //         alert('Please select a QRCode to download.');
    //     }
    // });

    // deleteButton.addEventListener('click', () => {
    //     if (activeCard) {
    //         // activeCard.deleteQR();
    //         cardContainer.removeCard(activeCard.id);
    //     } else {
    //         alert('Please select a QRCode to delete.');
    //     }
    // });
}

function generateQRCode() {
    if (root.isHome()) {
        cardContainer.addCard();
    } else {
        const container = document.querySelector("#image");
        new Card().getQR(container);
    }
}

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
    constructor(id) {
        this.id = id;
        this.text = messageInput.value.trim();
        this.time = this.getCurrentTime();
        this.date = this.getCurrentDate();
        this.card = this.render();
        this.menu = null;
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
  
    getQR(imageContainer) {
        if (!imageContainer || imageContainer === null) {
            if (root.isHome()) {
                imageContainer = this.card.querySelector('#image');
            } else {
                return;
            }
        }
        if (!this.text) {
            alert('Please enter a value to generate a qrcode.');
            return;
        }

        imageContainer.innerHTML = "";
        new QRCode(imageContainer, { text: this.text, width: 128, height: 128 });

        if (root.isHome()) {
            this.updateSize();
        }

        messageInput.value = "";
        generateButton.style.opacity = 0.4;
        imageContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    updateSize() {
        setTimeout(() => {
            const qrCodeImage = this.card.querySelector('.img_container img').src;
            fetch(qrCodeImage).then(response => response.blob()).then(blob => {
                this.size = root.findUnit(blob.size);
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
        if (!root.isHome()) {
            return;
        }

        const newCard = document.getElementById('card').cloneNode(true);
        const container = document.getElementById('card-container');

        newCard.id = String(`card${this.id}`);
        newCard.querySelector('#text').innerText = this.text;
        newCard.querySelector('#date_time').innerText = String(`${this.time}`);
        container.insertBefore(newCard, container.firstChild);
        newCard.classList.add('visible');

        newCard.addEventListener('click', () => {
            activeCard = this;

            // const imageHTML = newCard.querySelector('.img_container').innerHTML;
            // optImage.innerHTML = imageHTML;
            // optName.innerText = this.text;
            // optDate.innerText = `${this.time}, ${this.date}`;
            // optMenu.classList.add('active');

            this.menu = new BottomSheetMenu(`cardMenu`); // no necassary to pass the id because it can have only one menu open at once
            let image = document.getElementById(`card${this.id}`).querySelector('.img_container').innerHTML;
            this.menu.setInfos(`
                <div id="bsImage" class="bsImage unselectable">${image}</div>
                <div class="bsTextInfos">
                    <div id="bsName">${this.text}</div>
                    <div id="bsDate">${this.time}, ${this.date}</div>
                </div>
            `);
            this.menu.addButton('Download', () => { this.downloadQR(); }, { id: 'downloadBtn' });
            this.menu.addButton('Delete', () => { cardContainer.removeCard(this.id); }, { id: 'deleteBtn' });
            this.menu.show();
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
        root.resetInput(messageInput, null, generateButton);
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
        // const statusMsg = document.getElementById('status-msg');

        
        if (this.cardList.length === 0) {
        //   statusMsg.classList.remove('active');
        //   statusMsg.innerText = "No QRCode generated yet.";
            qrcodeContainer.classList.remove('active');
            container.classList.remove('visible');
        } else {
        //   statusMsg.classList.add('active');
        //   statusMsg.innerText = "Layer";
            qrcodeContainer.classList.add('active');
            container.classList.add('visible');
      }
    }
  }

const cardContainer = new CardContainer();
});