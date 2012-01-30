# Uberproto

Uberproto is a simple base object that adds some sugar to ECMAScript 5 style object inheritance
in JavaScript. Features:

- Initialization methods
- Mixins
- Easy object inheritance
- Access overwritten methods
- Method proxy

## Usage

Uberproto is wrapped in an CommonJS AMD module which can be used with NodeJS, RequireJS and any
other loader that implements asynchronous modules. If no module loader is available, the global
variable _Proto_ will be available after you included the script.
To be compatible with all browsers, you also need the ES5-shim.

### With RequireJS

	define(['proto'], function(Proto) {
		// Source goes here
	});

### In the browser

	<script type="text/javascript" 
		src="http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js">
	</script>
	<script type="text/javascript" src="proto.js"></script>
	
### With NodeJS

After installing with NPM

> npm install uberproto

Just require it like any other module:

	var Proto = require('uberproto')
