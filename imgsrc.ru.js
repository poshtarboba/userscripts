(function() {

	imgLoadBigImage(document); // загрузить большие версии изображений
	linkToAllImages(); // добавить ссылку на все фото альбома
	loadAllImages(); // загрузить все картинки если в ссылке есть &showall=true
	loadPreviews(); // кнопка загрузки превюх

	function rndTime(){ return Math.floor(Math.random() * 500) + 250; }
	function rndTimeTh(){ return Math.floor(Math.random() * 3000) + 1500; }
	function getBody(xhr){ return xhr.responseText.match(/<body.*?>([\s\S]*)<\/body>/); }

	function xhrCreate(url, fn){
		let xhr = new XMLHttpRequest();
		xhr.open('get', url);
		xhr.onreadystatechange = function(){
			if (xhr.readyState !== 4) return;
			if (xhr.status !== 200) return console.log('xhr-error ' + xhr.status + ': ' + xhr.statusText);
			fn();
		}
		return xhr;
	}

	function imgLoadBigImage(parent) {
		let i = 0;
		parent.querySelectorAll('img[data-src]').forEach(function(img) {
			setTimeout(fun, i++ * 500 + rndTime(), img);
		});
		if (i) console.log('Loading big images:', i);
		function fun(img){
			img.classList.remove('lazyload');
			img.setAttribute('src', img.dataset.src);
			delete img.dataset.src;
		}
	}

	function linkToAllImages() {
		document.querySelectorAll('a[href*="/main/tape.php"]').forEach(function(a) {
			let href = a.getAttribute('href');
			let span = document.createElement('span');
			span.innerHTML = '&nbsp;|&nbsp;<a id="saLnk" href="' + href + '&showall=true">all</a>';
			a.parentElement.insertBefore(span, a.nextElementSibling);
		});
	}

	function loadAllImages() {
		let search = location.search.substr(1).split('&');
		if (!search.includes('showall=true')) return;
		let href = [];
		document.querySelectorAll('a.navi[href]').forEach(function(a) {
			let url = a.href;
			if (!href.includes(url)) href.push(url);
		});
		let infoText = document.createElement('h1');
		infoText.innerHTML = 'Preparing: <span id="infoText">1</span> / ' + (href.length + 1);
		document.body.insertBefore(infoText, document.body.firstElementChild);
		let style = document.createElement('style');
		let styleHtml = '\nhtml, body { scroll-behavior: smooth; }\n';
		styleHtml += 'body { color: #fff; background-color: #000; text-align: center; }\n';
		styleHtml += 'img[alt="###"] { display: inline-block; margin-bottom: 12px; }\n';
		styleHtml += '#itape { text-align:center; }\n';
		styleHtml += '#itape img { display: inline-block; margin-bottom: 20px; max-width: 100%; max-height: 98vh; }\n';
		styleHtml += '#itape #fullHgh:checked ~ img { max-height: none; }\n';
		style.innerHTML = styleHtml;
		document.head.appendChild(style);
		let html = '<div id="itape">\n<input type="checkbox" id="fullHgh">&nbsp;Full&nbsp;height<br><br>\n';
		html += '<p id="pInfo">Loading images: ';
		html += '<span id="curInfo"></span> / <span id="allInfo"></span></p>\n';
		document.querySelectorAll('img.big').forEach(function(img) { html += imgHTMLCode(img); });
		getImagesPage(href, html);
	}

	function getImagesPage(href, html) {
		if (href.length === 0) {
			clearHeader();
			document.body.innerHTML = html + '</div>';
			document.getElementById('allInfo').innerText = document.querySelectorAll('img').length;
			addImagesNavKeys(); // добавляет навигацию клавишами q, a - вверх/вниз, w - переключить #fullHgh
			loadNextImage();
			return;
		}
		console.log('Get next page, total left:', href.length);
		let infoText = document.getElementById('infoText');
		infoText.innerText = +infoText.innerText + 1;
		let xhr = xhrCreate(href.shift(), function (){
			let content = getBody(xhr);
			if (content.length !== 2) console.warn('Error parsing page, xhr:', xhr);
			else {
				let div = document.createElement('div');
				div.innerHTML = content[1];
				div.querySelectorAll('img.big').forEach(function (img){ html += imgHTMLCode(img); });
			}
			getImagesPage(href, html);
		});
		setTimeout(function (){ xhr.send(); }, rndTime());
	}

	function imgHTMLCode(img){
		let url = img.classList.contains('lazyload') ? img.dataset.src : img.getAttribute('src');
		return '<img src="" data-src="' + url + '" alt="###"><br>\n';
	}

	function loadNextImage(){
		let img = document.querySelector('img[data-src]');
		if (!img) {
			document.getElementById('pInfo').innerText = 'All images was loaded';
			return;
		};
		img.addEventListener('load', function (){
			let span = document.getElementById('curInfo');
			span.innerText = +span.innerText + 1;
			setTimeout(loadNextImage, rndTime());
		});
		img.setAttribute('src', img.dataset.src);
		delete img.dataset.src;
	}

	function clearHeader(){
		document.head.querySelectorAll('meta, link, script').forEach(function(tag){ tag.remove(); });
		document.head.innerHTML = '<meta charset="utf-8">\n' + document.head.innerHTML;
		let username = document.querySelector('a[href*="?user="]').getAttribute('href').match(/\?user=(.+)/)[1];
		let albumName = document.title.replace(' @iMGSRC.RU', '');
		document.title = 'imgsrc.ru ' + username + ' - ' + albumName;
	}

	function loadPreviews(){
		let a = document.querySelector('[href*="/main/switch.php?show=pix"]');
		if (!a) return;
		let th = a.parentElement;
		th.innerHTML += ' <span id="showTh" style="color: #c00; cursor: pointer;">show thumbs</span>';
		let btn = document.getElementById('showTh');
		btn.onclick = function (){
			btn.style.display = 'none';
			th.parentElement.parentElement.querySelectorAll('td:first-child').forEach(function (td){
				let a = td.firstElementChild;
				if (a) a.classList.add('waiting-for-thumbs');
			});
			loadNextThumbs();
		};
	}

	function loadNextThumbs(){
		let a = document.querySelector('.waiting-for-thumbs');
		if (!a) return;
		a.classList.remove('waiting-for-thumbs');
		let xhr = xhrCreate(a.href, function (){
			let content = getBody(xhr);
			if (content.length !== 2) console.warn('Error parsing page, xhr:', xhr);
			else {
				let div = document.createElement('div');
				div.innerHTML = content[1];
				let btn = div.querySelector('input[value="Continue to album"]');
				if (!btn) btn = div.querySelector('input[value="Продолжить просмотр"]');
				if (btn) {
					let xhr2 = xhrCreate(btn.parentElement.action, function (){
						let content2 = getBody(xhr2);
						if (content2.length !== 2) console.warn('Error parsing page, xhr:', xhr2);
						else prepareThumbs(a, content2[1]);
					});
					xhr2.send();
				} else prepareThumbs(a, content[1]);
			}
			loadNextThumbs();
		});
		setTimeout(function (){ xhr.send(); }, rndTimeTh());
	}

	function prepareThumbs(a, content){
		let div = document.createElement('div');
		div.innerHTML = content;
		let html = '<br>\n';
		div.querySelectorAll('a[href*="#bp"] img').forEach(function (img){
			let src = img.getAttribute('src');
			let url = img.parentElement.getAttribute('href');
			if (url === '#bp') url = a.getAttribute('href') + url;
			html += '<a target="_blank" href="' + url + '"><img src="' + src + '" alt="#"></a> \n'
		});
		if (html.length < 10) html += '-----';
		let td = a.parentElement;
		td.innerHTML += html;
	}

	function addImagesNavKeys(){
		window.addEventListener('keydown', function (e){
			if (e.keyCode === 81) pressedNavKey('q'); // нажали q
			if (e.keyCode === 65) pressedNavKey('a'); // нажали a
			if (e.keyCode === 87) pressedWkey();
		});
		function pressedWkey(){
			let input = document.getElementById('fullHgh');
			if (input) input.checked = !input.checked;
		}
		function pressedNavKey(key){
			if (document.images.length < 1) return;
			let halfScreen = window.innerHeight / 2;
			let centerPos = halfScreen + window.scrollY;
			let imgCenters = [];
			for (let i = 0; i < document.images.length; i++) imgCenters.push(Math.abs(centerPos - imgCenter(document.images[i])));
			let min = 0;
			for (let i = 1; i < imgCenters.length; i++) if (imgCenters[i] < imgCenters[min]) min = i;
			let next = min + (key === 'q' ? -1 : 1);
			if (next < 0) next = 0;
			if (next > imgCenters.length - 1) next = imgCenters.length - 1;
			let yPos = imgCenter(document.images[next]) - halfScreen;
			window.scroll(0, yPos);
		}
		function imgCenter(img){ return img.clientHeight / 2 + img.offsetTop; }
	}

})();
