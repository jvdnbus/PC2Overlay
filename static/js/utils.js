String.prototype.hashCode = function() {
	var hash = 0, i, chr
	if (this.length === 0) return hash
	for (i = 0; i < this.length; i++) {
		chr   = this.charCodeAt(i)
		hash  = ((hash << 5) - hash) + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}

Number.prototype.intToHSL = function() {
	var h = this % 360,
		l = 40 + this % 20
	return 'hsl(' + h + ', 100%, ' + l + '%)'
}

// utility function for returning a promise that resolves after a delay
function delay(t) {
	return new Promise(function(resolve) {
		setTimeout(resolve, t)
	})
}

Promise.delay = function(fn, t, context) {
	// fn is an optional argument
	if (!t) {
		t = fn
		fn = function() { }
	}
	if (!context) {
		context = null
	}
	let args = Array.prototype.splice.call(arguments, 3)
	return delay(t).then(fn.apply(context, args))
}

Promise.prototype.delay = function(fn, t, context) {
	if (!context) {
		context = null
	}
	let args = Array.prototype.splice.call(arguments, 3)
	// return chained promise
	return this.then(function() {
		return Promise.delay(fn, t, context, args)
	})
}
