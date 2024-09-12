// The 'qrcode.js' module is used to generate qrcode.
// The github page of 'qrcode.js' => 'https://github.com/davidshimjs/qrcodejs'.


// QRCODE PANEL


document.addEventListener('DOMContentLoaded', (event) => {
  // SearchBarContent
  var fileSelectButton  = document.getElementById('fileSelectButton'); // file import button
  var hiddenFileInput = document.getElementById('hiddenFileInput');
  var messageInput = document.getElementById('messageInput'); // text field for qrcode value
  var generateButton = document.getElementById('generateButton'); // generate qrcode based on the input value
  
  var main = document.getElementById('main');
  var tagContainer = document.getElementById('tagContainer');
  var status_msg = document.getElementById('status-msg');
  var status_value = status_msg.innerHTML;

  var container = document.getElementById('card-container');
  var card = document.getElementById('card');

  // optionsMenuContent
  var optMenu = document.getElementById('optMenu');
  var optImage = document.getElementById('optImage');
  var optName = document.getElementById('optName');
  var optDate = document.getElementById('optDate');
  var exitButton = document.getElementById('zoomQRLink_2');

  // dictionnary
  var units = {
    0: 'Bytes',
    3: 'KB',
    6: 'MB',
    9: 'GB',
    12: 'TB'
  };
  var months = {
    1: 'January',
    2: 'Febuary',
    3: 'March',
    4: 'April',
    5: 'Mai',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  };

  resetInput();








                                                                                                                    
                                                                                                                    
        // CCCCCCCCCCCCClllllll                                                                                        
     // CCC::::::::::::Cl:::::l                                                                                        
   // CC:::::::::::::::Cl:::::l                                                                                        
  // C:::::CCCCCCCC::::Cl:::::l                                                                                        
 // C:::::C       CCCCCC l::::l   aaaaaaaaaaaaa      ssssssssss      ssssssssss
// C:::::C               l::::l   a::::::::::::a   ss::::::::::s   ss::::::::::s
// C:::::C               l::::l   aaaaaaaaa:::::ass:::::::::::::sss:::::::::::::s
// C:::::C               l::::l            a::::as::::::ssss:::::s::::::ssss:::::s
// C:::::C               l::::l     aaaaaaa:::::a s:::::s  ssssss s:::::s  ssssss
// C:::::C               l::::l   aa::::::::::::a   s::::::s        s::::::s
// C:::::C               l::::l  a::::aaaa::::::a      s::::::s        s::::::s
 // C:::::C       CCCCCC l::::l a::::a    a:::::assssss   s:::::sssssss   s:::::s
   // C:::::CCCCCCCC::::Cl::::::la::::a    a:::::as:::::ssss::::::s:::::ssss::::::s
    // CC:::::::::::::::Cl::::::la:::::aaaa::::::as::::::::::::::ss::::::::::::::s
      // CCC::::::::::::Cl::::::l a::::::::::aa:::as:::::::::::ss  s:::::::::::ss
        //  CCCCCCCCCCCCCllllllll  aaaaaaaaaa  aaaa sssssssssss     sssssssssss
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 





  var Card = /** @class */ (function () {
    function Card() {
      this.id = NaN;
      this.name = "";
      this.size = "";
      this.time = "";
      this.date = "";
      this.fullDate = "";
      this.downloadButton = null;
      this.optionsButton = null;
      this.deleteButton = null;
      this.card = this.render();

      this.generateQRCode();
      this.setButtons();
    };
    
    Card.prototype.setInfos = function () {
      this.name = String(messageInput.value);
      this.time = String("".concat(new Date().getHours(), ":").concat(fixMinutes(new Date().getMinutes()));
      this.date = String("".concat(new Date().getMonth() + 1, "/").concat(new Date().getDate(), "/").concat(new Date().getFullYear(), "."));
      this.fullDate = String("".concat(findMonth(new Date().getMonth() + 1), " ").concat(new Date().getDate(), ", ").concat(new Date().getFullYear(), "."));
    };
    
    Card.prototype.setButtons = function () {
      var _this = this;
      // this.downloadButton = this.card.querySelector('#downloadQRLink');
      this.optionsButton = this.card.querySelector('#optionsBtn');
      // this.deleteButton = this.card.querySelector('#deleteQRLink');

      // this.downloadButton.addEventListener('click', () => {
      //   this.sizeAndDownLoad('download');
      // });

      // this.deleteButton.addEventListener('click', () => {
      //   removeCardCall(this.id);
      // });

      this.optionsButton.addEventListener('click', async function () {
        _this.image = _this.card.querySelector('.qrcode').innerHTML;
        optImage.innerHTML = _this.image;
        optName.innerText = _this.name;
        optDate.innerText = String("".concat(_this.time, ", ").concat(_this.fullDate));

        if (_this.optionsButton != null && _this.optionsButton.classList.contains('open')) {
          optMenu.classList.remove('active');
          _this.optionsButton.classList.remove('open');
        }
        else {
          optMenu.classList.toggle('active');
          await new Promise(r => setTimeout(r, 200));
          optMenu.classList.add('active');
          _this.optionsButton.classList.add('open');
        }
      });
    };
    
    Card.prototype.generateQRCode = function () {
      var value = String(messageInput.value);
      var container = this.card.querySelector('.qrcode');
  
      if (value.trim() !== '') {
        new QRCode(container, value); // new qrcode generation
        this.sizeAndDownLoad('size'); // qrcode size calculation
      } else {
        alert('Please enter a value to generate a qrcode.');
      }
    };

    Card.prototype.sizeAndDownLoad = function (action) {
      var _this = this;
      setTimeout( function () {
        var qrcodeImage = _this.card.querySelector('.qrcode img').src;
        
        fetch(qrcodeImage).then(function (response) { return response.blob(); }).then(function (blob) {
            if (String(action) === 'size') {
              _this.size = findUnit(blob.size);
              _this.card.querySelector('#size').innerText = _this.size;
            }
            else if (String(action) === 'download') {
              var link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = _this.name;
              link.click();
              URL.revokeObjectURL(link.href);
            }
            else {
              return;
            }
        });
      }, 100);
    };

    Card.prototype.render = function () {
      var newCard = card.cloneNode(true);
      this.setInfos();
      
      newCard.querySelector('#name').innerText = this.name;
      newCard.querySelector('#date_time').innerText = String("At ".concat(this.time, ", ").concat(this.date));
      container.insertBefore(newCard, container.firstChild);
      newCard.classList.add('visible');
      return newCard;
    };
    return Card;
  }());







  var CardContainer = /** @class */ (function () {
    function CardContainer() {
      this.cardList = [];
    }

    CardContainer.prototype.checkLength = function () {
      if (this.cardList.length === 0) {
        statusMessageReset();
        main.classList.remove('active');
        container.classList.remove('visible');
      }
      else {
        statusMessageChange();
        main.classList.add('active');
        tagContainer.classList.add('visible');
        container.classList.add('visible');
      }
    };

    CardContainer.prototype.addCard = function () {
      var newCard = new Card();
      var id = Number(this.cardList.length);
      
      newCard.id = id;
      this.cardList[id] = newCard;
      resetInput();
      this.checkLength();
    };

    CardContainer.prototype.removeCard = funnction (id) {
      delete this.cardList[id];
      
      if (this.cardList.length > 0) {
        this.cardList.length = Number(this.cardList.length) - 1;
      }
      this.checkLength();
    };
    return CardContainer;
  }());

  cardContainer = new CardContainer();










                                                                                                                                                      
                                                                                                                                                      
  // LLLLLLLLLLL               iiii                            tttt                                                                                        
  // L:::::::::L              i::::i                        ttt:::t                                                                                        
  // L:::::::::L               iiii                         t:::::t                                                                                        
  // LL:::::::LL                                            t:::::t                                                                                        
    // L:::::L               iiiiiii     ssssssssss   ttttttt:::::ttttttt        eeeeeeeeeeee    nnnn  nnnnnnnn        eeeeeeeeeeee    rrrrr   rrrrrrrrr   
    // L:::::L               i:::::i   ss::::::::::s  t:::::::::::::::::t      ee::::::::::::ee  n:::nn::::::::nn    ee::::::::::::ee  r::::rrr:::::::::r  
    // L:::::L                i::::i ss:::::::::::::s t:::::::::::::::::t     e::::::eeeee:::::een::::::::::::::nn  e::::::eeeee:::::eer:::::::::::::::::r 
    // L:::::L                i::::i s::::::ssss:::::stttttt:::::::tttttt    e::::::e     e:::::enn:::::::::::::::ne::::::e     e:::::err::::::rrrrr::::::r
    // L:::::L                i::::i  s:::::s  ssssss       t:::::t          e:::::::eeeee::::::e  n:::::nnnn:::::ne:::::::eeeee::::::e r:::::r     r:::::r
    // L:::::L                i::::i    s::::::s            t:::::t          e:::::::::::::::::e   n::::n    n::::ne:::::::::::::::::e  r:::::r     rrrrrrr
    // L:::::L                i::::i       s::::::s         t:::::t          e::::::eeeeeeeeeee    n::::n    n::::ne::::::eeeeeeeeeee   r:::::r            
    // L:::::L         LLLLLL i::::i ssssss   s:::::s       t:::::t    tttttte:::::::e             n::::n    n::::ne:::::::e            r:::::r            
  // LL:::::::LLLLLLLLL:::::Li::::::is:::::ssss::::::s      t::::::tttt:::::te::::::::e            n::::n    n::::ne::::::::e           r:::::r            
  // L::::::::::::::::::::::Li::::::is::::::::::::::s       tt::::::::::::::t e::::::::eeeeeeee    n::::n    n::::n e::::::::eeeeeeee   r:::::r            
  // L::::::::::::::::::::::Li::::::i s:::::::::::ss          tt:::::::::::tt  ee:::::::::::::e    n::::n    n::::n  ee:::::::::::::e   r:::::r            
  // LLLLLLLLLLLLLLLLLLLLLLLLiiiiiiii  sssssssssss              ttttttttttt      eeeeeeeeeeeeee    nnnnnn    nnnnnn    eeeeeeeeeeeeee   rrrrrrr            
                                                                                                                                                        
                                                                                                                                                        
                                                                                                                                                        
                                                                                                                                                        
                                                                                                                                                        
                                                                                                                                                        
                                                                                                                                                        








  // input field

  messageInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      cardContainer.addCard();
    }
  });
  
  hiddenFileInput.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (file) {
      resetInput();
      
      messageInput.value = file.name;
      if (messageInput.value.trim() !== '') {
        cardContainer.addCard();
      }
      else {
        alert('Please enter a value to generate a qrcode.');
      }
    }
  });

  // buttons
  fileSelectButton.addEventListener('click', function (event) => {
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

  // options menu

  exitButton.addEventListener('click', function () {
    optMenu.classList.remove('active');
  });













                                                                                                                                              
                                                                                                                                              
  // FFFFFFFFFFFFFFFFFFFFFF                                                               tttt            iiii                                     
  // F::::::::::::::::::::F                                                            ttt:::t           i::::i                                    
  // F::::::::::::::::::::F                                                            t:::::t            iiii                                     
  // FF::::::FFFFFFFFF::::F                                                            t:::::t                                                     
    // F:::::F       FFFFFFuuuuuu    uuuuuunnnn  nnnnnnnn        ccccccccccccccccttttttt:::::ttttttt    iiiiiii    ooooooooooo   nnnn  nnnnnnnn    
    // F:::::F             u::::u    u::::un:::nn::::::::nn    cc:::::::::::::::ct:::::::::::::::::t    i:::::i  oo:::::::::::oo n:::nn::::::::nn  
    // F::::::FFFFFFFFFF   u::::u    u::::un::::::::::::::nn  c:::::::::::::::::ct:::::::::::::::::t     i::::i o:::::::::::::::on::::::::::::::nn 
    // F:::::::::::::::F   u::::u    u::::unn:::::::::::::::nc:::::::cccccc:::::ctttttt:::::::tttttt     i::::i o:::::ooooo:::::onn:::::::::::::::n
    // F:::::::::::::::F   u::::u    u::::u  n:::::nnnn:::::nc::::::c     ccccccc      t:::::t           i::::i o::::o     o::::o  n:::::nnnn:::::n
    // F::::::FFFFFFFFFF   u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n
    // F:::::F             u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n
    // F:::::F             u:::::uuuu:::::u  n::::n    n::::nc::::::c     ccccccc      t:::::t    tttttt i::::i o::::o     o::::o  n::::n    n::::n
  // FF:::::::FF           u:::::::::::::::uun::::n    n::::nc:::::::cccccc:::::c      t::::::tttt:::::ti::::::io:::::ooooo:::::o  n::::n    n::::n
  // F::::::::FF            u:::::::::::::::un::::n    n::::n c:::::::::::::::::c      tt::::::::::::::ti::::::io:::::::::::::::o  n::::n    n::::n
  // F::::::::FF             uu::::::::uu:::un::::n    n::::n  cc:::::::::::::::c        tt:::::::::::tti::::::i oo:::::::::::oo   n::::n    n::::n
  // FFFFFFFFFFF               uuuuuuuu  uuuunnnnnn    nnnnnn    cccccccccccccccc          ttttttttttt  iiiiiiii   ooooooooooo     nnnnnn    nnnnnn
       
  




  

                                                                                                                                                
  function resetInput() {
    messageInput.value = "";
    hiddenFileInput.value = "";
  };

  function findUnit(size) {
    var k = 0;
    while (size >= Math.pow(10, k)) {
      k += 3;
    }
    var value = size / Math.pow(10, k-3);
    value = value.toFixed(2)
    return value + " " + units[k-3];
  };

  function findMonth(nbr) {
    return months[nbr]
  };

  function fixMinutes(minutes) {
    if (minutes < 10) {
      return String("0".concat(minutes));
    }
    else {
      return minutes;
    }
  };

  function statusMessageChange() {
    status_msg.classList.add('active'); // hide the status message
    status_msg.innerText = "Aujourd'hui";
  };

  function statusMessageReset() {
    status_msg.classList.remove('active'); // show the status message
    status_msg.innerHTML = status_value;
  };

  function removeCardCall(id) {
    cardContainer.removeCard(id);
  };

});
