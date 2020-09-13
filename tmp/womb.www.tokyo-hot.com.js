// for page https://www.tokyo-hot.com/womb/index.html
// 1. посилання на 4-х дівчат
// 2. посилання у боковому меню (10 шт, крім першого та останнього)
// 3. у підпапках збираємо посилання на дівчат
// 4. в кожній дівчині картинки

(function (){

	//document.querySelectorAll('img').forEach(img => img.style.opacity = 0);

	createHeader();

	function getPage(url, funDone){
		let xhr = new XMLHttpRequest();
		xhr.open('get', url);
		xhr.onreadystatechange = function(){
			if (xhr.readyState !== 4) return;
			if (xhr.status !== 200) {
				console.warn('PB> xhr-error ' + xhr.status + ': ' + xhr.statusText);
				funDone('');
				return;
			}
			xhr = xhr.responseText.match(/<body.*?>([\s\S]*)<\/body>/i);
			xhr = xhr ? xhr[1] : '';
			funDone(xhr);
		}
		xhr.send();
	}

	function createHeader(){
		let header = document.createElement('div');
		header.classList.add('pb-header');
		let html = '<button class="run">Run</button>';
		html += '&nbsp;&nbsp; <em>Subpages: </em> <b>0</b>...'
		html += '<br>';
		html += '<textarea readonly style="width:100%;height:600px;overflow-x:hidden;overflow-y:scroll;box-sizing:border-box"></textarea>';
		header.innerHTML = html;
		document.body.insertBefore(header, document.body.firstElementChild);
		const currentT = header.querySelector('em');
		const currentN = header.querySelector('b');
		const btnRun = header.querySelector('.run');
		const ta = header.querySelector('textarea');
		const pages = [];
		btnRun.addEventListener('click', run);
		function run(){
			btnRun.disabled = true;
			
			iteration();
		}
		function iteration(){
			current.innerText = header.current;
			let url = 'http://cdn.www.tokyo-hot.com/j/jpgs0' + add0(header.current, 3) + '_j.html';
			getPage(url, funDone);
		}
		function funDone(html){
			let div = document.createElement('div');
			div.innerHTML = html;
			div.querySelectorAll('a[href$=".jpg"]').forEach(a => ta.value += a.href + '\n');
			header.current++;
			if (header.stop) return;
			if (header.current > +inp2.value) return;
			iteration();
		}
	}
	
	function add0(i, n = 2){
		i = i.toString();
		while (i.length < n) i = '0' + i;
		return i;
	}

})();
