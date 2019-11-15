(function(){

	imageSize();
	directLink();
	setInterval(directLink, 5000);
	
	function imageSize(){
		// my styles
		let css = '.pb-imgsize{position:relative;z-index:5;float:left;padding:0 16px}';
		css += '.pb-imgsize span{display:block;padding-bottom:4px;text-align:center}';
		css += '.pb-imgsize input{width:32px;text-align:center;border:1px solid silver}';
		let styleBlock = document.createElement('style');
		styleBlock.innerHTML = css;
		document.head.appendChild(styleBlock);
		console.log(111);
		// google search-form - float: left
		document.getElementById('tsf').style.float = 'left';
		// my new inputs for set image-size
		let div = document.createElement('div');
		div.classList.add('pb-imgsize');
		let html = '<span>Image size:</span>';
		html += '<input class="pb-img-w"> x <input class="pb-img-h">';
		div.innerHTML = html;
		document.getElementById('qbc').appendChild(div);
		let inputWidth = document.querySelector('.pb-img-w');
		let inputHeight = document.querySelector('.pb-img-h');
		let inputQ = document.querySelector('[name="q"]');
		inputWidth.addEventListener('input', setImageSize);
		inputHeight.addEventListener('input', setImageSize);
		function setImageSize(){
			let q = trim(inputQ.value);
			let w = trim(inputWidth.value);
			let h = trim(inputHeight.value);
			let s;
			if (w.length > 0 || h.length > 0) {
				s = ' imagesize:';
				if (w.length > 0 && h.length === 0) s += w + 'x' + w;
				if (w.length === 0 && h.length > 0) s += h + 'x' + h;
				if (w.length > 0 && h.length > 0) s += w + 'x' + h;
			}
		}
		function trim(s){}
	}
	
	function directLink(){
		
	}
	
})();