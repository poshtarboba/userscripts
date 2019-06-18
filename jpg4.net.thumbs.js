(function(){

	/*
	сторінка дня:
	- посилання на сторінки в стовбчик, мініатюри завантажуються справа
	
	прикрутити пошук:
	- шукати по регулярці по днях;
	- добавити можливість вибрати напрямок пошуку і дату
	*/

	// TODO: в заголовках h2 - завантаження наступної сторінки
	// сторінка-агрегатор: з головної по черзі викачуються всі посилання по дням, створюється пошук-фільтр з тегами, теги зашифрувати (взяти внизу в links)

	let smThumbs, smImages;

	removeElements();
	mainThumbsRemake();
	mainThumbsCSS();

	function rndTime(){ return Math.floor(Math.random() * 500) + 250; }

	function removeElements(){
		document.querySelectorAll('style, script').forEach(function(elem){ elem.remove(); });
	}

	function mainThumbsCSS(){
		let css = 'body { font-family: sans-serif; }\n';
		css += 'button { cursor: pointer; }\n';
		css += '.tools { position: fixed; z-index: 10; left: 0; top: 0; box-sizing: border-box; margin: 0; padding: 4px 12px; width: 100%; background: #fff; border-bottom: 1px solid silver;}\n';
		css += '.thumbs-list { padding-top: 40px; }\n';
		css += '.thumbs-list p { display: inline-block; margin: 4px 0; vertical-align: top; border: 1px solid #eee; }\n';
		css += '.thumbs-list a { display: block; position: relative; min-width: 50px; height: 180px; padding-bottom: 16px; text-decoration: none; color: #bbb; }\n';
		css += '.thumbs-list small { position: absolute; left: 0; bottom: 0; white-space: nowrap; box-sizing: border-box; padding: 2px 4px; width: 100%; overflow: hidden; font-size: 0.7em; }\n';
		css += '.thumbs-list img { display: block; height: 180px; text-align: center; background: #eee; }\n';
		css += '.thumbs-list img.err { background: #fcc; }\n';
		css += '.mode-big-1 .thumbs-list a { min-width: 64px; height: 260px; }\n';
		css += '.mode-sml-1 .thumbs-list a { min-width: 40px; height: 120px; }\n';
		css += '.mode-big-1 .thumbs-list img { height: 260px; }\n';
		css += '.mode-sml-1 .thumbs-list img { height: 120px; }\n';
		css += '.sm-details { display: none; }\n';
		css += '.mode-more .sm-details { display: inline-block; }\n';
		css += '.mode-more .thumbs-list p { display: block; margin-bottom: 24px; }\n';
		css += '.mode-more .thumbs-list p:after { content: ""; display: block; clear: both; }\n';
		css += '.mode-more .thumbs-list p > a { float: left; margin-right: 24px; }\n';
		css += '.mode-more .thumbs-list p span a { display: inline-block; padding: 0 4px 8px; height: auto; vertical-align: top; }\n';
		css += '.mode-more .thumbs-list p span.err { color: red; }\n';
		css += '.mode-more .thumbs-list p span img { height: 120px; }\n';
		css += '.mode-more .thumbs-list p span button { padding: 16px 32px; font-size: 1.5em; cursor: pointer; }\n';
		css += '.mode-more.mode-big-1 .thumbs-list p span img { height: 180px; }\n';
		css += '.mode-more.mode-sml-1 .thumbs-list p span img { height: 85px; }\n';
		let style = document.createElement('style');
		style.innerText = css;
		document.head.appendChild(style);
	}

	function mainThumbsRemake(){
		if (location.href.indexOf('/tpcache/tpics.html') === -1) return;
		let div = document.createElement('div');
		let html = '<p class="tools"><button id="showMode">Mode</button> &nbsp;&nbsp; <button id="showMore">Show more</button> ';
		html += '&nbsp;&nbsp; thumbs: <span id="smThumbs">0</span> / <span id="smThumbsTotal">0</span>';
		html += '<span class="sm-details">; ';
		html += '&nbsp;&nbsp; images queue: <span id="smImages">0</span> <button id="smAbort">Abort current</button></span>.</p>';
		html += '<div class="thumbs-list">';
		document.querySelectorAll('a').forEach(function (a){
			let url = a.getAttribute('href').replace('jpg4.info', 'jpg4.net');
			let title = a.getAttribute('title') || '';
			let img = a.querySelector('img');
			html += '<p><a href="' + url + '" title="' + title + '" target="_blank">';
			if (img) html += '<img src="" data-src="' + img.getAttribute('src') + '" class="img-thumb" alt="#">';
			html += '<small>' + title + '</small></a></p>\n';
		});
		html += '</div>';
		div.innerHTML = html;
		let divRm = document.createElement('div');
		divRm.setAttribute('id', 'divRm');
		while (document.body.children.length) divRm.appendChild(document.body.firstElementChild);
		document.body.appendChild(div);
		document.body.appendChild(divRm);
		document.getElementById('showMode').addEventListener('click', changeShowMode);
		document.getElementById('showMore').addEventListener('click', showMoreClick);
		document.getElementById('smAbort').addEventListener('click', abortClick);
		smThumbs = document.getElementById('smThumbs');
		smImages = document.getElementById('smImages');
		document.getElementById('smThumbsTotal').innerText = document.querySelectorAll('.img-thumb').length;
		mainThumbsLoadImg();
	}

	function mainThumbsLoadSubpage(span){
		let url = span.previousElementSibling.getAttribute('href');
		let xhr = new XMLHttpRequest();
		xhr.addEventListener('readystatechange', function(){
			if (xhr.readyState !== 4) return;
			if (xhr.status !== 200) {
				console.error('Error ' + xhr.status + ': ' + xhr.statusText);
				span.classList.add('err');
				span.innerText = 'Error xhr.status';
			} else {
				let html = xhr.responseText.match(/<body.*?>([\s\S]*)<\/body>/);
				if (html.length === 2) {
					let div = document.createElement('div');
					div.innerHTML = html[1];
					html = '';
					div.querySelectorAll('#picmain img').forEach(function (img){
						let src = img.getAttribute('src');
						let alt = img.getAttribute('alt');
						html += '<a href="' + src + '" target="_blank"><img class="img-sub" src="" data-src="' + src + '" alt="#" title="' + alt + '"></a>';
					});
					span.innerHTML = html;
				} else {
					console.log('Error parsing page, xhr:', xhr);
					span.classList.add('err');
					span.innerText = 'Error parsing page';
				}
			}
		});
		xhr.open('GET', url);
		xhr.send();
	}

	function mainThumbsLoadImg(){
		let img = document.querySelector('.img-thumb[data-src]');
		if (!img) {
			document.getElementById('divRm').remove();
			return;
		}
		img.addEventListener('error', function (){ img.classList.add('err'); });
		img.addEventListener('loadend', function (){
			smThumbs.innerText = +smThumbs.innerText + 1;
			mainThumbsLoadImg();
		});
		img.setAttribute('src', img.dataset.src);
		delete img.dataset.src;
	}

	function mainThumbsLoadSubImg(){
		smImages.innerText = document.querySelectorAll('.img-sub[data-src]').length;
		let img = document.querySelector('.img-sub[data-src]');
		if (!img) {
			setTimeout(mainThumbsLoadSubImg, 5000);
			return;
		}
		window.currentSubImg = img;
		img.addEventListener('error', function (){ img.classList.add('err'); });
		img.addEventListener('loadend', function (){
			window.currentSubImg = null;
			mainThumbsLoadSubImg();
		});
		img.setAttribute('src', img.dataset.src);
		delete img.dataset.src;
	}

	function changeShowMode(){
		let mode = (+document.body.dataset.mode || 0) + 1;
		if (mode === 3) mode = 0;
		document.body.dataset.mode = mode;
		document.body.classList.remove('mode-big-1');
		document.body.classList.remove('mode-sml-1');
		if (mode === 1) document.body.classList.add('mode-big-1');
		if (mode === 2) document.body.classList.add('mode-sml-1');
	}

	function showMoreClick(){
		this.disabled = true;
		document.querySelectorAll('.thumbs-list p').forEach(function (p){
			let span = document.createElement('span');
			span.classList.add('waiting');
			span.innerHTML = '<button>Get images</button>';
			span.querySelector('button').addEventListener('click', function (){
				mainThumbsLoadSubpage(span);
			});
			p.appendChild(span);
		});
		document.body.classList.add('mode-more');
		setTimeout(mainThumbsLoadSubImg, 5000);
		mainThumbsLoadSubpage();
	}

	function abortClick(){
		if (!window.currentSubImg) return;
		window.currentSubImg.setAttribute('src', '');
		window.currentSubImg.classList.add('err');
		window.currentSubImg = null;
		mainThumbsLoadSubImg();
	}

})();
