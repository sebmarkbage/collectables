var List = new Class({

	Extends: Enumerable.Array.Like,

	initialize: function(values){
		if (arguments.length > 1)
			this.push.apply(this, arguments);
		else if ('length' in values)
			this.push.apply(this, values)
		else if (typeof values.each == 'function')
			values.each(function(n){ this.push(n); }, this);
		else
			this.push.apply(this, arguments);
	},
	
	push: Array.prototype.push

});