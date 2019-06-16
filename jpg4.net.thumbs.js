(function(){

	let smThumbs, smPages, smImages;

	removeElements(); // видалити зайві елементи
	mainThumbsRemake(); // головна сторінка мініатюр: перероблюю під свої вимоги
	mainThumbsCSS(); // добавляємо css

	function rndTime(){ return Math.floor(Math.random() * 500) + 250; }

	function removeElements(){
		document.querySelectorAll('style, script').forEach(function(elem){ elem.remove(); });
	}

		function mainThumbsCSS(){
		let css = 'body { font-family: sans-serif; }\n';
		css += '.thumbs-list p { display: inline-block; margin: 4px 0; vertical-align: top; border: 1px solid #eee; }\n';
		css += '.thumbs-list a { display: block; position: relative; min-width: 50px; height: 180px; padding-bottom: 16px; text-decoration: none; color: #bbb; }\n';
		css += '.thumbs-list small { position: absolute; left: 0; bottom: 0; white-space: nowrap; box-sizing: border-box; padding: 2px 4px; width: 100%; overflow: hidden; font-size: 0.7em; }\n';
		css += '.thumbs-list img { display: block; height: 180px; text-align: center; background: #eee; }\n';
		css += '.thumbs-list img.err { background: #fcc; }\n';
		css += '.mode-big-1 .thumbs-list a { min-width: 64px; height: 260px; }\n';
		css += '.mode-sml-1 .thumbs-list a { min-width: 40px; height: 120px; }\n';
		css += '.mode-big-1 .thumbs-list img { height: 260px; }\n';
		css += '.mode-sml-1 .thumbs-list img { height: 120px; }\n';
		css += '#smDetails { display: none; }\n';
		css += '.mode-more #smDetails { display: inline-block; }\n';
		css += '.mode-more .thumbs-list p { display: block; }\n';
		css += '.mode-more .thumbs-list p:after { content: ""; display: block; clear: both; }\n';
		css += '.mode-more .thumbs-list p > a { float: left; margin-right: 24px; }\n';
		css += '.mode-more .thumbs-list p span a { display: inline-block; padding-bottom: 0; height: auto; }\n';
		css += '.mode-more .thumbs-list p span.err { color: red; }\n';
		css += '.mode-more .thumbs-list p span img { height: 95px; }\n';
		css += '.mode-more.mode-big-1 .thumbs-list p span img { height: 135px; }\n';
		css += '.mode-more.mode-sml-1 .thumbs-list p span img { height: 65px; }\n';
		let style = document.createElement('style');
		style.innerText = css;
		document.head.appendChild(style);
	}

	function mainThumbsRemake(){
		if (location.href.indexOf('/tpcache/tpics.html') === -1) return;
		let div = document.createElement('div');
		let html = '<p><button id="showMode">Mode</button> &nbsp;&nbsp; <button id="showMore">Show more</button> ';
		html += '&nbsp;&nbsp; Thumbs: <span id="smThumbs">0</span> / <span id="smThumbsTotal">0</span>';
		html += '<span id="smDetails">; ';
		html += '&nbsp;&nbsp; Pages: <span id="smPages">0</span> / <span id="smPagesTotal">0</span>; ';
		html += '&nbsp;&nbsp; images: <span id="smImages">0</span> / <span id="smImagesTotal">0</span></span>.</p>';
		html += '<div class="thumbs-list">';
		document.querySelectorAll('a').forEach(function (a){
			let url = a.getAttribute('href').replace('jpg4.info', 'jpg4.net');
			let title = a.getAttribute('title') || '';
			let img = a.querySelector('img');
			html += '<p><a href="' + url + '" title="' + title + '">';
			if (img) html += '<img src="" data-src="' + img.getAttribute('src') + '" class="img-thumb" alt="#">';
			html += '<small>' + title + '</small></a></p>';
		});
		html += '</div>';
		document.body.innerHTML = html;
		document.getElementById('showMode').addEventListener('click', function (){
			let mode = (+document.body.dataset.mode || 0) + 1;
			if (mode === 3) mode = 0;
			document.body.dataset.mode = mode;
			document.body.classList.remove('mode-big-1');
			document.body.classList.remove('mode-sml-1');
			if (mode === 1) document.body.classList.add('mode-big-1');
			if (mode === 2) document.body.classList.add('mode-sml-1');
		});
		document.getElementById('showMore').addEventListener('click', function (){
			this.disabled = true;
			document.querySelectorAll('.thumbs-list p').forEach(function (p){
				let span = document.createElement('span');
				span.classList.add('waiting');
				p.appendChild(span);
			});
			document.body.classList.add('.mode-more');
			mainThumbsLoadSubpage();
		});
		smThumbs = document.getElementById('smThumbs');
		smPages = document.getElementById('smPages');
		smImages = document.getElementById('smImages');
		let n = document.querySelectorAll('.img-thumb').length;
		document.getElementById('smThumbsTotal').innerText = n;
		document.getElementById('smPagesTotal').innerText = n;
		mainThumbsLoadImg();
	}

	function mainThumbsLoadSubpage(){
		let span = document.querySelector('span.waiting');
		if (!span) {
			document.getElementById('smImagesTotal').innerText = document.querySelectorAll('.img-sub').length;
			mainThumbsLoadSubImg();
			return;
		}
		let url = span.previousElementSibling.getAttribute('href');
		let xhr = new XMLHttpRequest();
		xhr.addEventListener('readystatechange', function(){
			if (xhr.readyState !== 4) return;
			if (xhr.status !== 200) {
				console.error('Error ' + xhr.status + ': ' + xhr.statusText);
				span.classList.add('err');
				span.innerText = 'Error';
			} else {
				let html = xhr.responseText.match(/<body.*?>([\s\S]*)<\/body>/);
				if (html.length === 2) {
					let div = document.createElement('div');
					div.innerHTML = html[1];
					html = '';
					div.querySelectorAll('#picmain img').forEach(function (img){
						let src = img.getAttribute('src');
						let alt = img.getAttribute('alt');
						html += '<a href="' + src + '"><img class="img-sub" src="" data-src="' + src + '" alt="' + alt + '"></a>';
					});
					span.innerHTML = html;
				} else console.log('Error parsing page, xhr:', xhr);
			}
			smPages.innerText = +smPages.innerText + 1;
			setTimeout(mainThumbsLoadSubpage, rndTime());
		});
		xhr.open('GET', url, false);
		xhr.send();
	}

	function mainThumbsLoadImg(){
		let img = document.querySelector('.img-thumb[data-src]');
		if (!img) return;
		img.addEventListener('error', function (){ img.classList.add('err'); });
		img.addEventListener('loadend', function (){
			smThumbs.innerText = +smThumbs.innerText + 1;
			mainThumbsLoadImg();
		});
		img.setAttribute('src', img.dataset.src);
		delete img.dataset.src;
	}

	function mainThumbsLoadSubImg(){
		let img = document.querySelector('.img-sub[data-src]');
		if (!img) return;
		img.addEventListener('error', function (){ img.classList.add('err'); });
		img.addEventListener('loadend', function (){
			smThumbs.innerText = +smThumbs.innerText + 1;
			mainThumbsLoadSubImg();
		});
		img.setAttribute('src', img.dataset.src);
		delete img.dataset.src;
	}

	/*

	окрема сторінка:
	- очистити від зайвого;
	- кнопка завантаження зображень з наступних сторінок пагера;
	
	сторінка дня:
	- посилання на сторінки в стовбчик, мініатюри завантажуються справа
	
	прикрутити пошук:
	- шукати по регулярці по днях;
	- добавити можливість вибрати напрямок пошуку і дату*/

	
	// TODO: в заголовках h2 - завантаження наступної сторінки
	// добавити спінер до картинок і до сторінок
	// сторінка-агрегатор: з головної по черзі викачуються всі посилання по дням, створюється пошук-фільтр з тегами, теги зашифрувати (взяти внизу в links)
	// зміна висоти мініатюр зі збереженням в локалсторіджі і перевірці значення при отриманні фокуса


	
})();
