Uberproto is a simple base object that adds some sugar to ECMAScript 5 style object inheritance
in JavaScript.

Here is what it can do in a nutshell:

- Easily extend objects
- Initialization methods
- Super methods
- Mixins
- Method proxies

With a small footprint (0.8Kb minified and 0.4Kb compressed) and an easy to handle
API of just four methods it also doesn't add a lot of baggage to your JavaScript application.

## Usage

UberProto can be used as a [CommonJS AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) module
(e.g. with [RequireJS](http://requirejs.org/)), [NodeJS](http://nodejs.org) or directly
in the browser. If no module loader is available, the global variable _Proto_
will be defined after you include the script.
To be compatible with all browsers, you also need the [ES5-shim](https://github.com/kriskowal/es5-shim).

### Using AMD (e.g. RequireJS)

Make sure proto.js is in the right folder and then just define a module like this:

	define(['proto'], function(Proto) {
		// Source goes here
	});

### Straight in the browser

	<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js"></script>
	<script type="text/javascript" src="proto.min.js"></script>

Now _Proto_ is available as a global vairable.

### With NodeJS

After installing the package using NPM

> npm install uberproto

just require it like any other module:

	var Proto = require('uberproto');

## Creating objects

### Extend

You can extend any UberProto object by using *extend* to create a
new object that inherits from the current one. Internally Object.create is
being used and the prototype is set to the object that you are extending.
If defined, the _init_ method will be used as the constructor.
That way you can define a simple Person object (which will be reused
throughout the next paragraphs):

	var Person = Proto.extend({
		init : function(name)
		{
			this.name = name;
		},
		
		fullName : function()
		{
			return this.name;
		}
	});

### Initialize

You can create a new instance by calling _create_:	

	var dave = Person.create('Dave');
	console.log(dave.name); // -> 'Dave'
	console.log(dave.fullName()); // -> 'Dave'

Overwriting _create_ is great if you want to customize the way objects are being
instantiated.

### Super methods
	
In each method *this.\_super* refers to the method being overwritten,
if there is one. For our Person object, for example, it would be a lot better
if it also had a last name:

	var BetterPerson = Person.extend({
		init : function(name, lastname)
		{
			// If you want to pass all original arguments to the
			// _super method just use apply:
			// this._super.apply(this, arguments);
			
			this._super(name);
			this.lastname = lastname;
		},
		
		fullName : function()
		{
			return this._super() + ' ' + this.lastname;
		}
	});

	var dave = BetterPerson.create('Dave', 'Doe');
	console.log(dave.name); // -> 'Dave'
	console.log(dave.lastname); // -> 'Doe'
	console.log(dave.fullName()); // -> 'Dave Doe'

### Mixins

Mixins add functionality to an existing object. Mixins can also
access their super methods using *this.\_super*. This will either refer
the overwritten method on the object itself or the one on the prototype:

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

### Method proxy

You can create proxy callbacks, that make sure that _this_ will always
point to the right object:
	
	var callback = operaSinger.proxy('fullName');
	console.log(callback()); // -> 'Pavarotti'

## Extending existing objects

Although it is the default functionality, you don't have to inherit from the UberProto base object to use its
functionality. *extend*, *mixin* and *proxy* are all able to take an existing object as the second parameter:

	var Person = {
		fullName : function()
		{
			return this.name;
		}
	};

	// Mix in a setName method.
	Proto.mixin({
		setName : function(name) {
			this.name = name;
		}
	}, Person);

	// Create a new Person instance
	var instance = Object.create(Person);
	instance.setName('Dude');
	console.log(instance.fullName()); // -> Dude

	// Create a proxy
	var callback = Proto.proxy('fullName', instance);
	console.log(callback()); // -> Dude

	// Extend Person and return the extended object
	// _super works as usual for extend and mixin
	var Extended = Proto.extend({
		fullName : function()
		{
			return this.lastname + " " + this._super();
		},

		setName : function(name, lastname)
		{
			this._super(name);
			this.lastname = lastname;
		}
	}, Person);

	var extendedInstance = Object.create(Extended);
    extendedInstance.setName('Dude', 'The');
    console.log(extendedInstance.fullName()); // -> The Dude

To use the *init* constructor method you can simply call *create*:

	var Person = {
		init : function(name) {
			this.name = name;
		}
	}

	var instance = Proto.create.call(Person, 'Dude');

