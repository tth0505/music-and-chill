var checkbox_toogle = document.getElementById('light-dark');

checkbox_toogle.addEventListener('change', function() {
    document.body.classList.toggle('drak');
});