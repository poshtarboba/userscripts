(function() {

	imgLoadBigImage(document); // загрузить большие версии изображений
	linkToAllImages(); // добавить ссылку на все фото альбома
	loadAllImages(); // загрузить все картинки если в ссылке есть &showall=true
	loadPreviews(); // кнопка загрузки превюх
	document.querySelectorAll('th').forEach(function (th){
		if (th.innerText === 'photo') th.setAttribute('width', 60);
	});

	window.addEventListener('keydown', function (e){
		if (e.keyCode !== 27) return;
		document.querySelectorAll('.full-size').forEach(e => e.classList.remove('full-size'));
	});


	function rndTime(){ return Math.floor(Math.random() * 500) + 250; }
	function rndTimeTh(){ return Math.floor(Math.random() * 3000) + 1500; }
	function getBody(xhr){ return xhr.responseText.match(/<body.*?>([\s\S]*)<\/body>/); }

	function xhrCreate(url, fn, passError = true){
		let xhr = new XMLHttpRequest();
		xhr.open('get', url);
		xhr.onreadystatechange = function(){
			if (xhr.readyState !== 4) return;
			if (xhr.status !== 200) {
				console.warn('xhr-error ' + xhr.status + ': ' + xhr.statusText);
				if (passError) fn();
				return;
			}
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
			span.innerHTML = '&nbsp;|&nbsp;<a href="' + href + '&showall=true">all</a>';
			let td = a.parentElement;
			td.style.whiteSpace = 'nowrap';
			td.insertBefore(span, a.nextElementSibling);
		});
	}

	function loadAllImages() {
		const THUMB_HEIGHT = '200px';  // высота миниатюры изображения
		const THUMB_HEIGHT_LT1 = '150px';
		const THUMB_HEIGHT_LT2 = '110px';
		const THUMB_HEIGHT_LT3 = '80px';
		const THUMB_HEIGHT_GT1 = '260px';
		const THUMB_HEIGHT_GT2 = '320px';
		const THUMB_HEIGHT_GT3 = '400px';
		addCSS();
		createTape();

		function addCSS(){
			let css = '\nhtml.smooth-scroll { scroll-behavior: smooth; }\n';
			css += 'body { -moz-user-select: none; user-select: none; }\n';
			css += 'body.tape-images-mode { margin: 0; padding: 8px; background: #000; color: #666; }\n';
			css += 'img { max-width: 100%; }\n';
			css += '#tapeTools { position: fixed; z-index: 66000; right: 20px; top: 10px; background: #fff; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); opacity: 0.1; }\n';
			css += '#tapeTools:hover, #tapeTools.active { opacity: 1; }\n';
			css += '#tapeTools span { display: block; }\n';
			css += '#tapeTools .tt-handler { height: 8px; background: #999; cursor: move; }\n';
			css += '#tapeTools span.tt-mode { padding: 0 4px 2px; font-size: 120%; cursor: pointer; }\n';
			css += '#tapeTools span.tt-mode:hover { background: #eee; }\n';
			css += '#tapeTools span.tt-mode.active { background: #ddd; }\n';
			css += '#tapeTools span.tt-mode.active:hover { background: #ccc; }\n';
			css += '#tapeTools span.tt-thumb-size { display: none; }\n';
			css += '#tapeTools span#ttm3.active ~ span.tt-thumb-size { display: block; }\n';
			css += '#tapeTools span.tt-thumb-size:after { content: ""; display: block; clear: both; }\n';
			css += '#tapeTools span.tt-thumb-size > span { float: left; width: 35%; text-align: center; border: 1px solid silver; box-sizing: border-box; cursor: pointer; opacity: 0.5; }\n';
			css += '#tapeTools span.tt-thumb-size > span:hover { background: #eee; opacity: 1; }\n';
			css += '#tapeTools span.tt-thumb-size > span:active { color: #000; border-color: #000; }\n';
			css += '#tapeTools span.tt-thumb-size > em { float: left; padding-top: 3px; width: 30%; font-size: 0.7em; font-style: normal; text-align: center; }\n';
			css += '#tapeImages p { text-align: center; }\n';
			css += '#tapeImages label { cursor: pointer; }\n';
			css += '#tapeImages input { position: relative; top: 3px; margin-left: 16px; }\n';
			css += '#tapeImages img { display: block; margin: 0 auto 20px; max-height: 98vh; }\n';
			css += '#tapeImages.ti-full-mode img { max-height: none; }\n';
			css += '#tapeImages.ti-thumb-mode img { margin: 0 0 4px; max-height: ' + THUMB_HEIGHT + '; cursor: pointer; }\n';
			css += '#tapeImages.ti-thumb-mode.ti-thumb-lt1 img { max-height: ' + THUMB_HEIGHT_LT1 + '; }\n';
			css += '#tapeImages.ti-thumb-mode.ti-thumb-lt2 img { max-height: ' + THUMB_HEIGHT_LT2 + '; }\n';
			css += '#tapeImages.ti-thumb-mode.ti-thumb-lt3 img { max-height: ' + THUMB_HEIGHT_LT3 + '; }\n';
			css += '#tapeImages.ti-thumb-mode.ti-thumb-gt1 img { max-height: ' + THUMB_HEIGHT_GT1 + '; }\n';
			css += '#tapeImages.ti-thumb-mode.ti-thumb-gt2 img { max-height: ' + THUMB_HEIGHT_GT2 + '; }\n';
			css += '#tapeImages.ti-thumb-mode.ti-thumb-gt3 img { max-height: ' + THUMB_HEIGHT_GT3 + '; }\n';
			css += '#tapeImages.ti-thumb-mode img:not(.full-size):hover { opacity: 0.8; }\n';
			css += '#tapeImages.ti-thumb-mode img.full-size { position: fixed; z-index: 33; left: 50%; top: 50%; transform: translate(-50%, -50%); max-height: 98vh; box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.9); }\n';
			css += '#tapeImages .img-wrap { display: inline-block; position: relative; }\n';
			css += '#tapeImages.ti-thumb-mode br.br { display: none; }\n';
			css += '#tapeImages .img-btn { position: absolute; right: 0; top: 0; width: 100px; min-height: 100px; opacity: 0; text-align: center; }\n';
			css += '#tapeImages .img-btn:hover { opacity: 1; }\n';
			css += '#tapeImages .img-btn a { display: block; margin-bottom: 4px; padding: 8px 0; background: #fff; border: 1px solid silver; opacity: 0.4; text-decoration: none; }\n';
			css += '#tapeImages .img-btn a:hover { opacity: 1; }\n';
			css += '#tapeImages .img-btn a:active { color: red; border-color: red; }\n';
			css += '#tapeImages.ti-thumb-mode .img-btn { display: none; }\n';
			css += '#tapeImages.ti-thumb-mode img.full-size ~ .img-btn { display: block; position: fixed; z-index: 35; opacity: 0.1; }\n';
			css += '#tapeImages.ti-thumb-mode img.full-size ~ .img-btn:hover { opacity: 1; }\n';
			css += '#pInfo { display: inline-block; padding-left: 20px; color: #333; white-space: nowrap; }\n';
			css += '#pInfo em { font-style: normal; }\n';
			let style = document.createElement('style');
			style.innerHTML = css;
			document.head.appendChild(style);
		}

		function createTape(){
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
			let userHref = '/main/user.php?user=', userName;
			document.querySelectorAll('a').forEach(function (a){
				let href = a.getAttribute('href');
				if (href && (href.substr(0, 20) === userHref)) userName = href.substr(20);
			});
			window.topLinks = '<a href="/main/search.php">Search</a> &nbsp;&nbsp;\n';
			if (userName) window.topLinks += '<a href="' + userHref + userName + '">User ' + userName + '</a> &nbsp;&nbsp; \n';
			
			let html = '<div id="tapeImages">\n<p>\n' + window.topLinks;
			html += 'A, Q - prev, next image, W - change mode:\n';
			html += '<label><input type="radio" id="trm1" name="trm" checked> screen size</label>\n';
			html += '<label><input type="radio" id="trm2" name="trm"> full size</label>\n';
			html += '<label><input type="radio" id="trm3" name="trm"> thumb size (+ / -)</label>\n';
			html += '<span id="pInfo">Loading images: <em id="curInfo"></em> / <em id="allInfo"></em></span>\n';
			html += '</p>\n<p>\n';
			document.querySelectorAll('img.big').forEach(function(img) { html += imgHTMLCode(img); });
			getImagesPage(href, html);
		}
	}

	function imgHTMLCode(img){
		let src = img.classList.contains('lazyload') ? img.dataset.src : img.getAttribute('src');
		let url = img.parentElement.nextElementSibling.getAttribute('href');
		let html = '<span class="img-wrap"><img src="" data-src="' + src + '" alt="###">';
		html += '<span class="img-btn"><a href="' + url + '">Link</a></span></span><br class="br">\n';
		return html;
	}

	function getImagesPage(href, html) {
		if (href.length === 0) {
			clearHeader();
			html += '</p></div>\n<p style="text-align: center;">' + window.topLinks + '</p>';
			document.body.innerHTML = html;
			document.getElementById('allInfo').innerText = document.querySelectorAll('img').length;
			document.body.classList.add('tape-images-mode');
			document.documentElement.classList.add('smooth-scroll');
			addTapeTools();
			addNavKeys();
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

	function loadNextImage(){
		let img = document.querySelector('img[data-src]');
		if (!img) {
			document.getElementById('pInfo').innerText = 'All images was loaded (' + document.querySelectorAll('img').length + ')';
			return;
		};
		img.addEventListener('load', eventFun);
		img.addEventListener('error', eventFun);
		img.setAttribute('src', img.dataset.src);
		delete img.dataset.src;
		function eventFun(){
			let span = document.getElementById('curInfo');
			span.innerText = +span.innerText + 1;
			setTimeout(loadNextImage, rndTime());
		}
	}

	function clearHeader(){
		document.head.querySelectorAll('meta, link, script').forEach(function(tag){ tag.remove(); });
		document.head.innerHTML = '<meta charset="utf-8">\n' + document.head.innerHTML;
		let username = document.querySelector('a[href*="?user="]').getAttribute('href').match(/\?user=(.+)/)[1];
		let albumName = document.title.replace(' @iMGSRC.RU', '');
		document.title = 'imgsrc.ru ' + username + ' - ' + albumName;
	}

	function loadPreviews(){
		let th;
		document.querySelectorAll('th').forEach((tag) => {
			if (tag.innerText.toLowerCase() === 'album name') a = tag;
		});
		if (!th) return;
		th.innerHTML += '&nbsp;|&nbsp;<span id="showTh" style="color: #c00; cursor: pointer;">show thumbs</span>';
		let btn = document.getElementById('showTh');
		btn.onclick = function (){
			btn.style.display = 'none';
			th.parentElement.parentElement.querySelectorAll('td:first-child').forEach(function (td){
				let a = td.firstElementChild;
				if (a && a.tagName === 'A') {
					a.classList.add('waiting-for-thumbs');
					a.querySelector('img').remove();
				}
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
					let url = btn.parentElement.action;
					url = url.match(/https?:\/\/imgsrc.+$/);
					if (url) {
						let xhr2 = xhrCreate(url[0], function (){
							let content2 = getBody(xhr2);
							if (content2.length !== 2) console.warn('Error parsing page, xhr:', xhr2);
							else prepareThumbs(a, content2[1]);
						});
						xhr2.send();
					}
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
			if (img.classList.contains('big')) return;
			let src = img.getAttribute('src');
			let url = img.parentElement.getAttribute('href');
			if (url === '#bp') url = a.getAttribute('href') + url;
			html += '<a target="_blank" href="' + url + '"><img src="' + src + '" alt="#"></a> \n'
		});
		if (html.length < 10) html += '-----';
		let td = a.parentElement;
		td.innerHTML += html;
	}

	function addNavKeys(){
		let tapeImages = document.getElementById('tapeImages');
		let radioMode1 = document.getElementById('trm1');
		let radioMode2 = document.getElementById('trm2');
		let radioMode3 = document.getElementById('trm3');
		let itemMode1 = document.getElementById('ttm1');
		let itemMode2 = document.getElementById('ttm2');
		let itemMode3 = document.getElementById('ttm3');
		let thumbInc = document.getElementById('thumbinc');
		let thumbDec = document.getElementById('thumbdec');
		let thumbSz = document.getElementById('thumbsz');
		let images = tapeImages.querySelectorAll('img');
		let activeImage = 0;
		radioMode1.addEventListener('click', setMode1);
		radioMode2.addEventListener('click', setMode2);
		radioMode3.addEventListener('click', setMode3);
		itemMode1.addEventListener('click', setMode1);
		itemMode2.addEventListener('click', setMode2);
		itemMode3.addEventListener('click', setMode3);
		thumbInc.addEventListener('click', increaseThumb);
		thumbDec.addEventListener('click', decreaseThumb);
		window.addEventListener('scroll', windowScroll);
		window.addEventListener('keydown', function (e){
			if (e.keyCode === 81) pressedNavKey('q'); // нажали q
			if (e.keyCode === 65) pressedNavKey('a'); // нажали a
			if (e.keyCode === 87) { // нажали w
				if (radioMode1.checked) return setMode2();
				if (radioMode2.checked) return setMode3();
				if (radioMode3.checked) return setMode1();
			}
			if (e.keyCode === 61 || e.keyCode === 107) increaseThumb(); // нажали +
			if (e.keyCode === 173 || e.keyCode === 109) decreaseThumb(); // нажали -
		});
		tapeImages.querySelectorAll('img').forEach(function (img){
			img.addEventListener('click', imgClick);
		});
		function windowScroll(){
			if (images.length < 1) return;
			if (tapeImages.classList.contains('ti-thumb-mode')) return;
			let halfScreen = window.innerHeight / 2;
			let centerPos = halfScreen + window.scrollY;
			let imgCenters = [];
			for (let i = 0; i < images.length; i++) imgCenters.push(Math.abs(centerPos - imgCenter(images[i])));
			activeImage = 0;
			for (let i = 1; i < imgCenters.length; i++) if (imgCenters[i] < imgCenters[activeImage]) activeImage = i;
		}
		function scrollToActiveImage(){
			let yPos = imgCenter(images[activeImage]) - window.innerHeight / 2;
			document.documentElement.classList.remove('smooth-scroll');
			window.scroll(0, yPos);
			document.documentElement.classList.add('smooth-scroll');
		}
		function setMode1(){
			radioMode1.checked = true;
			itemMode1.classList.add('active');
			itemMode2.classList.remove('active');
			itemMode3.classList.remove('active');
			tapeImages.classList.remove('ti-full-mode');
			tapeImages.classList.remove('ti-thumb-mode');
			scrollToActiveImage();
		}
		function setMode2(){
			radioMode2.checked = true;
			itemMode1.classList.remove('active');
			itemMode2.classList.add('active');
			itemMode3.classList.remove('active');
			tapeImages.classList.remove('ti-thumb-mode');
			tapeImages.classList.add('ti-full-mode');
			scrollToActiveImage();
		}
		function setMode3(){
			radioMode3.checked = true;
			itemMode1.classList.remove('active');
			itemMode2.classList.remove('active');
			itemMode3.classList.add('active');
			tapeImages.classList.remove('ti-full-mode');
			tapeImages.classList.add('ti-thumb-mode');
		}
		function pressedNavKey(key){
			if (images.length < 1) return;
			if (tapeImages.classList.contains('ti-thumb-mode')) return;
			let halfScreen = window.innerHeight / 2;
			let centerPos = halfScreen + window.scrollY;
			let imgCenters = [];
			for (let i = 0; i < images.length; i++) imgCenters.push(Math.abs(centerPos - imgCenter(images[i])));
			let min = 0;
			for (let i = 1; i < imgCenters.length; i++) if (imgCenters[i] < imgCenters[min]) min = i;
			let next = min + (key === 'q' ? -1 : 1);
			next = Math.max(Math.min(next, imgCenters.length - 1), 0);
			let yPos = imgCenter(images[next]) - halfScreen;
			window.scroll(0, yPos);
		}
		function imgCenter(img){ return img.clientHeight / 2 + img.getBoundingClientRect().top + pageYOffset; }
		function imgClick(){
			if (!tapeImages.classList.contains('ti-thumb-mode')) return;
			this.classList.toggle('full-size');
		}
		function increaseThumb(){
			if (!tapeImages.classList.contains('ti-thumb-mode')) return;
			if (tapeImages.classList.contains('ti-thumb-gt3')) return;
			let zoom = tapeImages.dataset.thumbsize || 0;
			thumbSz.innerText = tapeImages.dataset.thumbsize = +zoom + 1;
			changeThumbSizeClasses();
		}
		function decreaseThumb(){
			if (!tapeImages.classList.contains('ti-thumb-mode')) return;
			if (tapeImages.classList.contains('ti-thumb-lt3')) return;
			let zoom = tapeImages.dataset.thumbsize || 0;
			thumbSz.innerText = tapeImages.dataset.thumbsize = +zoom - 1;
			changeThumbSizeClasses();
		}
		function changeThumbSizeClasses(){
			tapeImages.classList.remove('ti-thumb-lt1');
			tapeImages.classList.remove('ti-thumb-lt2');
			tapeImages.classList.remove('ti-thumb-lt3');
			tapeImages.classList.remove('ti-thumb-gt1');
			tapeImages.classList.remove('ti-thumb-gt2');
			tapeImages.classList.remove('ti-thumb-gt3');
			let zoom = +tapeImages.dataset.thumbsize;
			if (zoom > 0) tapeImages.classList.add('ti-thumb-gt' + zoom);
			if (zoom < 0) tapeImages.classList.add('ti-thumb-lt' + -zoom);
		}
	}

	function addTapeTools(){
		let tapeTools = document.createElement('div');
		tapeTools.setAttribute('id', 'tapeTools');
		let html = '\n<span class="tt-handler"></span>\n';
		html += '<span class="tt-mode active" id="ttm1">screen</span>\n';
		html += '<span class="tt-mode" id="ttm2">full</span>\n';
		html += '<span class="tt-mode" id="ttm3">thumb</span>\n';
		html += '<span class="tt-thumb-size"><span id="thumbinc">+</span><span id="thumbdec">-</span>';
		html += '<em id="thumbsz">0</em>\n';
		tapeTools.innerHTML = html;
		document.body.appendChild(tapeTools);
		let x = localStorage.getItem('tapeToolsX');
		let y = localStorage.getItem('tapeToolsY');
		if (x && y) {
			tapeTools.style.right = x;
			tapeTools.style.top = y;
		}
		let ttHandler = tapeTools.querySelector('.tt-handler');
		ttHandler.addEventListener('mousedown', ttHandlerMouseDown);
		function ttHandlerMouseDown(e){
			oX = e.layerX;
			oY = e.layerY;
			tapeTools.classList.add('active');
			window.addEventListener('mousemove', ttHandlerMouseMove);
			window.addEventListener('mouseup', ttHandlerMouseUp);
		}
		function ttHandlerMouseMove(e){
			x = e.clientX;
			y = e.clientY;
			tapeTools.style.right = calcX();
			tapeTools.style.top = y - oY + 'px';
		}
		function ttHandlerMouseUp(e){
			window.removeEventListener('mousemove', ttHandlerMouseMove);
			window.removeEventListener('mouseup', ttHandlerMouseUp);
			tapeTools.classList.remove('active');
			localStorage.setItem('tapeToolsX', calcX());
			localStorage.setItem('tapeToolsY', y - oY + 'px');
		}
		function calcX(){ return document.body.clientWidth - x - ttHandler.clientWidth + oX + 'px'; }
	}

})();
