var arrayProto = Array.prototype;

Enumerable.implement({

	first: function(){
		return this.item(0);
	},

	item: function(nth){
		var i = 0, result;
		this.each(function(n){
			if (i == nth){
				result = n;
				return false;
			}
			i++;
		});
		return result;
	}

});

var reduce = function(fn, v){ return function(){ return this.reduce(fn, v); } };

Enumerable.Finite = new Class({

	Extends: Enumerable,

	// Aggregation

	reduce: function(fn, value, bind){
		if (bind == null) bind = this;
		this.each(function(n, i){
			value = value === undefined ? n : fn.call(bind, value, n, i);
		});
		return value;
	},

	count: reduce(function(s){ return s + 1; }, 0),

	sum: reduce(function(s, v){ return s + v; }),

	min: reduce(function(s, v){ return v < s ? v : s; }),

	max: reduce(function(s, v){ return v > s ? v : s; }),

	average: function(){
		var c = this.count();
		return c ? this.sum() / c : null;
	},

	median: function(){
		var c = this.count();
		if (c % 2 == 0)
			return this.sort().skip((c / 2) - 1).take(2).average();
		else
			return this.sort().item((c - 1) / 2);
	},

	// Random

	random: function(){
		return this.item(Math.floor(this.count() * Math.random()));
	},

	shuffle: function(){
		// TODO
	},
	
	// Sort
	
	sort: function(){
		// TODO
	},

	// Reversal

	last: function(){
		return this.reverse().first();
	},

	reverse: function(){
		return new Enumerable.Reverse(this);
	},
	
	// Conversion

	toArray: function(){
		var result = [];
		this.each(function(n){ result.push(n); });
		return result;
	}

});

Enumerable.Finite.Reverse = new Class({

	Extends: Enumerable.Finite,

	initialize: function(enumerable){
		this.enumerable = enumerable;
	},

	each: function(next, bind){
		new Enumerable.Array.Reverse(this.toArray()).each(next, bind);
		return this;
	},

	reverse: function(){
		return this.enumerable;
	}

});

Enumerable.Array.implement({

	skip: function(count){
		var take = this._take;
		return new Enumerable.Array(this.array, this._skip + count, _take == null ? null : _take - count);
	},

	take: function(count){
		var take = this._take;
		return new Enumerable.Array(this.array, this._skip + count, _take == null ? null : _take - count);
	},

	item: function(nth){
		return this.array[nth];
	},

	count: function(){
		return this.array.length;
	},

	reverse: function(){
		return new Enumerable.Array.Reverse(this.array);
	},

	toArray: function(){
		return arrayProto.slice.call(this.array);
	}

});

Enumerable.Array.Reverse = new Class({

	Extends: Enumerable.Finite,

	initialize: function(array){
		this.array = array;
	},

	each: function(next, bind){
		if (bind == null) bind = this;
		var array = this.array, i = array.length;
		while (i-- && next.call(bind, array[i], i) !== false);
		return this;
	},

	reverse: function(){
		return new Enumerable.Array(this.array);
	},

	toArray: function(){
		return arrayProto.slice.call(this.array).reverse();
	},

	item: function(nth){
		return this.array[this.array.length - nth - 1];
	},

	count: function(){
		return this.array.length;
	}

});

if (arrayProto.reduce)
	Enumerable.Array.implement('reduce', function(fn, value, bind){
		if (bind == null) bind = this;
		return arrayProto.reduce.call(this.array, function(){
			return fn.apply(bind, arguments);
		}, value);
	});

if (arrayProto.reduceRight)
	Enumerable.Array.Reverse.implement('reduce', function(fn, value, bind){
		if (bind == null) bind = this;
		return arrayProto.reduceRight.call(this.array, function(){
			return fn.apply(bind, arguments);
		}, value);
	});

Enumerable.Range = new Class({

	Extends: Enumerable.Finite,

	initialize: function(start, end, step){
		this.start = start;
		this.end = end;
		if (step == null) step = 1;
		if ((end < start && step > 0) || (start > end && step < 0)) step = -step;
		this.step = step;
	},

	each: function(next, bind){
		if (bind == null) bind = this;
		var i = 0, n = this.start, e = this.end, step = this.step;
		if (e == null)
			while (next.call(bind, n, i) !== false){ i++; n += step; }
		else if (n < e)
			while (n <= e && next.call(bind, n, i) !== false){ i++; n += step; }
		else
			while (n >= e && next.call(bind, n, i) !== false){ i++; n += step; }
		return this;
	}

});

Enumerable.Random = new Class({

	Extends: Enumerable,

	initialize: function(min, max, step){
		this.min = max == null ? 0 : min;
		this.max = max == null ? min || 1 : max;
		this.step = step == null ? 1 : step;
	},

	each: function(next, bind){      
		if (bind == null) bind = this;
		var i = 0, min = this.min, range = this.max - this.min, step = this.step;
		if (step)
			while (next.call(bind, (Math.floor(Math.random() * (max - min) / step) * step + min), i) !== false) i++;
		else
			while (next.call(bind, (Math.random() * (max - min) + min), i) !== false) i++;
		return this;
	}

});