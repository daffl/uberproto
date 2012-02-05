var Proto = require('./lib/proto');

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

var dave = Person.create('Dave');
console.log(dave.name); // -> 'Dave'
console.log(dave.fullName()); // -> 'Dave'

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

var operaSinger = Person.create('Pavarotti');
operaSinger.mixin({
	sing : function()
	{
		return this._super() + ' Laalaaa!';
	}
});

console.log(operaSinger.sing()); // -> 'Laaaa Laalaaa!

var callback = operaSinger.proxy('fullName');
console.log(callback()); // -> 'Pavarotti'
