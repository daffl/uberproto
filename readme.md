Uberproto is a simple base object that adds some sugar to ECMAScript 5 style object inheritance
in JavaScript.

Here is what it can do in a nutshell:

- Easily extend objects
- Initialization methods
- Super methods
- Mixins
- Method proxies

With a small footprint (about 1Kb minified) and an easy to handle API of just
four methods it also doesn't add a lot of baggage to your JavaScript application.

## Usage

UberProto can be used as a [CommonJS AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) module
(e.g. with [RequireJS](http://requirejs.org/)), [NodeJS](http://nodejs.org) or directly
in the browser. If no module loader is available, the global variable _Proto_
will be defined after you include the script.

### Using AMD (e.g. RequireJS)

Make sure proto.js is in the right folder and then just define a module like this:

	define(['proto'], function(Proto) {
		// Source goes here
	});

### In the browser

[Download proto.min.js](https://raw.github.com/daffl/uberproto/master/proto.min.js)
(1Kb minified) and include it as a script:

	<script type="text/javascript" src="proto.min.js"></script>

Now *Proto* is available as a global vairable.

### With NodeJS

After installing the package using NPM

> npm install uberproto

just require it like any other module:

	var Proto = require('uberproto');

## Creating objects

### Extend

You can extend any UberProto object by using *extend* to create a new object that inherits from the current one.
Internally [Object.create](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create) is
being used (the library provides a polyfill for browsers that don't support Object.create)
and the prototype is set to the object that you are extending.
If defined, the *init* method will be used as the constructor.
That way you can define a simple Person object (which will be reused throughout the next paragraphs):

	var Person = Proto.extend({
		init : function(name) {
			this.name = name;
		},
		
		fullName : function() {
			return this.name;
		}
	});

You can also define a plain object and pass it to UberProto object methods:

	var PersonObject = {
		init : function(name) {
			this.name = name;
		},

		fullName : function() {
			return this.name;
		}
	};

Play around with the examples in [this JSFiddle](http://jsfiddle.net/Daff/2GB8n/1/).

### Initialize

You can create a new instance by calling *create*. This will create a new object and call the *init* method,
if defined:

	var dave = Person.create('Dave');
	console.log(dave.name); // -> 'Dave'
	console.log(dave.fullName()); // -> 'Dave'

If you are using *init* already for something else you can also set the *__init* property to the method name
of your intialization method:

	var MyPerson = Proto.extend({
		__init : 'construct',

		construct : function(name) {
			this.name = name;
		}
	});

For calling the constructor on a plain object, call *create* on an UberProto object:

	var john = Proto.create.call(PersonObject, 'John');
	console.log(john.fullName()); // -> 'John'

Overwriting *create* is great if you want to customize the way new objects are being
instantiated.

### Super methods
	
In each method `this._super` refers to the method being overwritten, if there is one.
For our Person object, for example, it would be a lot better if it also had a last name:

	var BetterPerson = Person.extend({
		init : function(name, lastname) {
			// If you want to pass all original arguments to the
			// _super method just use apply:
			// this._super.apply(this, arguments);
			
			this._super(name);
			this.lastname = lastname;
		},
		
		fullName : function() {
			return this._super() + ' ' + this.lastname;
		}
	});

	var dave = BetterPerson.create('Dave', 'Doe');
	console.log(dave.name); // -> 'Dave'
	console.log(dave.lastname); // -> 'Doe'
	console.log(dave.fullName()); // -> 'Dave Doe'

You can also extend a plain object if you don't want to inherit from an UberProto object:

	var BetterPersonObject = Proto.extend({
        init : function(name, lastname) {
            this._super(name);
            this.lastname = lastname;
        },

        fullName : function() {
            return this._super() + ' ' + this.lastname;
        }
    }, PersonObject); // Pass the plain object as the second parameter

### Mixins

Mixins add functionality to an existing object. Mixins can also access their super methods using `this._super`.
This will either refer the overwritten method on the object itself or the one on the prototype:

	Person.mixin({
		init : function()
		{
			this._super.apply(this, arguments);
			this.can_sing = true;
		},
		
		sing : function()
		{
			return 'Laaaa';
		}
	});
	
	var dude = Person.create('Dude');
	console.log(dude.sing()); // -> 'Laaaa'
	console.log(dude.can_sing); // -> true

Actual instances can be mixed in just the same:

	var operaSinger = Person.create('Pavarotti');
	operaSinger.mixin({
		sing : function()
		{
			return this._super() + ' Laalaaa!';
		}
	});

	console.log(operaSinger.sing()); // -> 'Laaaa Laalaaa!

And you can also mix into plain objects e.g. overwriting the constructor of PersonObject:

	Proto.mixin({
		fullName : function() {
			return 'My name is: ' + this._super();
		}
	}, PersonObject);

	// Create a plain object without calling the constructor
	var instance = Object.create(PersonObject);
	instance.name = 'Dude';
	console.log(instance.fullName()); // 'My name is: Dude'

### Method proxy

You can create proxy callbacks, that make sure that _this_ will always
point to the right object:
	
	var callback = operaSinger.proxy('fullName');
	console.log(callback()); // -> 'Pavarotti'

And of course proxy methods of plain objects:

	var cb = Proto.proxy('fullName', PersonObject);

## Changelog

__1.0.2__

* Added `__init` property to allow constructor functions to be named other than *init*. Fixes issue [#1](https://github.com/daffl/uberproto/pull/1)

__1.0.1__

* API now usable with plain objects like `Proto.mixin({}, PlainObject)`

__1.0.0__

* Initial stable release
