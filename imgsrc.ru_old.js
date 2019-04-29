/*

TODO:
- перед перезагрузкой категорий сохранять список в localstorage, после перезагрузки проверять новые альбомы, если они появились - добавлять в Title "[n] ", на onfocus - очищать localstorage и title

*/

(function() {
	
	removeSomeBlocks(); // удалить разные ненужные элементы
	btnNextClick(); // автопереход по кнопке "Продолжить просмотр"
	linkToAllImages(); // добавить ссылку на все фото альбома
	imgLoadBigImage(document); // загрузить большие версии изображений
	loadAllImages(); // загрузить все изображения на одной странице
	
	if (isCatPage() || isSearchPage()) {
		addTableCSS(); // ховер-эффект для таблиц
		catAutoReload(); // авторелоад списка категории
	}
	if (isUserPage()) {
		addTableCSS(); // ховер-эффект для таблиц
	}
	if (isSomeThumbsPages()) {
		loadAllThumbs(); // загрузить все превюхи на одной странице
	}
	
	
	function isCatPage(){ return location.pathname.substr(0, 5) === '/cat/'; }
	function isSearchPage(){ return location.pathname.substr(0, 16) === '/main/search.php'; }
	function isUserPage(){ return location.pathname === '/main/user.php'; }
	function isSomeThumbsPages(){
		
	}
	
	function addTableCSS() {
		console.log('Add hover for table');
		let style = fxCreateTag('style');
		style.innerText = '.zebra tr:hover > td { background-color: #c5ccd0; }';
		document.head.appendChild(style);
		fx$$('table th').forEach(function(th) {
			if (th.innerText === 'фото') th.parentElement.parentElement.parentElement.classList.add('zebra');
		});
	}
	
	function btnNextClick() {
		let btnNext = fx$1('[value="Продолжить просмотр"]');
		if (btnNext) btnNext.parentElement.submit();
	}
	
	function catAutoReload() {
		console.log('autoreload');
		let a = fx$1('a[href="/main/search.php"]');
		let c = Math.floor(Math.random() * 241 + 60);
		let span = fxCreateTag('span');
		span.style.paddingRight = '12px';
		span.innerText = c;
		a.parentElement.insertBefore(span, a);
		let i = setInterval(function() {
			span.innerText = --c;
			if (c <= 0) {
				clearInterval(i);
				location.reload();
			}
		}, 1000);
	}
	
	function imgLoadBigImage(parent) {
		let i = 0;
		fx$$('img[data-src]', parent).forEach(function(img) {
			img.setAttribute('src', img.dataset.src);
			img.classList.remove('lazyload');
			delete img.dataset.src;
			i++;
		});
		if (i) console.log('Loaded big images:', i);
	}
	
	function linkToAllImages() {
		fx$$('a[href]').forEach(function(a) {
			let href = a.getAttribute('href');
			if (href.substr(0, 14) === '/main/tape.php') {
				console.log('Add link to all images');
				a.innerText = 'все фото постранично';
				let span = fxCreateTag('span');
				span.innerHTML = ' | <a href="' + href + '&showall=true">все фото альбома</a>';
				a.parentElement.insertBefore(span, a.nextElementSibling);
			}
		});
	}
	
	function loadAllImages() {
		let search = location.search.substr(1).split('&');
		if (search.includes('showall=true')) {
			let href = [];
			fx$$('a.navdot[href]').forEach(function(a) {
				let url = a.getAttribute('href');
				href.forEach(function(item) { if (item === url) url = null; });
				if (url) href.push(url);
			});
			if (href.length) console.log('Load all images, found pages:', href.length + 1);
			let style = fxCreateTag('style');
			style.innerHTML = 'img.big { display: inline-block; margin-bottom: 12px; } .images-page { padding: 20px 0;}';
			document.head.appendChild(style);
			let div = fxCreateTag('div');
			div.classList.add('images-page');
			let html = '';
			fx$$('img.big').forEach(function(img) { html += img.outerHTML + '<br>'; });
			div.innerHTML = html;
			document.body.innerHTML = '';
			document.body.appendChild(div);
			getImagesPage(href);
		}
	}
	
	function getImagesPage(href) {
		if (href.length === 0) return false;
		console.log('Get next page, total left:', href.length);
		fxGetURI(href.shift(), function(xhr){
			if (xhr.status === 200){
				let resp = xhr.response.match(/<body>([\s\S]*)<\/body>/gim);
				if (!resp[0]) return;
				let div = fxCreateTag('div');
				div.classList.add('images-page');
				div.innerHTML = resp[0].replace(/<\/?body>/g, '');
				imgLoadBigImage(div);
				let html = '';
				fx$$('img.big', div).forEach(function(img){ html += img.outerHTML + '<br>'; })
				div.innerHTML = html;
				document.body.appendChild(div);
			}
			getImagesPage(href);
		});
	}
	
	function removeSomeBlocks() {
		removeScripts(); // удалить скрипты
		removeFromHeader(); // удалить элементы из хедера
		removeFromFooter(); // удалить элементы из футера
		if (isCatPage()) removeFineText(); // удалить красивый текст на страницах категорий
		
		function removeScripts() {
			fx$$('body script').forEach(function(script) { script.remove(); });
			fx$$('noscript').forEach(function(noscript) { noscript.remove(); });
			fx$$('link[href*="flags.css"]').forEach(function(link) { link.remove(); });
		}
		function removeFromHeader() {
			fx$$('img.badge').forEach(function(img) { img.parentElement.innerHTML = "[ Logout ]" });
			fx$$('.topmenu a.tomato').forEach(function(a) { a.remove(); });
			fx$$('a[href="/main/dudes.php"]').forEach(function(a) { a.remove(); });
			fx$$('tr.topmenu td[align="right"]').forEach(function(td) { td.innerHTML = td.innerHTML.replace(/\|/g, '&nbsp;'); });
			fx$$('td[width="100"] img[width="100"][height="100"]').forEach(function(img) { img.parentElement.remove(); });
		}
		function removeFromFooter() {
			let bottomLine = fx$1('td.bottomline');
			if (bottomLine) bottomLine.parentElement.remove();
			fx$$('body > a').forEach(function(a) { a.remove(); });
		}
		function removeFineText() {
			let formSearch = fx$1('form[name="srch"]');
			if (!formSearch) return;
			let h2, p;
			while (true) {
				h2 = formSearch.nextElementSibling;
				p = h2.nextElementSibling;
				if (h2 && h2.tagName.toLowerCase() !== 'h2') break;
				if (p && p.tagName.toLowerCase() !== 'p') break;
				if (h2.innerText === 'Подразделы') break;
				if (h2.innerText === 'Популярные теги раздела') break;
				h2.remove();
				p.remove();
			}
		}
	}
	
	function loadAllThumbs(){
		let allPhotoPerPages;
		for (let i = 0; i < document.links.length; i++) {
			if (document.links[i].innerText === 'все фото постранично') {
				allPhotoPerPages = true;
				break;
			}
		}
		// если есть пагинация
		return allPhotoPerPages;// && pagination;
	}
	
})();
