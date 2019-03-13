(function(){
	
	console.log('UserScript: main.js');
	
	window.add0 = _fx_add0;
	window.fxGetURI = _fx_GetURI;
	window.fx$$ = _fx_$$;
	window.fx$1 = _fx_$1;
	window.fxCreateTag = _fx_createTag;
	window.fxAddClass = _fx_addClass;
	window.fxRemoveClass = _fx_removeClass;
	window.fxToggleClass = _fx_toggleClass;
	
	if (location.host === 'imgsrc.ru') addScript('imgsrc.ru.js');
	if (location.host === '9gag.com') addScript('9gag.com.js');
	if (location.host === 'e621.net') addScript('e621.net.js');
	if (location.host === 'chan.sankakucomplex.com') addScript('chan.sankakucomplex.com.js'); // не хоче загружатися, загружай вручну
	if (location.host.indexOf('jpg4.info') > -1) addScript('jpg4.info.js');
	if (location.host.indexOf('reactor.cc') > -1) addScript('joyreactor.cc.js');
	
	function addScript(fileName){
		let script = window.fxCreateTag('script');
		document.documentElement.appendChild(script);
		script.setAttribute('src', 'https://poshtarboba.github.io/userscripts/' + fileName);
		console.log('Added script', fileName);
	}
	
})();

function _fx_GetURI(uri, handle){
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.readyState !== 4) return;
		handle(xhr);
	};
	xhr.open('GET', uri, true);
	xhr.send();
};

function _fx_add0(n) { return n < 10 ? '0' + n : n.toString(); }
function _fx_$$(selector, parent) { if (!parent) parent = document; return parent.querySelectorAll(selector); }
function _fx_$1(selector, parent) { if (!parent) parent = document; return parent.querySelector(selector); }
function _fx_createTag(tag) { return document.createElement(tag); }
function _fx_addClass(elements, classes) { if (!elements) return; classes = classes.split(/\s+/); elements.forEach(function(elem) { classes.forEach(function(className) { elem.classList.add(className); }) }); }
function _fx_removeClass(elements, classes) { if (!elements) return; classes = classes.split(/\s+/); elements.forEach(function(elem) { classes.forEach(function(className) { elem.classList.remove(className); }) }); }
function _fx_toggleClass(elements, classes) { if (!elements) return; classes = classes.split(/\s+/); elements.forEach(function(elem) { classes.forEach(function(className) { elem.classList.toggle(className); }) }); }
