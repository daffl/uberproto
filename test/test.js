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