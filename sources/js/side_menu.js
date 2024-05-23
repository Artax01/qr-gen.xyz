document.addEventListener('DOMContentLoaded', (event) => {
  const burger_menu = document.getElementById('burger-menu'); // burger menu

  // element
  const side_menu = document.getElementById('side_menu');
  const blur = document.getElementById('blur');

  burger_menu.addEventListener('click', () => {
    burger_menu.classList.toggle('active');
    side_menu.classList.toggle('active');
    blur.classList.toggle('active');
  });
  
  blur.addEventListener('click', () => {
    burger_menu.classList.toggle('active');
    side_menu.classList.toggle('active');
    blur.classList.toggle('active');
  });

});