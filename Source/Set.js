var Set = new Class({

	Extends: Enumerable.Array,

	initialize: function(values){
		if (arguments.length > 1)
			values = arguments;
		else if ('length' in values)
			values = values;
		else if (typeof values.toArray == 'function')
			values = values.toArray();
		else
			values = arguments;
		this.array = Array.prototype.slice.call(values);
		// TODO: unique
	},

	push: function(){
		for (var i = 0, l = arguments.length; i < l; i++)
			if (this.contains(arguments[i])) throw new Error('Item already exists in the set.');
		this.array.push.apply(this, arguments);
	},

	remove: function(n){
		// ...
	}

});