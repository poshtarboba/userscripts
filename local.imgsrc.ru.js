// @name         imgsrc login
// @include      http*://imgsrc.ru/main/login.php*
// @include      http*://imgsrc.ru/main/passchk.php*

(function() {
    'use strict';
    window.addEventListener('load', function(){
        setTimeout(function(){
            let pass = document.querySelector('[name="pass"]');
            if (pass) {
              // login
              document.querySelector('[name="login"]').value = 'poshtar.boba';
              pass.value = '12345'; // input your password !!!!!!!!!!!!!!!!!!!!!
            } else {
              // pwd-album
              document.querySelector('[name="pwd"]').value = '12345';
            }
        }, 500);
    });
})();