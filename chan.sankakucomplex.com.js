/* chan :before

window.eval = function(s) { console.log('eval(s), s.length = ', s.length); };
console.clear = function() { console.log('console.clear();'); };
document.write = function(s) { console.log('document.write(s), s.length = ', s.length); };
document.writeln = function(s) { console.log('document.writeln(s), s.length = ', s.length); };
console.log('chan:before done');

*/
(function() {
	
	addUserCSS(); // добавити користувацькі стилі
	scrollToImage(); // проскролити до картинки
	recommendationsNoTargetBlank(); // позабирати таргет-бланки у рекомендованих
	loadRecomendated(3); // завантажити рекомендовані (три рази)
	selectByCount(); // якщо є список вибору сортування - встановлювати на count
	
	function addUserCSS() {
		let html = '#image { position:relative; width:auto !important; height: auto !important; ';
		html += 'max-width:80vw !important; max-height:98vh !important; }\n';
		html += '#headerthumbs, #share, .scad-i, iframe, #news-ticker { display:none !important; }\n';
		html += 'body div#post-content { padding-top: 8px; }'
		let style = document.createElement('style');
		style.innerHTML = html;
		document.head.appendChild(style);
	}
	
	function scrollToImage(){
		let img = document.getElementById('image');
		if (!img) return;
		let offsetTop = 0;
		while (img && img.offsetTop !== undefined) { offsetTop += img.offsetTop; img = img.offsetParent; }
		window.scroll({ top: offsetTop - 4, behavior: "smooth" });
	}
	
	function recommendationsNoTargetBlank(){
		document.querySelectorAll('#recommendations a').forEach(function(a){
			a.removeAttribute('target');
		});
	}
	
	function selectByCount(){
		let select = document.querySelector('select#order');
		if (!select) return;
		let option = select.querySelector('option:selected');
		if (option) option.selected = false;
		option = select.querySelector('option[value="count"]');
		if (option) option.selected = true;
	}
	
	function loadRecomendated(n){
		// якщо є кнопка "далі"
		let url = '/post/recommend/15477209?page=';
		for (let i = 1; i <= n; i++) {
			setTimeout(function (){
				fetch(url + (i + 2), { method: 'GET' })
				.then(resp => resp.text())
				.then(resp => {
					console.log(resp);
					
				});
			}, i * 3000);
		}
	}
	//new Ajax.Updater('recommendations', '/post/recommend/15477209?page=2', {asynchronous:true, evalScripts:true, method:'get'}); return false;"

})();

