(function(){
	
	addControllsForVideo();
	
	function addControllsForVideo(){
		setInterval(function(){
			document.querySelectorAll('video').forEach(function(video){ video.controls = true; });
		}, 5000);
	}
	
})();