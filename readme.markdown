Uberproto is a simple base object that adds some sugar to ECMAScript 5 style object inheritance
in JavaScript. Features:

- Initialization methods
- Easy object inheritance
- Mixins
- Access overwritten methods
- Method proxy

## Usage

Uberproto is wrapped in an CommonJS AMD module which can be used with NodeJS, RequireJS and any
other loader that implements asynchronous modules. If no module loader is available, the global
variable _Proto_ will be available after you included the script.
To be compatible with all browsers, you also need the ES5-shim.

### With RequireJS (AMD)

	define(['proto'], function(Proto) {
		// Source goes here
	});

### Right in the browser

	<script type="text/javascript" 
		src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js">
	</script>
	<script type="text/javascript" src="proto.js"></script>
	
### With NodeJS

After installing with NPM

> npm install uberproto

Just require it like any other module:

	var Proto = require('uberproto');


## Creating objects

### Initialization methods

When extending the UberProto object an _init_ method will be used as the constructor:

	var Sub = Proto.extend({
		init : function(name)
		{
			this.name = name;
		}
	});

### Creating objects

You can create a new instance by calling _create_:	

	var instance = Sub.create('Test');
	// instance.name == 'Test'

### Extension

*extend* is used to create a new object that inherits from the current one
(using Object.create and setting the prototype to the base object).
In each method *this.\_super* refers to the overwritten method, if there is one:

	var SubSub = Sub.extend({
		init : function(name, age)
		{
			this._super(name);
			this.age = age;
		}
	}); 
	
### Mixins

Mixins work similar to object extension but allows to add functionality to an existing
object:

	Person.mixin({
		sing : function() {
			return 'Laaaa';
		}
	});
	
	var dude = Person.create('Test');
	dude.sing();
	
Mixins can also access their super methods using *this.\_super*. This will either call
the overwritten method on the object itself or its prototype:

	Person.mixin({
		sing : function() {
			return this._super() + ' Laalaaa!';
		}
	});

	var operaSinger = Person.create('Test');
	operaSinger.sing();

### Method proxy

UberProto can create proxy callbacks, that make sure that _this_ will always
refer to the object instance:
	
	var callback = operaSinger.proxy('sing');
	callback(); 