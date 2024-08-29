// The 'qrcode.js' module is used to generate qrcode.
// The github page of 'qrcode.js' => 'https://github.com/davidshimjs/qrcodejs'.


// QRCODE PANEL 


document.addEventListener('DOMContentLoaded', (event) => {
  const fileSelectorLink  = document.getElementById('fileSelectorLink'); // file import button
  const hiddenFileInput = document.getElementById('hiddenFileInput');
  const fileNameDisplayInput = document.getElementById('fileNameDisplayInput'); // text field for qrcode value

  const main = document.getElementById('main'); // main (between header and footer)
  const cardContainer = document.getElementById('card-container');
  const card = document.getElementById('card');
  const qrCodeContainer = document.getElementById('qrcode');

  // buttons
  const generateQRLink = document.getElementById('generateQRLink'); // generate qrcode based on the input value
  const deleteQRLink = document.getElementById('deleteQRLink'); // clears the value entered in the input
  const downloadQRLink  = document.getElementById('downloadQRLink'); // suggests saving the qrcode

  // qrcode stats
  const status_msg = document.getElementById('status-msg');
  const qrcode_name = document.getElementById('qrcode_name'); // qrcode name field info 
  const qrcode_size = document.getElementById('qrcode_size'); // qrcode size field info
  const qrcode_date_time = document.getElementById('qrcode_date_time'); // qrcode date and time generation
  const units = {
    0: 'bytes',
    3: 'Ko',
    6: 'Mo',
    9: 'Go',
    12: 'To'
  }
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
  }

  resetInput() 














  fileNameDisplayInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      generateQRCode();
    }
  });
  
  fileNameDisplayInput.addEventListener('change', (e) => {
    generateQRCode();
  });













  


  generateQRLink.addEventListener('click', (e) => {
    generateQRCode();
  });

  downloadQRLink.addEventListener('click', function(event) {
    event.preventDefault();
    qrcodeActions();
  });

  deleteQRLink.addEventListener('click', function(event) {
    event.preventDefault();

    card.classList.add('delete');
    qrCodeContainer.innerHTML = '';
  });

  fileSelectorLink.addEventListener('click', (e) => {
    e.preventDefault();
    hiddenFileInput.click();
  });

  hiddenFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
      resetInput();
      
      fileNameDisplayInput.value = file.name;
      qrcode_name.innerText = file.name; // show the file name

      generateQRCode();
    }
  });



















  function generateQRCode() {

    const value = fileNameDisplayInput.value;

    if (value.trim() !== '') {

      qrCodeContainer.innerHTML = ''; // delete previous qrcode
      new QRCode(qrCodeContainer, value); // Generate new qrcode

      qrcodeActions(get_size=true);

      statusMessageActive();

      setInfos()

      cardContainer.classList.add('active');
      card.classList.remove('delete');

    } else {

      qrCodeContainer.innerHTML = '';
      alert('Please enter a value to generate a qrcode.');

    }
  }



  function qrcodeActions(get_size=false) {
    setTimeout(() => {
      const qrCodeImage = qrCodeContainer.querySelector('img').src;

      fetch(qrCodeImage)
        .then(response => response.blob())
        .then(blob => {

          if (get_size === true) {

            const fileSize = blob.size;
            qrcode_size.innerText = findUnit(fileSize);

          } else {

            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = qrcode_name.innerText;
            link.click();

            URL.revokeObjectURL(link.href);
          }


        });

    }, 100);
  }



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

  function setInfos() {
    qrcode_name.innerText = fileNameDisplayInput.value;

    qrcode_date_time.innerText = String(`At ${new Date().getHours()}:${new Date().getMinutes()}, ${findMonth(new Date().getMonth()+1)} ${new Date().getDate()}, ${new Date().getFullYear()}.`);
  }


  function statusMessageActive() {
    status_msg.classList.add('hide'); // hide the status message
    main.classList.add('active'); // remove align-content propreties
  }

});
