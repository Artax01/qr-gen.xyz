document.addEventListener('DOMContentLoaded', function () {
    var burger_menu = document.getElementById('burger-menu'); // burger-menu
    var darkMode = document.getElementById('darkMode'); // theme switch button
    // element
    var side_menu = document.getElementById('side_menu');
    var blur = document.getElementById('blur');
    
    if (burger_menu && side_menu && blur) {
        burger_menu.addEventListener('click', function (event) {
            burger_menu.classList.toggle('active');
            side_menu.classList.toggle('active');
            blur.classList.toggle('active');
            event.preventDefault();
        });
        blur.addEventListener('click', function () {
            burger_menu.classList.toggle('active');
            side_menu.classList.toggle('active');
            blur.classList.toggle('active');
        });
    }
    if (darkMode) {
        darkMode.addEventListener('click', function (event) {
            document.body.classList.toggle('dark_theme');
            darkMode.classList.toggle('active');
            event.preventDefault();
        });
    }
});
