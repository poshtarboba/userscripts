// ==UserScript==
// @name         jpg4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.jpg4.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const MAX_WIDTH = '150px';
    const MAX_HEIGHT = '200px';

    // мініатюри зображень
    let picMain = document.getElementById('picmain');
    let spanCount;
    let stopRecursia = false;

    if (picMain) {
        picMain.style.fontSize = '0';
        picMain.style.lineHeight = '0';
        picMain.querySelectorAll('p').forEach(function(p){
            p.style.display = 'inline-block';
            p.style.padding = '2px';
            p.style.fontSize = '0';
            p.style.lineHeight = '0';
            let img = p.querySelector('img');
            if (img) p.innerHTML = '<a href="' + img.getAttribute('src') + '">' + p.innerHTML.replace(/<br>/g, '') + '</a>';
        });
        picMain.querySelectorAll('img').forEach(function(img){
            img.style.maxWidth = MAX_WIDTH;
            img.style.maxHeight = MAX_HEIGHT;
        });
    }

    // зміна посилань на головній з купою картинок
    let linksLength = document.links.length;
    for (let i = 0; i < linksLength; i++){
        document.links[i].setAttribute('href', document.links[i].getAttribute('href').replace('jpg4.info', 'jpg4.net'));
    }

    // кнопка дозагрузки сторінок
    if (picMain) {
        let h1 = document.querySelector('h1');
        let html = ' <button class="show-all">Show all pages</button>';
        html += ' <i style="font-size: 60%; font-weight: normal;">Loaded: <span class="count">1</span></i>';
        html += ' <button class="stop">stop</button>';
        h1.innerHTML += html;
        spanCount = h1.querySelector('.count');
        h1.querySelector('.show-all').onclick = showAllPages;
        h1.querySelector('.stop').onclick = function(){
            this.disabled = true;
            stopRecursia = true;
        };
    }



    function showAllPages(){
        this.disabled = true;
        let n = location.href.lastIndexOf('/');
        let currentPage = parseInt(location.href.substr(n + 4));
        if (!currentPage) return;
        givePageRecursia(currentPage + 1);
    }

    function givePageRecursia(pageNum){
        let n = location.href.lastIndexOf('/');
        let url = location.href.substr(0, n + 4) + pageNum + '.html';
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) console.error('Error ' + xhr.status + ': ' + xhr.statusText);
            else givePageCallback(xhr, pageNum + 1);
            //console.log(xhr.responseText);
        }
        xhr.open('GET', url);
        xhr.send();
    }

    function givePageCallback(xhr, nextPageNum){
        let div = document.createElement('div');
        div.innerHTML = xhr.responseText;
        let imgs = div.querySelectorAll('#picmain img');
        if (!imgs.length) {
            spanCount.innerText += ' done';
            return;
        }
        let html = '';
        imgs.forEach(function(img){
            img.style.maxWidth = MAX_WIDTH;
            img.style.maxHeight = MAX_HEIGHT;
            html += ' <a href="' + img.getAttribute('src') + '">' + img.outerHTML + '</a>';
        });
        picMain.innerHTML += html;
        spanCount.innerText = nextPageNum - 1;
        if (!stopRecursia) givePageRecursia(nextPageNum);
    }

})();