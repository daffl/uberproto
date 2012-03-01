/**
 * A base object for ECMAScript 5 style prototypal inheritance.
 *
 * @see https://github.com/rauschma/proto-js/
 * @see http://ejohn.org/blog/simple-javascript-inheritance/
 * @see http://uxebu.com/blog/2011/02/23/object-based-inheritance-for-ecmascript-5/
 */
(function ()
{
	if (typeof define == "undefined") {
		define = function (fn)
		{
			var res = fn();
			if (typeof exports == "undefined") {
				Proto = res;
			} else {
				module.exports = res;
			}
		}
	}
	;

	define(function ()
	{
		return {
			/**
			 * Create a new object using Object.create. The arguments will be
			 * passed to the new instances init method.
			 */
			create : function ()
			{
				var instance = Object.create(this);
				if (typeof instance.init == "function") {
					instance.init.apply(instance, arguments);
				}
				return instance;
			},
			/**
			 * Mixin a given set of properties
			 * @param prop
			 * @param obj
			 */
			mixin : function (prop, obj)
			{
				var self = obj || this,
					fnTest = /xyz/.test(function ()
					{
						xyz;
					}) ? /\b_super\b/ : /.*/,
					_super = Object.getPrototypeOf(self) || self.prototype,
					_old;

				// Copy the properties over
				for (var name in prop) {
					// store the old function which would be overwritten
					_old = self[name];
					// Check if we're overwriting an existing function
					self[name] = (typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name])) //
						|| (typeof _old == "function" && typeof prop[name] == "function") ? //
						(function (old, name, fn)
						{
							return function ()
							{
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

				return self;
			},
			/**
			 * Extend the current or a given object with the given property
			 * and return the extended object.
			 * @param prop
			 * @param obj
			 * @returns The extended object
			 */
			extend : function (prop, obj)
			{
				return this.mixin(prop, Object.create(obj || this));
			},
			proxy : function (name, context)
			{
				var self = context || this;
				return function ()
				{
					return self[name].apply(self, arguments);
				}
			}
		};
	});
})();
