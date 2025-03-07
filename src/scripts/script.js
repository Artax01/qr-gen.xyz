const fileSelectButton  = document.getElementById('fileSelectButton'); // file import button
const hiddenFileInput = document.getElementById('hiddenFileInput');
const messageInput = document.getElementById('messageInput'); // text field for qrcode value
const generateButton = document.getElementById('generateButton'); // generate qrcode based on the input value
const status_msg = document.getElementById('status-msg');
const status_value = status_msg.innerHTML;
const qrcode = document.getElementById('qrcode');
const container = document.getElementById('card-container'); // card container inside qrcode block
const card = document.getElementById('card');
const layerBtnContainer = document.getElementById('layerBtnContainer');
const optImage = document.getElementById('optImage');
const optName = document.getElementById('optName');
const optDate = document.getElementById('optDate');
const downloadButton = document.getElementById('downloadBtn');


/**detect if the client is desktop or mobile to adapt the app
the app is based on this limit (mobile <= 800px > desktop)*/
let userDevice = function () {return (window.screen.width <= 800) ? 'mobile' : 'desktop';}
var currentUserDevice = userDevice === 'mobile' ? 'desktop' : 'mobile';
var containerHeight = container.clientHeight; // height of the qrcode container 
var containerWidth = container.clientWidth; // width of the qrcode container

function checkUI() {
    //check if the height and width of the qrcode container change
    // document.querySelector('#hud_footer').innerText = `version:1.7, branch:dev, client:${userDevice()}`;

    if (userDevice() === 'mobile') {
        qrcode.style.height = `calc(100vh - ${document.querySelector('.navbar').clientHeight}px - ${document.querySelector('#search').clientHeight}px)`;
        currentUserDevice = 'mobile';
    }
    else if (userDevice() === 'desktop') {
        setTimeout(() => {
            qrcode.style.height = `calc(100vh - ${document.querySelector('.navbar').clientHeight}px)`;
        }, 200);

        currentUserDevice = 'desktop';
    }
}
checkUI();

window.addEventListener('resize', () => {
    if (userDevice() === 'desktop') {
        containerHeight = container.clientHeight;
        containerWidth = container.clientWidth;
    }

    if (userDevice() !== currentUserDevice) {
        checkUI();
    }
});

const units = Object.freeze({0: "B", 3: "KB", 6: "MB", 9: "GB", 12: "TB"});
const months = Object.freeze({1: "January", 2: "Febuary", 3: "March", 4: "April", 5: "Mai", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"});
resetInput();










/**
 * @name Card
 * @description Create card that contain generated qrcode
 * @function setInfos
 * @function setButtons
 * @function getQR
 * @function sizeAndDownLoad
 * @function render render the generated QRCode
 */
class Card {
    constructor(id) {
        this.id = id;
        this.text = "";
        this.size = "";
        this.time = "";
        this.date = "";
        this.fullDate = "";
        this.card = this.render();

        this.getQR();
        this.setButtons();
    }
  
    setInfos() {
        if (!this.text) { this.text = String(messageInput.value); }
        if (!this.time) { this.time = String(`${new Date().getHours()}:${fixMinutes(new Date().getMinutes())}`); }
        if (!this.date) { this.date = String(`${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`); }
        if (!this.fullDate) { this.fullDate = String(`${findMonth(new Date().getMonth()+1)} ${new Date().getDate()}, ${new Date().getFullYear()}`); }
    }
  
    setButtons() {
        var _this = this;
        downloadButton.addEventListener('click', function () {
            _this.sizeAndDownLoad('download');
        });
    }
  
    getQR() {
        var image = this.card.querySelector('#image');
        var value = "";

        if (messageInput.value) { value = String(messageInput.value); }
        else if (this.text) { value = String(this.text); } 
        else {
            alert('Please enter a value to generate a qrcode.');
            return;
        }

        new genQR(image, value, 128);
        this.sizeAndDownLoad('size');
    }

    sizeAndDownLoad(action) {
        var _this = this;
        setTimeout(function () {
            var qrcodeImage = _this.card.querySelector('.img_container img').src;
            // var image = _this.card.querySelector('#image').src;
            
            fetch(qrcodeImage).then(function (response) { return response.blob(); }).then(function (blob) {
                if (String(action) === 'size') {
                    _this.size = findUnit(blob.size);
                    _this.card.querySelector('#size').innerText = _this.size;
                }
                else if (String(action) === 'download') {
                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = _this.text;
                    link.click();
                    URL.revokeObjectURL(link.href);
                }
                else {
                    return;
                }
            });
        }, 100);
    }

  render() {
    var newCard = card.cloneNode(true);
    this.setInfos();

    newCard.id = String(`card${this.id}`);
    newCard.querySelector('#text').innerText = this.text;
    newCard.querySelector('#date_time').innerText = String(`${this.time}`);
    container.insertBefore(newCard, container.firstChild);
    newCard.style.top = `${Math.random() * (containerHeight - 271)}px`;
    newCard.style.left = `${Math.random() * (containerWidth - 359)}px`;
    newCard.style.zIndex = `${this.id}`;
    newCard.classList.add('visible');
    return newCard;
  }
}




class CardContainer {
  constructor() {
    this.cardList = [];
  }

  checkLength() {
    if (this.cardList.length === 0) {
      statusMessageReset();
      qrcode.classList.remove('active');
      container.classList.remove('visible');
    } 
    else {
      statusMessageChange();
      qrcode.classList.add('active');
      container.classList.add('visible');
    }
  }

  setEventListener(element) {
    var optMenu = document.getElementById('optMenu');
    var targetedCard = document.getElementById(String(`card${element.id}`));

    element.card.addEventListener('click', function() {
      if (!optMenu.classList.contains('active')) {
        var image = targetedCard.querySelector('.img_container').innerHTML;
        optImage.innerHTML = image;
        optName.innerText = element.text;
        optDate.innerText = String(`${element.time}, ${element.fullDate}`);
      }
      optMenu.classList.toggle('active');
    });
  }

  addCard() {
    var id = Number(this.cardList.length);
    var newCard = new Card(id);

    this.setEventListener(newCard);
    this.cardList[id] = newCard;

    // var layerBtn = document.createElement('button');
    // layerBtn.classList.add('layerBtn');
    // layerBtn.innerText = newCard.text;
    // layerBtn.addEventListener('click', () => {
    //     document.getElementById(String(`card${newCard.id}`)).classList.toggle('visible');
    //     layerBtn.classList.toggle('active');
    // });
    // layerBtnContainer.appendChild(layerBtn);
    
    resetInput();
    this.checkLength();
  }

//   removeCard(id) {
//     delete this.cardList[id];
    
//     if (this.cardList.length > 0) {
//       this.cardList.length -= 1;
//     }
//     this.checkLength();
//   };
}

var cardContainer = new CardContainer();



                                                                                                                                              
                                                                                                                                                      
                                                                                                                                                      
                                                                                                                                                      








// input field
messageInput.addEventListener('input', function () {
    if (messageInput.value.length > 0) {
        generateButton.style.display = "flex";
        messageInput.style.borderRadius = `10px 0 0 10px`;
    } else {
        resetInput();
    }
});

messageInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    if (messageInput.value.trim() !== "" && messageInput.value.trim() !== null) {
      cardContainer.addCard();
    } 
    else {
      alert('Please enter a value to generate a qrcode.');
    }
  }
});

hiddenFileInput.addEventListener('change', function (e) {
  var file = e.target.files[0];
  if (file) {
    resetInput();
    messageInput.value = file.name; 
    
    if (messageInput.value.trim() !== '' && messageInput.value.trim() !== null) {
      cardContainer.addCard();
    }
    else {
      alert('Please enter a value to generate a qrcode.');
    }
  }
});

// buttons
fileSelectButton.addEventListener('click', function (event) {
  event.preventDefault();
  hiddenFileInput.click();
});

generateButton.addEventListener('click', function () {
  if (messageInput.value.trim() !== '') {
    cardContainer.addCard();
  }
  else {
    alert('Please enter a value to generate a qrcode.');
  }
});

// deleteQRLink.addEventListener('click', () => {
//   cardContainer.removeCard();
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
  var k = 0;
  
  while (size >= Math.pow(10, k)) {
    k += 3;
  }
  
  var value = size / Math.pow(10, k-3);
  value = value.toFixed(2);
  return String(value + " " + units[k-3]);
}

function findMonth(nbr) {
  return String(months[nbr]);
}

function fixMinutes(minutes) {
  if (minutes < 10) {
    return String(`0${minutes}`);
  }
  else {
    return String(minutes);
  }
}

function statusMessageChange() {
  status_msg.classList.add('active'); // hide the status message
  status_msg.innerText = "Layer";
}

function statusMessageReset() {
  status_msg.classList.remove('active'); // show the status message
  status_msg.innerHTML = status_value;
}

// function removeCardCall(id) {
//   container.removeCard(id);
// }

// function addCardCall() {