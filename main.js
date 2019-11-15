(function(){

	console.log('UserScript: main.js');

	if (location.host.indexOf('.google.') > -1 && location.search.indexOf('tbm=isch') > -1) addScript('google-images.js');
	if (location.host === 'imgsrc.ru') addScript('imgsrc.ru.js');
	if (location.host === '9gag.com') addScript('9gag.com.js');
	if (location.host === 'e621.net') addScript('e621.net.js');
	if (location.host === 'chan.sankakucomplex.com') addScript('chan.sankakucomplex.com.js');
	if (location.host.indexOf('reactor.cc') > -1) addScript('joyreactor.cc.js');
	if (location.host.indexOf('jpg4.') > -1) {
		if (location.href.indexOf('/tpcache/tpics.html') > -1) addScript('jpg4.net.thumbs.js');
		else addScript('jpg4.net.subpage.js');
		//addScript('jpg4.info.js');
	}

	function addScript(fileName){
		let script = document.createElement('script');
		script.setAttribute('src', 'https://poshtarboba.github.io/userscripts/' + fileName);
		document.body.appendChild(script);
		console.log('Added script', fileName);
	}

})();
