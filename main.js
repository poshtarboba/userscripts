(function(){

	console.log('UserScript: main.js');

	if (location.host === 'imgsrc.ru') addScript('imgsrc.ru.js');
	if (location.host === '9gag.com') addScript('9gag.com.js');
	if (location.host === 'e621.net') addScript('e621.net.js');
	if (location.host === 'chan.sankakucomplex.com') addScript('chan.sankakucomplex.com.js');
	if (location.host.indexOf('jpg4.info') > -1) addScript('jpg4.info.js');
	if (location.host.indexOf('reactor.cc') > -1) addScript('joyreactor.cc.js');

	function addScript(fileName){
		let script = document.creareElement('script');
		script.setAttribute('src', 'https://poshtarboba.github.io/userscripts/' + fileName);
		document.documentElement.appendChild(script);
		console.log('Added script', fileName);
	}

})();
