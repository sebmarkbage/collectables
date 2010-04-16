Observable.implementWarp = function(obj){
	for (var key in obj)
		Observable.implement(key, function(){
			var obs = new Observable();
			obs.subscribe = obj[key].apply(this, arguments);
		});
};

Observable.implementWarp({

	map: function(map, bind){
		var self = this;
		if (bind == null) bind = self;
		return function(next, error, complete){
			return self.subscribe(function(){
				var result = map.apply(arguments, bind);
				if (next) next(result);
			}, error, complete);
		};
	},
	
	// Filter

	filter: function(where, bind){
		var self = this;
		if (bind == null) bind = self;
		return function(next, error, complete){
			return self.subscribe(function(){
				if (where.apply(bind, arguments) && next) next.apply(null, arguments);
			}, error, complete);
		};
	},

	skip: function(count){
		var self = this;
		return function(next, error, complete){
			var i = 0;
			return self.subscribe(function(){
				if (i >= count) next.apply(null, arguments); else i++;
			}, error, complete);
		};
	},

	take: function(count){
		var self = this;
		return function(next, error, complete){
			var i = 0;
			var handle = self.subscribe(function(){
				if (i < count){
					next.apply(null, arguments);
					i++;
					if (i >= count) handle();
				}
			}, error, complete);
			return handle;
		};
	},

	// Combinators

	combineLatest: function(other, map, bind){
		var self = this;
		if (bind == null) bind = self;
		return function(next, error, complete){
			var lastSelf, lastOther;

			var selfHandle = self.subscribe(function(n){
				var result = map.call(bind, lastSelf = n, lastOther);
				if (next) next.apply(null, result);
			}, error, complete);

			var otherHandle = self.subscribe(function(n){
				var result = map.call(bind, lastSelf, lastOther = n);
				if (next) next.apply(null, result);
			}, error, complete);
			
			return function(){ selfHandle(); otherHandle(); };
		};
	},

	zip: function(other, map, bind){
		var buffer = [];
		
	},

	// Aggregators
	

});
