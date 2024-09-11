document.addEventListener('DOMContentLoaded', function() : void {
  const burger_menu : HTMLElement | null = document.getElementById('burger-menu'); // burger menu
  const darkMode : HTMLElement | null = document.getElementById('darkMode'); // dark-theme

  // element
  const side_menu : HTMLElement | null = document.getElementById('side_menu');
  const blur : HTMLElement | null = document.getElementById('blur');

  if (burger_menu && side_menu && blur) {
    burger_menu.addEventListener('click', function () : void {
      burger_menu.classList.toggle('active');
      side_menu.classList.toggle('active');
      blur.classList.toggle('active');
    });
  
    blur.addEventListener('click', function () : void {
      burger_menu.classList.toggle('active');
      side_menu.classList.toggle('active');
      blur.classList.toggle('active');
    });
  }

  if (darkMode) {
    darkMode.addEventListener('click', function () : void {
      document.body.classList.toggle('dark_theme');
      darkMode.classList.toggle('active');
    });
  }

});
