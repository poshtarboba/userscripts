(function() {

	addStyles(); // добавить стили
	scrollToImage(); // проскролить до картинки
	rareTags(); // выделить редкие теги
	createItapeButtons(); // кнопки для создания ленты изображений

	function rndTime(){ return Math.floor(Math.random() * 500) + 250; }
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

	function addStyles(){
		const THUMB_HEIGHT = '200px';  // высота миниатюры изображения
		const THUMB_HEIGHT_LT1 = '150px';
		const THUMB_HEIGHT_LT2 = '110px';
		const THUMB_HEIGHT_LT3 = '80px';
		const THUMB_HEIGHT_GT1 = '260px';
		const THUMB_HEIGHT_GT2 = '320px';
		const THUMB_HEIGHT_GT3 = '400px';
		let style = document.createElement('style');
		let css = '\n#image, video { width: auto; height: auto; max-width: calc(100vw - 320px); max-height: 98vh; }\n';
		css += '.itape-btns span { color: #b4c7d9; cursor: pointer; }\n';
		css += '.itape-btns span:hover { color: #2e76b4; }\n';
		css += '.itape-btns i { font-style: normal; }\n';
		css += '.itape-btns b { padding-left: 16px; }\n';
		css += 'html.smooth-scroll { scroll-behavior: smooth; }\n';
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
		css += '#tapeImages.ti-thumb-mode img { display: inline-block; margin: 0 0 4px; max-height: ' + THUMB_HEIGHT + '; cursor: pointer; }\n';
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
		css += '#itapeDown, #itapeUp, #itapeClear, #itapeInfo { display: inline-block; padding-left: 12px; white-space: nowrap; }\n';
		style.innerHTML = css;
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
		html += '<span id="itapeDown">▼▼▼</span>';
		if (postList) html += '<span id="itapeUp">▲▲▲</span>';
		html += '<span id="itapeClear" style="display:none;">Clear</span>';
		html += '<b id="itapeInfo" style="display: none;">Loading <i id="itiType">next pages</i>:';
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
		let pageNum = location.href.match(/index\/(\d+)\//);
		pageNum = pageNum ? ' ' + pageNum[1] : '';
		document.head.querySelectorAll('link, script').forEach(function(tag){ tag.remove(); });
		document.title = 'e621 - ' + document.title.replace(' - e621', '').replace('/', '') + pageNum;
		document.body.innerHTML = document.getElementById('tapeImages').outerHTML;
		document.body.classList.add('tape-images-mode');
		document.documentElement.classList.add('smooth-scroll');
		addTapeTools();
		addNavKeys(); // добавляет навигацию клавишами q, a - вверх/вниз, w - переключить #fullHgh
	}

	function itapeLoadNextListPages(nextListPages, linksArr){
		if (nextListPages.length === 0) {
			document.getElementById('itiCur').innerText = '0';
			document.getElementById('itiType').innerHTML = 'image&nbsp;pages';
			document.getElementById('itiTotal').innerText = linksArr.length;
			let html = '<div id="tapeImages">\n';
			html += '<p>\nA, Q - prev, next image, W - change mode:\n';
			html += '<label><input type="radio" id="trm1" name="trm" checked> screen size</label>\n';
			html += '<label><input type="radio" id="trm2" name="trm"> full size</label>\n';
			html += '<label><input type="radio" id="trm3" name="trm"> thumb size (+ / -)</label>\n</p>\n<p>\n';
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
			document.getElementById('itiTotal').innerText = document.querySelectorAll('#tapeImages img').length;
			itapeLoadImages();
			return;
		}
		let currentLink = links.shift();
		let xhr = xhrCreate(currentLink, function (){
			let content = getBody(xhr);
			let div = document.createElement('div');
			div.innerHTML = content[1];
			let img = new Image();
			let highRes = div.querySelector('#highres');
			if (highRes) {
				html += '<span class="img-wrap"><img src="" data-src="' + highRes.href + '" alt="###">';
				html += '<span class="img-btn"><a href="' + currentLink + '">Link</a>';
				html += '</span></span><br class="br">\n';
			}
			let inf = document.getElementById('itiCur');
			inf.innerText = +inf.innerText + 1;
			itapeLoadPages(links, html)
		});
		setTimeout(function (){ xhr.send(); }, rndTime());
	}

	function itapeLoadImages(){
		let img = document.querySelector('#tapeImages img[data-src]');
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

})();
