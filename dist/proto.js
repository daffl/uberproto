/* global define */
/**
 * Uberproto
 *
 * A base object for ECMAScript 5 style prototypal inheritance.
 *
 * @see https://github.com/rauschma/proto-js/
 * @see http://ejohn.org/blog/simple-javascript-inheritance/
 * @see http://uxebu.com/blog/2011/02/23/object-based-inheritance-for-ecmascript-5/
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Proto = factory();
  }
}(this, function () {
  var HAS_SYMBOLS = typeof Object.getOwnPropertySymbols === 'function';

  function makeSuper (_super, old, name, fn) {
    var isFunction = typeof old === 'function';
    var newMethod = function () {
      var tmp = this._super;

      // Add a new ._super() method that is the same method
      // but either pointing to the prototype method
      // or to the overwritten method
      this._super = isFunction ? old : _super[name];

      // The method only need to be bound temporarily, so we
      // remove it when we're done executing
      var ret = fn.apply(this, arguments);

      this._super = tmp;

      return ret;
    };

    if (isFunction) {
      Object.keys(old).forEach(function (name) {
        newMethod[name] = old[name];
      });

      if (HAS_SYMBOLS) {
        Object.getOwnPropertySymbols(old).forEach(function (name) {
          newMethod[name] = old[name];
        });
      }
    }

    return newMethod;
  }

  return {
    /**
     * Create a new object using Object.create. The arguments will be
     * passed to the new instances init method or to a method name set in
     * __init.
     */
    create: function () {
      var instance = Object.create(this);
      var init = typeof instance.__init === 'string' ? instance.__init : 'init';

      if (typeof instance[init] === 'function') {
        instance[init].apply(instance, arguments);
      }
      return instance;
    },
    /**
     * Mixin a given set of properties
     * @param prop The properties to mix in
     * @param obj [optional]
     * The object to add the mixin
     */
    mixin: function (prop, obj) {
      var self = obj || this;
      var fnTest = /\b_super\b/;
      var _super = Object.getPrototypeOf(self) || self.prototype;
      var descriptors = {};
      var proto = prop;
      var processProperty = function (name) {
        var descriptor = Object.getOwnPropertyDescriptor(proto, name);

        if (!descriptors[name] && descriptor) {
          descriptors[name] = descriptor;
        }
      };

      // Collect all property descriptors
      do {
        Object.getOwnPropertyNames(proto).forEach(processProperty);

        if (HAS_SYMBOLS) {
          Object.getOwnPropertySymbols(proto).forEach(processProperty);
        }
      } while ((proto = Object.getPrototypeOf(proto)) && Object.getPrototypeOf(proto));

      var processDescriptor = function (name) {
        var descriptor = descriptors[name];

        if (typeof descriptor.value === 'function' && fnTest.test(descriptor.value)) {
          descriptor.value = makeSuper(_super, self[name], name, descriptor.value);
        }

        Object.defineProperty(self, name, descriptor);
      };

      Object.keys(descriptors).forEach(processDescriptor);

      if (HAS_SYMBOLS) {
        Object.getOwnPropertySymbols(descriptors).forEach(processDescriptor);
      }

      return self;
    },
    /**
     * Extend the current or a given object with the given property and return the extended object.
     * @param prop The properties to extend with
     * @param obj [optional] The object to extend from
     * @returns The extended object
     */
    extend: function (prop, obj) {
      return this.mixin(prop, Object.create(obj || this));
    },
    /**
     * Return a callback function with this set to the current or a given context object.
     * @param name Name of the method to proxy
     * @param args... [optional] Arguments to use for partial application
     */
    proxy: function (name) {
      var fn = this[name];
      var args = Array.prototype.slice.call(arguments, 1);

      args.unshift(this);
      return fn.bind.apply(fn, args);
    }
  };
}));
