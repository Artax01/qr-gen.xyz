document.addEventListener('DOMContentLoaded', (event) => {
  const zoomQRLink = document.getElementById('zoomQRLink');
  const zoomQRLink_2 = document.getElementById('zoomQRLink_2');
  const zoom_menu = document.getElementById('zoom_menu');

  zoomQRLink.addEventListener('click', () => {
    zoom_menu.classList.toggle('active');
  });

  zoomQRLink_2.addEventListener('click', () => {
    zoom_menu.classList.toggle('active');
  });
});