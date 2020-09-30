const allEvents = [];
EventTarget.prototype.old_addEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options){
	let that = this;
	allEvents.push({
		type: type,
		target: that,
		listener: listener,
		options: options
	});
	this.old_addEventListener(type, listener, options);
}
