if(typeof Proto == "undefined") {
	var Proto = require('../lib/proto');
}

this.suite = {
	extend : function(test) {
		test.expect(2);
		
		var Extended = Proto.extend({
			sayHi : function() {
				test.ok(true, 'sayHi called');
				return 'hi';
			}
		});
		
		test.equal(Extended.create().sayHi(), "hi", "Said hi");
		test.done();
	},

	create : function(test) {
		test.expect(5);
		
		var Obj = Proto.extend({
			init : function(name)
			{
				test.ok(true, 'Init called');
				this.name = name;
			},
			
			sayHi : function()
			{
				return 'Hi ' + this.name;
			}
		});
		
		var inst = Obj.create('Tester');
		test.equal(inst.name, 'Tester', 'Name set');
		test.equal(inst.sayHi(), 'Hi Tester', 'Said hi with name');
		test.ok(Proto.isPrototypeOf(Obj), 'Should have prototype of Proto');
		test.ok(Obj.isPrototypeOf(inst), 'Instance should have prototype of Obj');
		test.done();
	},

	initAlias : function(test) {
		test.expect(2);
		var Obj = Proto.extend({
				__init : 'myConstructor',
				myConstructor : function(arg) {
					test.equal(arg, 'myConstructor', 'Got proper arguments in myConstructor');
				}
			}),
			OtherObj = {
				__init : 'testConstructor',
				testConstructor : function(arg) {
					test.equal(arg, 'testConstructor', 'Got proper arguments in myConstructor');
				}
			}

		Obj.create('myConstructor');
		Proto.create.call(OtherObj, 'testConstructor');
		test.done();
	},

	_super : function(test) {
		test.expect(3);
		
		var Obj = Proto.extend({
			init : function(name)
			{
				test.ok(true, 'Super init called');
				this.name = name;
			}
		}), Sub = Obj.extend({
			init : function() {
				this._super.apply(this, arguments);
				test.ok(true, 'Sub init called');
			}	
		});
		
		var inst = Sub.create('Tester');
		test.equal(inst.name, 'Tester', 'Name set in prototype');

		test.done();
	},

	extendObject : function(test)
	{
		test.expect(3);

		var Obj = {
			test : function(name)
			{
				test.ok(true, 'Super test method called');
				this.name = name;
			}
		};

		var Extended = Proto.extend({
			test : function() {
				this._super.apply(this, arguments);
				test.ok(true, 'Sub init called');
			}
		}, Obj);

		Extended.test('Tester');

		test.equal(Extended.name, 'Tester', 'Name set in prototype');

		test.done();
	},

	mixin : function(test) {
		test.expect(3);
		
		var Obj = Proto.extend({
			init : function(name)
			{
				test.ok(true, 'Init called');
				this.name = name;
			}
		});
		
		Obj.mixin({
			test : function()
			{
				return this.name;
			}
		});
		
		var inst = Obj.create('Tester');
		test.equal(inst.test(), 'Tester', 'Mixin returned name');
		
		Obj.mixin({
			test : function() {
				return this._super() + ' mixed in';
			}
		});
		
		test.equal(inst.test(), 'Tester mixed in', 'Mixin called overwritten');
		test.done();
	},

	mixinObject : function(test)
	{
		test.expect(3);

		var Obj = {
			test : function(name)
			{
				test.ok(true, 'Super test method called');
				this.name = name;
			}
		};

		Proto.mixin({
			test : function() {
				this._super.apply(this, arguments);
				test.ok(true, 'Sub init called');
			}
		}, Obj);

		Obj.test('Tester');

		test.equal(Obj.name, 'Tester', 'Name set in prototype');

		test.done();
	},

	proxy : function(test) {
		test.expect(1);
		
		var Obj = Proto.extend({
			init : function(name)
			{
				this.name = name;
			},
			
			test : function(arg) {
				return this.name + ' ' + arg;
			}
		});
		
		var inst = Obj.create('Tester'),
		callback = inst.proxy('test');
		test.equal(callback('arg'), 'Tester arg', 'Callback set scope properly');
		test.done();		
	}
};