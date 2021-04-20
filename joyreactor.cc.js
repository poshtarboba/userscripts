(function (){
	
	setTimeout(() => {
		rateButtonsForBestComments();
		hideShareButtons();
		addTopButtons();
	}, 3000);
	
	function hideShareButtons(){
		document.querySelectorAll('.share_buttons a').forEach(a => a.style.display = 'none');
	}

	function rateButtonsForBestComments(){
		if (!jQuery) return console.warn('PBUS: jQuery not found;');
		let $ = jQuery;
		let css = '.c-vote-plus, .c-vote-minus { font-size: 120%; margin-left: 4px; cursor: pointer; display: inline-block; vertical-align: middle; opacity: 0.6; }\n';
		css += '.c-vote-plus { margin-left: 12px; }\n.c-vote-plus:hover, .c-vote-minus:hover { opacity: 1; }';
		$('head').append('<style>' + css + '</style>');
		$('.post_comment_list').has('h3').find('.post_rating').each(function(){
			let $rating = $(this);
			let commentId = $rating.parents('.comments_bottom').find('.comment_link').attr('href').split('#comment')[1];
			if (localStorage.getItem('comment_' + commentId)) return;
			let html = '\n<div class="c-vote-plus" title="голосовать за" data-vote="plus">😀</div>';
			html += '\n<div class="c-vote-minus" title="голосовать против" data-vote="minus">😦</div>';
			$rating.addClass('comment_rating').attr('comment_id', commentId).children('span').eq(0).append(html);
			$rating.find('.c-vote-plus, .c-vote-minus').on('click', vote);
		});
		function vote(){
			let $btn = $(this);
			let span = $btn.parents('.comment_rating');
			let commentId = span.attr('comment_id');
			localStorage.setItem('comment_' + commentId, 'true');
			let url = '/comment_vote/add/' + commentId + '/' + $btn.attr('data-vote');
			span.load(url, 'token=' + token, function(){ $('.qtip').hide(); });
		}
	}
	
	function addTopButtons(){
		let css = '.topbar_inner button { margin: 8px 0 0 8px; padding: 4px 12px; height: auto; font-weight: normal; text-transform: none; }\n';
		let style = document.createElement('style');
		style.innerHTML = css;
		document.head.appendChild(style);
		let logo = document.querySelector('.topbar_inner .top_logo');
		addButton('Show all images', showAllImages);
		addButton('Clear LocalStorage (' + calcLocalStorage() + ')', clearLocalStorage);
		function addButton(text, clickFn){
			let btn = document.createElement('button');
			btn.innerText = text;
			logo.parentElement.insertBefore(btn, logo.nextElementSibling);
			btn.addEventListener('click', clickFn);
			return btn;
		}
		function calcLocalStorage(){
			let n = 0;
			for (key in localStorage) {
				if (key.indexOf('comment_') === 0) n++;
			}
			return n;
		}
		function clearLocalStorage(){
			this.remove();
			for (key in localStorage) {
				if (key.indexOf('comment_') === 0) localStorage.removeItem(key);
			}
		}
		function showAllImages(){
			this.remove();
			let images = [];
			// images without link
			document.querySelectorAll('.post_content .image img').forEach(img => images.push(img.getAttribute('src')));
			// images with link
			document.querySelectorAll('.post_content .prettyPhotoLink').forEach(link => images.push(link.href));
			// gif
			document.querySelectorAll('.post_content .video_gif_source').forEach(link => images.push(link.href));
			// new body
			const style = 'display: inline-block; padding: 2px; width: auto; height: 200px;';
			let html = '';
			images.forEach(src => html += '<img src="' + src + '" alt="img" style="' + style + '">\n');
			document.body.innerHTML = html;
			document.querySelectorAll('script, style').forEach(e => e.remove());
		}
	}

})();
