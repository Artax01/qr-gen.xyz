// The 'qrcode.js' module is used to generate qrcode.
// The github page of 'qrcode.js' => 'https://github.com/davidshimjs/qrcodejs'.


// QRCODE PANEL


document.addEventListener('DOMContentLoaded', (event) => {
  const fileSelectorLink  = document.getElementById('fileSelectorLink'); // file import button
  const hiddenFileInput = document.getElementById('hiddenFileInput');
  const fileNameDisplayInput = document.getElementById('fileNameDisplayInput'); // text field for qrcode value
  
  const main = document.getElementById('main');
  const status_msg = document.getElementById('status-msg');
  const status_value = status_msg.innerHTML;

  const container = document.getElementById('card-container');
  const card = document.getElementById('card');

  // buttons
  const generateQRLink = document.getElementById('generateQRLink'); // generate qrcode based on the input value

  // zoomMenuContent
  const zoomMenu = document.getElementById('zoom_menu');
  const zoomImage = document.getElementById('zoom_qrcode');
  const zoomName = document.getElementById('zoom_title');
  const exitButton = document.getElementById('zoomQRLink_2');

  // dictionnary
  const units = {
    0: 'bytes',
    3: 'Ko',
    6: 'Mo',
    9: 'Go',
    12: 'To'
  };
  const months = {
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
    constructor() {
      this.id = NaN;
      // this.image = NaN;
      this.name = "";
      this.size = NaN;
      this.time = "";
      this.date = "";
      this.downloadButton = NaN;
      this.zoomButton = NaN;
      this.deleteButton = NaN;
      this.card = this.render();

      this.generateQRCode();
      this.setButtons();
    }

    setInfos() {
      this.name = fileNameDisplayInput.value;
      this.time = String(`${new Date().getHours()}:${fixMinutes(new Date().getMinutes())}`);
      this.date = String(`${findMonth(new Date().getMonth()+1)} ${new Date().getDate()}, ${new Date().getFullYear()}.`);
    }

    setButtons() {
      this.downloadButton = this.card.querySelector('#downloadQRLink');
      this.zoomButton = this.card.querySelector('#zoomQRLink');
      this.deleteButton = this.card.querySelector('#deleteQRLink');

      this.downloadButton.addEventListener('click', () => {
        this.sizeAndDownLoad('download');
      });

      this.zoomButton.addEventListener('click', () => {
        this.image = this.card.querySelector('.qrcode').innerHTML;
        
        zoomImage.innerHTML = this.image;
        zoomName.innerText = this.name;
        zoom_menu.classList.toggle('active');
      });
    }

    generateQRCode() {
      let value = String(fileNameDisplayInput.value);
      let container = this.card.querySelector('.qrcode');
  
      if (value.trim() !== '') {

        new QRCode(container, value); // new qrcode generation
        this.sizeAndDownLoad('size'); // qrcode size calculation
  
      } else {
        alert('Please enter a value to generate a qrcode.');
      }
    }

    sizeAndDownLoad(action) {
      setTimeout(() => {
        let qrcodeImage = this.card.querySelector('.qrcode img').src;

        fetch(qrcodeImage).then(response => response.blob()).then(blob => {

            if (String(action) === 'size') {
              this.size = findUnit(blob.size);
              this.card.querySelector('#qrcode_size').innerText = this.size;

            } else if (String(action) === 'download') {

              let link = document.createElement('a');

              link.href = URL.createObjectURL(blob);
              link.download = this.name;
              link.click();

              URL.revokeObjectURL(link.href);
            } else {
              return;
            }
        });
      }, 100);
    }

    render() {
      const newCard = card.cloneNode(true);

      this.setInfos();
      newCard.querySelector('#qrcode_name').innerText = this.name;
      newCard.querySelector('#qrcode_date_time').innerText = `At ${this.time}, ${this.date}`;

      container.insertBefore(newCard, container.firstChild);
      newCard.classList.add('visible');
      return newCard;
    }
  };







  class CardContainer {
    constructor() {
      this.cardList = [];
    }

    checkLength() {
      if (this.cardList.length === 0) {
        statusMessageReset();
        main.classList.remove('active');
        container.classList.remove('visible');
      } else {
        statusMessageChange();
        main.classList.add('active');
        container.classList.add('visible');
      }
    }

    addCard() {
      const newCard = new Card();
      this.cardList[this.cardList.length] = newCard;

      this.checkLength();
    }

    removeCard() {
      this.checkLength();
    }
  };

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

  fileNameDisplayInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      cardContainer.addCard();
    }
  });

  hiddenFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
      resetInput();
      
      fileNameDisplayInput.value = file.name;
      cardContainer.addCard();
    }
  });

  // buttons

  fileSelectorLink.addEventListener('click', (event) => {
    event.preventDefault();
    hiddenFileInput.click();
  });

  generateQRLink.addEventListener('click', () => {
    cardContainer.addCard();
  });

  deleteQRLink.addEventListener('click', () => {
    cardContainer.removeCard();
  });

  // zoom menu

  exitButton.addEventListener('click', () => {
    zoom_menu.classList.remove('active');
  });

  zoomMenu.addEventListener('click', () => {
    zoom_menu.classList.remove('active');
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
    fileNameDisplayInput.value = '';
    hiddenFileInput.value = '';
  }

  function findUnit(size) {
    let k = 0;

    while (size >= Math.pow(10, k)) {
      k += 3;
    }

    let value = size / Math.pow(10, k-3);
    value = value.toFixed(2)

    return value + ' ' + units[k-3];
  }

  function findMonth(nbr) {
    return months[nbr]
  }

  function fixMinutes(minutes) {
    if (minutes < 10) {
      return `0${minutes}`;
    } else {
      return minutes;
    }
  }

  function statusMessageChange() {
    status_msg.classList.add('active'); // hide the status message
    status_msg.innerText = "Aujourd'hui";
  }

  function statusMessageReset() {
    status_msg.classList.remove('active'); // show the status message
    status_msg.innerHTML = status_value;
  }

});
