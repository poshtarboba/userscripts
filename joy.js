/* rate buttons for best comments */
if (jQuery) {
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
