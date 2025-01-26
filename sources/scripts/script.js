document.addEventListener('DOMContentLoaded', function () {
  // SearchBarContent
  var fileSelectButton  = document.getElementById('fileSelectButton'); // file import button
  var hiddenFileInput = document.getElementById('hiddenFileInput');
  var messageInput = document.getElementById('messageInput'); // text field for qrcode value
  var generateButton = document.getElementById('generateButton'); // generate qrcode based on the input value
  
  var status_msg = document.getElementById('status-msg');
  var status_value = status_msg.innerHTML;

  var qrcode = document.getElementById('qrcode');
  var container = document.getElementById('card-container'); // card container inside qrcode block
  var card = document.getElementById('card');

  // optionsMenuContent
  var optMenu = document.getElementById('optMenu');
  var optImage = document.getElementById('optImage');
  var optName = document.getElementById('optName');
  var optDate = document.getElementById('optDate');
  var downloadButton = document.getElementById('downloadBtn');

  // dictionnary
  var units = {
    0: 'B',
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
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 





  class Card {
    constructor(id) {
      this.id = id;
      this.name = "";
      this.size = "";
      this.time = "";
      this.date = "";
      this.fullDate = "";
      this.card = this.render();

      this.getQR();
      this.setButtons();
    }
    
    setInfos() {
      if (!this.name) { this.name = String(messageInput.value); }
      if (!this.time) { this.time = String(`${new Date().getHours()}:${fixMinutes(new Date().getMinutes())}`); }
      if (!this.date) { this.date = String(`${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`); }
      if (!this.fullDate) { this.fullDate = String(`${findMonth(new Date().getMonth()+1)} ${new Date().getDate()}, ${new Date().getFullYear()}.`); }
    }
    
    setButtons() {
      var _this = this;
      downloadButton.addEventListener('click', function () {
        _this.sizeAndDownLoad('download');
      });

      // deleteButton.addEventListener('click', function () {
      //   removeCardCall(_this.id);
      // });
    }
    
    getQR() {
      var container = this.card.querySelector('#image');
  
      if (messageInput.value) { var value = String(messageInput.value); }
      else {
        if (this.name) { var value = String(this.name); }
        else {
          alert('Please enter a value to generate a qrcode.');
          return;
        }
      }

      new genQR(container, value, 128);
      this.sizeAndDownLoad('size');
    }

    sizeAndDownLoad(action) {
      var _this = this;
      setTimeout(function () {
        var qrcodeImage = _this.card.querySelector('.img_container img').src;
        
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
    }

    render() {
      var newCard = card.cloneNode(true);
      this.setInfos();

      newCard.id = String(`card${this.id}`);
      newCard.querySelector('#name').innerText = this.name;
      newCard.querySelector('#date_time').innerText = String(`${this.time}`);
      container.insertBefore(newCard, container.firstChild);
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
      // obtain the targeted card
      var targetedCard = document.getElementById(String(`card${element.id}`));

      // open/close optionsMenu + Load Content
      element.card.addEventListener('click', function() {
        if (!optMenu.classList.contains('active')) {
          var image = targetedCard.querySelector('.img_container').innerHTML;
          optImage.innerHTML = image;
          optName.innerText = element.name;
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
      
      resetInput();
      this.checkLength();
    }

    removeCard(id) {
      delete this.cardList[id];
      
      if (this.cardList.length > 0) {
        this.cardList.length -= 1;
      }
      this.checkLength();
    };
  }

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
  }

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
    status_msg.innerText = "Today";
  }

  function statusMessageReset() {
    status_msg.classList.remove('active'); // show the status message
    status_msg.innerHTML = status_value;
  }

  function removeCardCall(id) {
    cardContainer.removeCard(id);
  }

});
