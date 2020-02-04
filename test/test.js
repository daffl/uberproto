const assert = require('assert');
const Proto = require('../lib/proto');

describe('UberProto', function () {
  it('extends objects', function () {
    var Extended = Proto.extend({
      sayHi: function () {
        assert.ok(true, 'sayHi called');
        return 'hi';
      }
    });

    assert.strictEqual(Extended.create().sayHi(), 'hi', 'Said hi');
  });

  it('extends objects with Symbol', function () {
    var testProp = Symbol('test-it');
    var Extended = Proto.extend({
      sayHi: function () {
        assert.ok(true, 'sayHi called');
        return 'hi';
      },
      [testProp]: true
    });

    assert.strictEqual(Extended.create().sayHi(), 'hi', 'Said hi');
    assert.ok(Extended[testProp], 'Symbol prop conserved');
  });

  it('mixin objects with Symbol', function () {
    var testProp = Symbol('test-it');
    var Obj = Proto.extend({
      init: function (name) {
        assert.ok(true, 'Init called');
        this.name = name;
      },
      test: Object.assign(function () {
        return this.name;
      }, { testProp: true })
    });

    Obj.test[testProp] = true;

    var inst = Obj.create('Tester');

    assert.ok(inst.test[testProp]);

    Obj.mixin({
      test: function () {
        return this._super() + ' mixed in';
      },
      otherTest: function () {
        return typeof this._super === 'function';
      }
    });

    assert.strictEqual(inst.test(), 'Tester mixed in');
    assert.ok(Obj.test[testProp], 'Symbol conserved on method (Obj)');
    assert.ok(inst.test[testProp], 'Symbol conserved on method (inst)');
    assert.ok(Obj.test.testProp, 'prop conserved on method (Obj)');
    assert.ok(inst.test.testProp, 'prop conserved on method (inst)');
    assert.ok(!inst.otherTest());
  });

  it('creates a new object', function () {
    var Obj = Proto.extend({
      init: function (name) {
        assert.ok(true, 'Init called');
        this.name = name;
      },

      sayHi: function () {
        return 'Hi ' + this.name;
      },

      prop: 'Testing'
    });

    var inst = Obj.create('Tester');
    assert.strictEqual(inst.name, 'Tester', 'Name set');
    assert.strictEqual(inst.prop, 'Testing', 'Prototype property still there');
    assert.strictEqual(inst.sayHi(), 'Hi Tester', 'Said hi with name');
    assert.ok(Proto.isPrototypeOf(Obj), 'Should have prototype of Proto');
    assert.ok(Obj.isPrototypeOf(inst), 'Instance should have prototype of Obj');
  });

  it('uses an init method alias', function () {
    var Obj = Proto.extend({
      __init: 'myConstructor',
      myConstructor: function (arg) {
        assert.strictEqual(arg, 'myConstructor', 'Got proper arguments in myConstructor');
      }
    });
    var OtherObj = {
      __init: 'testConstructor',
      testConstructor: function (arg) {
        assert.strictEqual(arg, 'testConstructor', 'Got proper arguments in myConstructor');
      }
    };

    Obj.create('myConstructor');
    Proto.create.call(OtherObj, 'testConstructor');
  });

  it('uses _super', function () {
    var Obj = Proto.extend({
      init: function (name) {
        assert.ok(true, 'Super init called');
        this.name = name;
      }
    });
    var Sub = Obj.extend({
      init: function () {
        this._super.apply(this, arguments);
        assert.ok(true, 'Sub init called');
      }
    });

    var inst = Sub.create('Tester');
    assert.strictEqual(inst.name, 'Tester', 'Name set in prototype');
  });

  it('extends an existing object', function () {
    var Obj = {
      test: function (name) {
        assert.ok(true, 'Super test method called');
        this.name = name;
      }
    };

    var Extended = Proto.extend({
      test: function () {
        this._super.apply(this, arguments);
        assert.ok(true, 'Sub init called');
      }
    }, Obj);

    Extended.test('Tester');

    assert.strictEqual(Extended.name, 'Tester', 'Name set in prototype');
  });

  it('uses .mixin', function () {
    var Obj = Proto.extend({
      init: function (name) {
        assert.ok(true, 'Init called');
        this.name = name;
      }
    });

    Obj.mixin({
      test: function () {
        return this.name;
      }
    });

    var inst = Obj.create('Tester');
    assert.strictEqual(inst.test(), 'Tester', 'Mixin returned name');

    Obj.mixin({
      test: function () {
        return this._super() + ' mixed in';
      }
    });

    assert.strictEqual(inst.test(), 'Tester mixed in', 'Mixin called overwritten');
  });

  it('.mixin(Object)', function () {
    var Obj = {
      test: function (name) {
        assert.ok(true, 'Super test method called');
        this.name = name;
      }
    };

    Proto.mixin({
      test: function () {
        this._super.apply(this, arguments);
        assert.ok(true, 'Sub init called');
      }
    }, Obj);

    Obj.test('Tester');

    assert.strictEqual(Obj.name, 'Tester', 'Name set in prototype');
  });

  it('uses .proxy', function () {
    var Obj = Proto.extend({
      init: function (name) {
        this.name = name;
      },

      test: function (arg) {
        return this.name + ' ' + arg;
      }
    });

    var inst = Obj.create('Tester');
    var proxied = inst.proxy('test');

    assert.strictEqual(proxied('arg'), 'Tester arg', 'Callback set scope properly'); // eslint-ignore-line

    proxied = inst.proxy('test', 'partialed');
    assert.strictEqual(proxied(), 'Tester partialed', 'Callback partially applied');
  });

  describe('Babel transpiled classes (#10)', function () {
    if (typeof require !== 'function' || typeof Object.defineProperty !== 'function') {
      return;
    }

    var classes = require('./class-fixture.es5.js');

    it('works with Babel transpiled classes (#10)', function () {
      var person = new classes.Person('John');

      assert.strictEqual(person.sayHi(), 'Hi John');

      Proto.mixin({
        sayHi: function () {
          return this._super() + '!!';
        }
      }, person);

      assert.strictEqual(person.sayHi(), 'Hi John!!');

      var otherPerson = new classes.OtherPerson();

      assert.strictEqual(otherPerson.sayHi(), 'Hi David Luecke');

      Proto.mixin({
        sayHi: function () {
          return this._super() + '???';
        }
      }, otherPerson);

      assert.strictEqual(otherPerson.sayHi(), 'Hi David Luecke???');
      assert.ok(otherPerson.test());
    });

    it('can extend from Babel transpiled classes (#10)', function () {
      var otherPerson = new classes.OtherPerson();

      assert.strictEqual(otherPerson.sayHi(), 'Hi David Luecke');

      var extended = Proto.extend(otherPerson);

      assert.strictEqual(typeof extended.sayHi, 'function');

      assert.strictEqual(extended.sayHi(), 'Hi David Luecke');
      assert.ok(extended.test());

      assert.ok(!Object.getOwnPropertyDescriptor(extended, 'sayHi').enumerable);
      assert.ok(!Object.getOwnPropertyDescriptor(extended, 'test').enumerable);
      assert.ok(Object.getOwnPropertyDescriptor(extended, 'name').enumerable);

      var extext = extended.extend({
        sayHi: function () {
          return this._super() + '!!!';
        }
      });

      assert.strictEqual(extext.sayHi(), 'Hi David Luecke!!!');
    });
  });
});
