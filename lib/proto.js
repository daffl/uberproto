/**
 * A base object for ECMAScript 5 style prototypal inheritance.
 * 
 * @see https://github.com/rauschma/proto-js/
 * @see http://ejohn.org/blog/simple-javascript-inheritance/
 * @see http://uxebu.com/blog/2011/02/23/object-based-inheritance-for-ecmascript-5/
 */
/*
var define;
if(typeof define == "undefined") {
	define = function(obj) {
			Proto = obj;
	}
};
*/
define({
	create : function() {
		var instance = Object.create(this);
		if(typeof instance.init == "function") {
			instance.init.apply(instance, arguments);
		}
		return instance;
	},
	mixin : function(prop) {
		var fnTest = /xyz/.test(function() { xyz;
		}) ? /\b_super\b/ : /.*/, _super = Object.getPrototypeOf(this) || this.prototype, _old;

		// Copy the properties over
		for(var name in prop) {
			// store the old function which would be overwritten
			_old = this[name];
			// Check if we're overwriting an existing function
			this[name] = (typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name])) // 
				|| (typeof _old == "function" && typeof prop[name] == "function") ? //
			(function(old, name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but either pointing to the prototype method
					// or to the overwritten method
					this._super = (typeof old == 'function') ? old : _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(_old, name, prop[name]) : prop[name];
		}

		return this;
	},
	proxy : function(name) {
		var self = this;
		return function() {
			return self[name].apply(self, arguments);
		}
	},
	extend : function(prop) {
		var prototype = Object.create(this);
		prototype.mixin(prop);
		return prototype;
	}
});
