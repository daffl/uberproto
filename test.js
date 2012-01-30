test("Test extend", function() {
	expect(2);
	
	var Extended = Proto.extend({
		sayHi : function() {
			ok(true, 'sayHi called');
			return 'hi';
		}
	});
	
	equal(Extended.create().sayHi(), "hi", "Said hi");
});

test("Test create", function() {
	expect(3);
	
	var Obj = Proto.extend({
		init : function(name)
		{
			ok(true, 'Init called');
			this.name = name;
		},
		
		sayHi : function()
		{
			return 'Hi ' + this.name;
		}
	});
	
	var inst = Obj.create('Tester');
	equal(inst.name, 'Tester', 'Name set');
	equal(inst.sayHi(), 'Hi Tester', 'Said hi with name');
});

test("Test extend", function() {
	expect(3);
	
	var Obj = Proto.extend({
		init : function(name)
		{
			ok(true, 'Super init called');
			this.name = name;
		}
	}), Sub = Obj.extend({
		init : function() {
			this._super.apply(this, arguments);
			ok(true, 'Sub init called');
		}	
	});
	
	var inst = Sub.create('Tester');
	equal(inst.name, 'Tester', 'Name set in prototype');
});

test("Test mixin", function() {
	expect(3);
	
	var Obj = Proto.extend({
		init : function(name)
		{
			ok(true, 'Init called');
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
	equal(inst.test(), 'Tester', 'Mixin returned name');
	
	Obj.mixin({
		test : function() {
			return this._super() + ' mixed in';
		}
	});
	
	equal(inst.test(), 'Tester mixed in', 'Mixin called overwritten');
});

test("Test proxy", function() {
	expect(1);
	
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
	equal(callback('arg'), 'Tester arg', 'Callback set scope properly');		
});
