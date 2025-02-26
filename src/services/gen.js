// Send request to api.qrserver.com

function genQR(container, data, size) {
  var text = String(data);
  var imgSize = String(size);

  var api_url = new Request(`https://api.qrserver.com/v1/create-qr-code/?data=${text}&size=${imgSize}x${imgSize}`);

  fetch(api_url)
    .then(response => {
      if (!response.ok) {
        alert('Something went wrong with API server! Please reload website.');
        throw new Error('Network response was not ok.');
      }
      return response;
    })
    .then(data => {
      container.src = String(data.url);
      container.title = text;
    })
    .catch(error => {
      console.error('Error', error);
    });
};