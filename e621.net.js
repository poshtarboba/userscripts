(function() {
	
	addStyles(); // добавить стили
	scrollToImage(); // проскролить до картинки
	rareTags(); // выделить редкие теги
	
	function addStyles(){
		let style = document.createElement('style');
		let html = 'img#image,video{width:auto;height:auto;max-width:75vw;max-height:98vh;}';
		style.innerHTML = html;
		document.head.appendChild(style);
	}
	
	function scrollToImage(){
		let img = document.getElementById('image') || document.getElementById('webm-container');
		if (!img) return;
		let offsetTop = 0;
		while (img && img.offsetTop !== undefined) { offsetTop += img.offsetTop; img = img.offsetParent; }
		console.log(offsetTop);
		//window.scroll({ top: offsetTop - 4, behavior: "smooth" });
		window.scroll({ top: offsetTop - 4 });
	}
	
	function rareTags(){
		let li = document.querySelectorAll('#tag-sidebar li');
		li.forEach(function(li){
			let span = li.querySelector('.post-count');
			if (!span) return;
			let n = parseInt(span.innerText);
			let opacity = 0;
			if (n < 50) opacity = 0.15;
			else if (n < 200) opacity = 0.12;
			else if (n < 500) opacity = 0.09;
			else if (n < 2000) opacity = 0.06;
			else if (n < 5000) opacity = 0.03;
			li.style.backgroundColor = 'rgba(255,255,255,' + opacity + ')';
		});
	}
	
})();
