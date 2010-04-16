var nil = function(){};

var Observable = new Class({

	initialize: function(observable){
		
	},

	subscribe: function(){
		// Needs to be overridden
		return nil;
	}

});

// IE enum bug workaround
var failedEnums = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];
for (var key in { toString: 1 }) failedEnums = null;

var objectEnumerator =  function(next, bind){
	for (var key in this)
		if (next.call(bind, this[key], key) === false) break;
	if (failedEnums)
		for (var i = 0, l = failedEnums.length; i < l; i++){
			var key = failedEnums[i], value = this[key];
			if (value !== Object.prototype[key] && next.call(bind, value, key) === false)
				break;
		}
};

var Enumerable = new Class({

	Extends: Observable,

	initialize: function(enumerable){
		if (typeof enumerable.toEnumerable == 'function')
			return enumerable.toEnumerable();
		if ('length' in enumerable)
			return new Enumerable.Array(enumerable);
		this.enumerable = enumerable;
	},

	each: function(next, bind){
		var enumerable = this.enumerable,
			each = enumerable.each || enumerable.forEach || objectEnumerator;
		each.call(enumerable, next, bind == null ? this : bind);
		return this;
	},

	subscribe: function(next, error, complete){
		try {
			this.each(next);
			if (complete) complete();
		} catch(x) {
			if (error) error(x);
		}
		return nil;
	}

});

Enumerable.Array = new Class({

	Extends: Enumerable,

	initialize: function(array){
		if ('length' in array)
			this.array = array;
		else if (typeof array.toArray == 'function')
			this.array = array.toArray();
		else
			return null;
	},

	each: function(next, bind){
		if (bind == null) bind = this;
		var array = this.array, i = -1, l = array.length;
		while (++i < l && next.call(bind, array[i], i) !== false);
		return this;
	}

});
