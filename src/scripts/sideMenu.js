// element
var burger_menu = document.getElementById('burger-menu'); // burger-menu
var darkMode = document.getElementById('darkMode'); // theme switch button
// menu
var side_menu = document.getElementById('side_menu');
var _blur = document.getElementById('blur');

if (burger_menu && side_menu && _blur) {
    burger_menu.addEventListener('click', function () {
        burger_menu.classList.toggle('active');
        side_menu.classList.toggle('active');
        _blur.classList.toggle('active');
    });
    _blur.addEventListener('click', function () {
        burger_menu.classList.toggle('active');
        side_menu.classList.toggle('active');
        _blur.classList.toggle('active');
    });
}
if (darkMode) {
    darkMode.addEventListener('click', function () {
        document.querySelector(':root').classList.toggle('dark_theme');
        darkMode.classList.toggle('active');
    });
}
