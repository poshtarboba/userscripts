(function(){

old:

	const MAX_WIDTH = '150px';
	const MAX_HEIGHT = '200px';

	//remakeImages();
	//addStyles();
	//addControlls();
	//imgOnLoad();
	//loadNextPages();
	

	function remakeImages(){
		// робимо картинки маленькими і клікабельними
		let picmain = document.getElementById('picmain');
		if (!picmain) return;
		picmain.classList.add('picmain');
		let images = document.querySelectorAll('img');
		let html = '';
		images.forEach(function(img){
			img.setAttribute('alt', 'img');
			html += '<a href="' + img.getAttribute('src') + '">' + img.outerHTML;
			html += '<br><span>' + img.naturalWidth + ' x ' + img.naturalHeight + '</span></a>';
		});
		picmain.innerHTML = html;
	}
	
	function addStyles(){
		// додаємо стилі
		let styles = document.createElement('style');
		styles.innerHTML = '.picmain a { display: inline-block; padding: 4px 8px; text-decoration: none; font-size: 12px; color: #999; } .picmain img { max-height: 180px; border: 4px solid transparent; } .picmain a:hover img { border-color: #ddd; }';
		document.head.appendChild(styles);
	}
	
	function addControlls(){
		let paging = document.getElementById('paging');
		if (!paging) return;
		let table = document.createElement('table');
		table.innerHTML = paging.innerHTML;
		table.setAttribute('width', '100%');
		table.setAttribute('border', '0');
		table.setAttribute('bgcolor', '#E6d1FF');
		let relkey = document.getElementById('relkey');
		relkey.parentElement.insertBefore(table, relkey);
	}

	function imgOnLoad(){
		let picmain = document.getElementById('picmain');
		if (!picmain) return;
		let images = document.querySelectorAll('img');
		images.forEach(function(img){
			img.onload = function(){
				let span = this.parentElement.querySelector('span');
				if (span) span.innerText = this.naturalWidth + ' x ' + this.naturalHeight;
			};
		});
	}
	
	function loadNextPages(){
		let pageNum = location.href.split('/').pop().split('.')[0].substr(3);
		let url = location.href.substr(0, location.href.length - pageNum.length - 5);
		pageNum = parseInt(pageNum) + 1;
		setTimeout(getPage, 5000);
		function getPage(){
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				console.log('xhr: ', xhr);
				if (xhr.readyState !== 4) return;
				if (xhr.status !== 200) {
					console.error('Error ' + xhr.status + ': ' + xhr.statusText);
					theEnd('Done. Getting page error.');
				}
				else createPageBox(xhr.responseText);
			}
			xhr.open('GET', url + pageNum.toString() + '.html', false);
			xhr.send();
		}
		function createPageBox(xhrText){
			let box = document.createElement('div');
			box.innerHTML = xhrText;
			box.classList.add('picmain');
			box.setAttribute('style', 'padding: 40px 0; border-bottom: 1px solid #999;');
			let picmain = box.querySelector('#picmain');
			if (!picmain) return;
			let images = picmain.querySelectorAll('img');
			if (images.length === 0) {
				theEnd('Done. Images not found.');
				return;
			}
			let html = '<h2>Page ' + pageNum + '<small style="color: #999;">&nbsp;&nbsp;&nbsp;&nbsp;images: <span>0</span> / ' + images.length + '</small></h2>';
			images.forEach(function(img){
				img.setAttribute('alt', 'img');
				html += '<a href="' + img.getAttribute('src') + '">' + img.outerHTML;
				html += '<br><span>' + img.naturalWidth + ' x ' + img.naturalHeight + '</span></a>';
			});
			box.innerHTML = html;
			readyImages = 0;
			images = box.querySelectorAll('img');
			images.forEach(function(img){
				img.onload = function(){
					this.parentElement.querySelector('span').innerText = this.naturalWidth + ' x ' + this.naturalHeight;
					readyImages++;
					tryNextPage(images.length, readyImages, box);
				};
				img.onerror = function(){
					readyImages++;
					tryNextPage(images.length, readyImages, box);
				};
				img.onabort = function(){
					readyImages++;
					tryNextPage(images.length, readyImages, box);
				};
			});
			let relkey = document.getElementById('relkey');
			relkey.parentElement.insertBefore(box, relkey);
		}
		function tryNextPage(imagesCount, readyImages, box){
			let span = box.querySelector('h2 span');
			span.innerText = readyImages.toString();
			if (imagesCount === readyImages) {
				pageNum++;
				setTimeout(getPage, 3000);
			}
		}
	}
	function theEnd(s){
		let picmain = document.querySelectorAll('.picmain');
		picmain = picmain[picmain.length - 1];
		let h3 = document.createElement('h3');
		h3.style.color = 'red';
		h3.innerHTML = '<h3>' + s + '</h3>';
		picmain.appendChild(h3);
	}




























	// TODO: в заголовках h2 - завантаження наступної сторінки
	// добавити спінер до картинок і до сторінок
	// сторінка-агрегатор: з головної по черзі викачуються всі посилання по дням, створюється пошук-фільтр з тегами, теги зашифрувати (взяти внизу в links)
	// зміна висоти мініатюр зі збереженням в локалсторіджі і перевірці значення при отриманні фокуса

	console.log('jpg4 script started');

	const MAX_WIDTH = '150px';
	const MAX_HEIGHT = '200px';

	removeElements();
	//remakeImages();
	//addStyles();
	//addControlls();
	//imgOnLoad();
	//loadNextPages();
	
	function removeElements(){
		document.body.setAttribute('onclick', '');
		document.body.onclick = null;
		let elem = document.getElementById('relkey');
		elem.setAttribute('onmousemove', '');
		elem.onmousemove = null;
		elem = document.getElementById('google_translate_element');
		if (elem) elem.remove();
		elem = document.querySelector('.goog-logo-link[href="https://translate.google.com"]');
		if (elem) elem.parentElement.parentElement.parentElement.parentElement.remove();
		elem = document.querySelectorAll('iframe');
		elem.forEach(function(iframe){ iframe.remove(); });
		elem = document.querySelectorAll('script');
		elem.forEach(function(script){ script.remove(); });
	}

	function remakeImages(){
		// робимо картинки маленькими і клікабельними
		let picmain = document.getElementById('picmain');
		if (!picmain) return;
		picmain.classList.add('picmain');
		let images = document.querySelectorAll('img');
		let html = '';
		images.forEach(function(img){
			img.setAttribute('alt', 'img');
			html += '<a href="' + img.getAttribute('src') + '">' + img.outerHTML;
			html += '<br><span>' + img.naturalWidth + ' x ' + img.naturalHeight + '</span></a>';
		});
		picmain.innerHTML = html;
	}
	
	function addStyles(){
		// додаємо стилі
		let styles = document.createElement('style');
		styles.innerHTML = '.picmain a { display: inline-block; padding: 4px 8px; text-decoration: none; font-size: 12px; color: #999; } .picmain img { max-height: 180px; border: 4px solid transparent; } .picmain a:hover img { border-color: #ddd; }';
		document.head.appendChild(styles);
	}
	
	function addControlls(){
		let paging = document.getElementById('paging');
		if (!paging) return;
		let table = document.createElement('table');
		table.innerHTML = paging.innerHTML;
		table.setAttribute('width', '100%');
		table.setAttribute('border', '0');
		table.setAttribute('bgcolor', '#E6d1FF');
		let relkey = document.getElementById('relkey');
		relkey.parentElement.insertBefore(table, relkey);
	}

	function imgOnLoad(){
		let picmain = document.getElementById('picmain');
		if (!picmain) return;
		let images = document.querySelectorAll('img');
		images.forEach(function(img){
			img.onload = function(){
				let span = this.parentElement.querySelector('span');
				if (span) span.innerText = this.naturalWidth + ' x ' + this.naturalHeight;
			};
		});
	}
	
	function loadNextPages(){
		let pageNum = location.href.split('/').pop().split('.')[0].substr(3);
		let url = location.href.substr(0, location.href.length - pageNum.length - 5);
		pageNum = parseInt(pageNum) + 1;
		setTimeout(getPage, 5000);
		function getPage(){
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				console.log('xhr: ', xhr);
				if (xhr.readyState !== 4) return;
				if (xhr.status !== 200) {
					console.error('Error ' + xhr.status + ': ' + xhr.statusText);
					theEnd('Done. Getting page error.');
				}
				else createPageBox(xhr.responseText);
			}
			xhr.open('GET', url + pageNum.toString() + '.html', false);
			xhr.send();
		}
		function createPageBox(xhrText){
			let box = document.createElement('div');
			box.innerHTML = xhrText;
			box.classList.add('picmain');
			box.setAttribute('style', 'padding: 40px 0; border-bottom: 1px solid #999;');
			let picmain = box.querySelector('#picmain');
			if (!picmain) return;
			let images = picmain.querySelectorAll('img');
			if (images.length === 0) {
				theEnd('Done. Images not found.');
				return;
			}
			let html = '<h2>Page ' + pageNum + '<small style="color: #999;">&nbsp;&nbsp;&nbsp;&nbsp;images: <span>0</span> / ' + images.length + '</small></h2>';
			images.forEach(function(img){
				img.setAttribute('alt', 'img');
				html += '<a href="' + img.getAttribute('src') + '">' + img.outerHTML;
				html += '<br><span>' + img.naturalWidth + ' x ' + img.naturalHeight + '</span></a>';
			});
			box.innerHTML = html;
			readyImages = 0;
			images = box.querySelectorAll('img');
			images.forEach(function(img){
				img.onload = function(){
					this.parentElement.querySelector('span').innerText = this.naturalWidth + ' x ' + this.naturalHeight;
					readyImages++;
					tryNextPage(images.length, readyImages, box);
				};
				img.onerror = function(){
					readyImages++;
					tryNextPage(images.length, readyImages, box);
				};
				img.onabort = function(){
					readyImages++;
					tryNextPage(images.length, readyImages, box);
				};
			});
			let relkey = document.getElementById('relkey');
			relkey.parentElement.insertBefore(box, relkey);
		}
		function tryNextPage(imagesCount, readyImages, box){
			let span = box.querySelector('h2 span');
			span.innerText = readyImages.toString();
			if (imagesCount === readyImages) {
				pageNum++;
				setTimeout(getPage, 3000);
			}
		}
	}
	function theEnd(s){
		let picmain = document.querySelectorAll('.picmain');
		picmain = picmain[picmain.length - 1];
		let h3 = document.createElement('h3');
		h3.style.color = 'red';
		h3.innerHTML = '<h3>' + s + '</h3>';
		picmain.appendChild(h3);
	}
	
})();
