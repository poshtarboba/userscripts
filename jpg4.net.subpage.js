(function(){

	const rxPageNum = /\/pic(\d+)\.html/;
	const rxReplace = /\/pic\d+\.html/;

	removeElements();
	picMainRemake();
	picMainCSS();
	setTimeout(removeElements, 1000);
	setTimeout(removeElements, 2000);
	setTimeout(removeElements, 3000);
	setTimeout(removeElements, 5000);
	setTimeout(removeElements, 10000);

	function removeElements(){
		document.body.onclick = null;
		document.body.removeAttribute('onclick');
		document.querySelectorAll('link, style:not(.subpage), script, #relkey ul.lang').forEach(function(elem){ elem.remove(); });
		document.querySelectorAll('#google_translate_element, #goog-gt-tt, .goog-te-spinner-pos').forEach(function(elem){ elem.remove(); });
	}

	function picMainCSS(){
		let css = 'body { font-family: sans-serif; padding-top: 24px; }\n';
		css += 'button { cursor: pointer; }\n';
		css += '.tools { position: fixed; z-index: 10; left: 0; top: 0; margin: 0; padding: 4px 12px; width: 100%; box-sizing: border-box; background: #fff; border-bottom: 1px solid silver; }\n';
		css += '.pic-main-list a { display: inline-block; padding: 4px; vertical-align: top; min-width: 50px; }\n';
		css += '.pic-main-list img { display: block; height: 180px; text-align: center; background: #eee; }\n';
		css += '.pic-main-list img.err { background: #fcc; }\n';
		css += '.mode-big-1 .pic-main-list img { height: 260px; }\n';
		css += '.mode-sml-1 .pic-main-list img { height: 120px; }\n';
		css += '.lang { margin: 0; padding: 0; list-style: none; font-size: 0.8em; }\n';
		css += '.lang li { display: inline-block; }\n';
		//css += ' {}\n';
		let style = document.createElement('style');
		style.classList.add('subpage');
		style.innerText = css;
		document.head.appendChild(style);
	}

	
	function picMainRemake(){
		let picmain = document.getElementById('picmain');
		if (!picmain) return;
		let divPics = document.createElement('div');
		divPics.classList.add('pic-main-list');
		document.body.appendChild(divPics);
		let img;
		while (img = picmain.querySelector('img')) {
			let src = img.getAttribute('src');
			img.setAttribute('title', img.getAttribute('alt'));
			img.setAttribute('alt', '#');
			img.dataset.src = src;
			img.setAttribute('src', '');
			let a = document.createElement('a');
			divPics.appendChild(a);
			a.setAttribute('href', src);
			a.appendChild(img);
		}
		picmain.innerHTML = '';
		picmain.appendChild(divPics);
		addTools();
		remakeMenu();
		let url = location.href.replace(rxReplace, '/pic' + (pageNum(location.href) + 1) + '.html');
		getNextPage(url, 4);
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

	function abortClick(){
		if (!window.currentSubImg) return;
		window.currentSubImg.setAttribute('src', '');
		window.currentSubImg.classList.add('err');
		delete window.currentSubImg.dataset.src;
		window.currentSubImg = null;
		getImg();
	}

	function addTools(){
		let p = document.createElement('p');
		p.classList.add('tools');
		p.innerHTML = '<button id="showMode">Mode</button> &nbsp;&nbsp; <button id="imgAbort">Abort current image</button>';
		document.body.appendChild(p);
		document.getElementById('showMode').addEventListener('click', changeShowMode);
		document.getElementById('imgAbort').addEventListener('click', abortClick);
	}

	function getImg(){
		let img = document.querySelector('img[data-src]');
		if (!img) return;
		window.currentSubImg = img;
		img.addEventListener('error', function (){ img.classList.add('err'); });
		img.addEventListener('loadend', function (){
			window.currentSubImg = null;
			getImg();
		});
		img.setAttribute('src', img.dataset.src);
		delete img.dataset.src;
	}
	
	function pageNum(url){
		let res = url.match(rxPageNum);
		return res.length === 2 ? +res[1] : 1;
	}
	
	function getNextPage(url, counter){
		if (counter < 1) {
			getImg();
			return;
		}
		let xhr = new XMLHttpRequest();
		xhr.addEventListener('readystatechange', function(){
			if (xhr.readyState !== 4) return;
			if (xhr.status !== 200) {
				console.error('Error ' + xhr.status + ': ' + xhr.statusText);
			} else {
				let html = xhr.responseText.match(/<body.*?>([\s\S]*)<\/body>/);
				if (html.length === 2) {
					let divPics = document.querySelector('.pic-main-list');
					let div = document.createElement('div');
					div.innerHTML = html[1];
					div.querySelectorAll('#picmain img').forEach(function (img){
						let src = img.getAttribute('src');
						let alt = img.getAttribute('alt');
						let a = document.createElement('a');
						a.setAttribute('href', src);
						a.innerHTML = '<img class="img-sub" src="" data-src="' + src + '" alt="#" title="' + alt + '">';
						divPics.appendChild(a);
					});
				} else console.log('Error parsing page, xhr:', xhr);
			}
			getNextPage(url.replace(rxReplace, '/pic' + (pageNum(url) + 1) + '.html'), counter - 1);
		});
		xhr.open('GET', url);
		xhr.send();
	}

	function remakeMenu(){
		let lang = document.querySelector('.lang');
		lang.parentElement.removeAttribute('align');
		document.querySelectorAll('.sites li').forEach(function (li){ lang.appendChild(li); });
		document.querySelector('.sites').remove();
		lang.querySelectorAll('[style]').forEach(function (elem){ elem.removeAttribute('style'); });
	}

})();