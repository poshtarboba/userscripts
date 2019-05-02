(function() {

	addStyles(); // добавить стили
	scrollToImage(); // проскролить до картинки
	rareTags(); // выделить редкие теги
	createItapeButtons(); // кнопки для создания ленты изображений

	function rndTime(){ return Math.floor(Math.random() * 500) + 250; }
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

	function addStyles(){
		let style = document.createElement('style');
		let html = '#image, video { width: auto; height: auto; max-width: calc(100vw - 320px); max-height: 98vh; }\n';
		html += '#itape { text-align:center; }\n';
		html += '#itape img { display: inline-block; margin-bottom: 20px; max-width: 100%; max-height: 98vh; }\n';
		html += '#itape #fullHgh:checked ~ img { max-height: none; }\n';
		html += '.itape-btns span { color: #b4c7d9; cursor: pointer; }\n';
		html += '.itape-btns span:hover { color: #2e76b4; }\n';
		html += '.itape-btns i { font-style: normal; }\n.itape-btns b { padding-left: 16px; }\n';
		style.innerHTML = html;
		document.head.appendChild(style);
	}

	function scrollToImage(){
		let img = document.getElementById('image') || document.getElementById('webm-container');
		if (!img) return;
		let offsetTop = 0;
		// переробити, використати повний оффсет замість циклу
		while (img && img.offsetTop !== undefined) { offsetTop += img.offsetTop; img = img.offsetParent; }
		window.scroll({ top: offsetTop - 4 });
	}

	function rareTags(){
		let li = document.querySelectorAll('#tag-sidebar li');
		li.forEach(function(li){
			let span = li.querySelector('.post-count');
			if (!span) return;
			let n = parseInt(span.innerText);
			let alpha = 0;
			if (n < 50) alpha = 0.15;
			else if (n < 200) alpha = 0.12;
			else if (n < 500) alpha = 0.09;
			else if (n < 2000) alpha = 0.06;
			else if (n < 5000) alpha = 0.03;
			li.style.backgroundColor = 'rgba(255, 255, 255, ' + alpha + ')';
		});
	}

	function createItapeButtons(){
		let postList = document.getElementById('post-list');
		let poolShow = document.getElementById('pool-show');
		if (!postList && !poolShow) return;
		let html = '<li class="itape-btns">';
		html += '<span id="itapeDown">▼▼▼</span> ';
		if (postList) html += '&nbsp; &nbsp;<span id="itapeUp">▲▲▲</span> ';
		html += '<span id="itapeClear" style="display:none;">Clear</span> ';
		html += '<b id="itapeInfo" style="display: none;">Loading&nbsp;<i id="itiType">next&nbsp;pages</i>:&nbsp;';
		html += '<i id="itiCur">0</i>&nbsp;/&nbsp;<i id="itiTotal">0</i></b></li>';
		let br = document.querySelector('#subnav ul > br');
		if (br) br.remove();
		document.querySelector('#subnav ul').innerHTML += html;
		document.getElementById('itapeDown').onclick = itapeBtnClick;
		if (postList) document.getElementById('itapeUp').onclick = itapeBtnClick;
		document.getElementById('itapeClear').onclick = itapeClearClick;
	}

	function itapeBtnClick(){
		let list = document.getElementById('post-list');
		if (!list) list = document.getElementById('pool-show');
		let itapeDown = document.getElementById('itapeDown');
		let itapeUp = document.getElementById('itapeUp');
		if (itapeDown) itapeDown.style.display = 'none';
		if (itapeUp) itapeUp.style.display = 'none';
		document.getElementById('itapeInfo').style.display = '';
		let linksArr = [];
		let links = list.querySelectorAll('.thumb a');
		let down = this.getAttribute('id') === 'itapeDown';
		let i = down ? 0 : links.length - 1;
		while (i >= 0 && i < links.length) {
			linksArr.push(links[i].href);
			i += down ? 1 : -1;
		}
		let nextListPages = [];
		if (list.getAttribute('id') === 'pool-show') {
			let pagers = document.querySelectorAll('#paginator a:not(.prev_page):not(.next_page)');
			pagers.forEach(function (a){ nextListPages.push(a.href); });
		}
		document.getElementById('itiTotal').innerText = nextListPages.length;
		itapeLoadNextListPages(nextListPages, linksArr);
	}

	function itapeClearClick(){
		document.head.querySelectorAll('link, script').forEach(function(tag){ tag.remove(); });
		document.title = 'e621 - ' + document.title.replace(' - e621', '').replace('/', '');
		let styleHtml = '\nhtml, body { scroll-behavior: smooth; }\n';
		styleHtml += 'body { color: #fff; background-color: #000; }\n';
		document.head.querySelector('style').innerHTML += styleHtml;
		document.body.innerHTML = document.getElementById('itape').outerHTML;
		addImagesNavKeys(); // добавляет навигацию клавишами q, a - вверх/вниз, w - переключить #fullHgh
	}

	function itapeLoadNextListPages(nextListPages, linksArr){
		if (nextListPages.length === 0) {
			document.getElementById('itiCur').innerText = '0';
			document.getElementById('itiType').innerHTML = 'image&nbsp;pages';
			document.getElementById('itiTotal').innerText = linksArr.length;
			let html = '<div id="itape">\n<p>Keys A, Q for navigation, W - for change view</p>\n';
			html += '<input type="checkbox" id="fullHgh">&nbsp;Full&nbsp;height<br><br>\n';
			itapeLoadPages(linksArr, html);
			return;
		}
		let xhr = xhrCreate(nextListPages.shift(), function (){
			let content = getBody(xhr);
			let div = document.createElement('div');
			div.innerHTML = content[1];
			let links = div.querySelectorAll('.thumb a');
			links.forEach(function (a){ linksArr.push(a.href); });
			let inf = document.getElementById('itiCur');
			inf.innerText = +inf.innerText + 1;
			itapeLoadNextListPages(nextListPages, linksArr);
		});
		setTimeout(function (){ xhr.send(); }, rndTime());
	}

	function itapeLoadPages(links, html){
		if (links.length === 0) {
			document.getElementById('content').innerHTML += html + '</div>';
			document.getElementById('itiType').innerText = 'images';
			document.getElementById('itiCur').innerText = 0;
			document.getElementById('itiTotal').innerText = document.querySelectorAll('#itape img').length;
			itapeLoadImages();
			return;
		}
		let xhr = xhrCreate(links.shift(), function (){
			let content = getBody(xhr);
			let div = document.createElement('div');
			div.innerHTML = content[1];
			let img = new Image();
			let highRes = div.querySelector('#highres');
			if (highRes) html += '<img src="" data-src="' + highRes.href + '" alt="#"><br>\n';
			let inf = document.getElementById('itiCur');
			inf.innerText = +inf.innerText + 1;
			itapeLoadPages(links, html)
		});
		setTimeout(function (){ xhr.send(); }, rndTime());
	}

	function itapeLoadImages(){
		let img = document.querySelector('#itape img[data-src]');
		if (!img) {
			document.getElementById('itapeClear').style.display = '';
			return;
		}
		img.onloadend = function (){
			let inf = document.getElementById('itiCur');
			inf.innerText = +inf.innerText + 1;
			itapeLoadImages();
		};
		setTimeout(function (){
			img.setAttribute('src', img.dataset.src);
			delete img.dataset.src;
		}, rndTime());
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
