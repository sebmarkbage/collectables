Observable.Future = new Class({

	Extends: Observable,

	initialize: function(fn, promises){
		this.fn = fn;
	},

	subscribe: function(next, error, complete){
		var fn = this.fn,
			length = this.promises.length,
			fulfilled = 0, completed = 0,
			handles = [], results = [];

		var cancel = function(){
			for (var i = 0; i < l; i++){
				var handle = handles[i];
				if (handle) handle();
			}
		};

		error = function(){ cancel(); error.apply(null, arguments); };

		new Enumerable(this.promises).each(function(promise, i){
			if (promise instanceof Observable){
				var call = function(n){
					results[i] = n;
					if (n instanceof Observable) handles.push(n.subscribe
					if (!(i in results)) fulfilled++;
					if (fulfilled == length) next(fn.call.apply(fn, results));
				};
				handles[i] = promise.subscribe(call, error, function(){
					handles[i] = null;
					completed++;
					if (completed == length) complete();
				});
			} else {
				fulfilled++;
				if (fulfilled == length) next(fn.call.apply(fn, results));
				completed++;
				if (completed == length) complete();
			}
		});
	}

});

Function.prototype.when = function(bind, promises){
	return new Observable.Future(this, arguments).subscribe();
};
