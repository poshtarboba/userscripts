// for page http://cdn.www.tokyo-hot.com/j/jpgs0299_j.html

(function (){

	document.querySelectorAll('img').forEach(img => img.style.opacity = 0);

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
		let html = 'from <input class="inp1" value="1" style="width:40px"> ';
		html += 'to <input class="inp2" value="612" style="width:40px">'
		html += ' current: <b>0</b>... <button class="run">Run</button>'
		html += '<button class="pause" style="display:none">Pause</button><br>';
		html += '<textarea readonly style="width:100%;height:600px;overflow-x:hidden;overflow-y:scroll;box-sizing:border-box"></textarea>';
		header.innerHTML = html;
		document.body.insertBefore(header, document.body.firstElementChild);
		const inp1 = header.querySelector('.inp1');
		const inp2 = header.querySelector('.inp2');
		const current = header.querySelector('b');
		const btn1 = header.querySelector('.run');
		const btn2 = header.querySelector('.pause');
		const ta = header.querySelector('textarea');
		btn1.addEventListener('click', run);
		btn2.addEventListener('click', stop);
		function run(){
			btn1.style.display = 'none';
			btn2.style.display = 'inline-block';
			if (!header.current) header.current = +inp1.value;
			iteration();
		}
		function stop(){
			btn1.style.display = 'inline-block';
			btn2.style.display = 'none';
			header.stop = true;
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
