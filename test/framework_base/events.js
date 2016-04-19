'use strict';

const assert = require('chai').assert;
const Events = require('../../dist/framework_base/events.js').default;

describe('测试 Events', function() {
  describe('#测试初始化', function () {
    it('初始化Events应该具有on/off/trigger方法', function () {
      var events = new Events();
      assert.typeOf(events.on, 'function');
      assert.typeOf(events.off, 'function');
      assert.typeOf(events.trigger, 'function');
    });
  });
  
  describe('#测试on()', function () {
    it('执行on方法后，callbacks应该不为空', function () {
      var events = new Events();
      var cb = function () {
        console.log('test');
      };
      events.on('test1 test2', cb);
      events.on('test1', function () {
        console.log('xxx');
      });
      assert.property(events.callbacks, 'test1');
      assert.property(events.callbacks, 'test2');
    });
  });
  
  describe('#测试off()', function () {
    
    it('执行off方法，参数为空，所有事件应该被清空', function () {
      var events = new Events();
      var cb = function () {
        console.log('test');
      };
      events.on('test1 test2', cb);
      events.on('test1', function () {
        console.log('xxx');
      });
      events.off();
      assert.notProperty(events.callbacks, 'test1');
      assert.notProperty(events.callbacks, 'test2');
    });
    
    it('执行off方法，应该清除传入的事件', function () {
      var events = new Events();
      var cb = function () {
        console.log('test');
      };
      events.on('test1 test2', cb);
      events.on('test1', function () {
        console.log('xxx');
      });
      events.off('test1');
      assert.notProperty(events.callbacks, 'test1');
      assert.property(events.callbacks, 'test2');
    });
  });
  
  describe('#测试trigger()', function () {
    it('执行trigger()方法，将触发定义的事件，并依次执行定义的回调', function () {
      var events = new Events();
      var count = 0;
      var msgText = '';
      var cb = function (msg) {
        count++;
        msgText = msg;
      };
      events.on('test1 test2', cb);
      events.on('test1', function () {
        count++;
      });
      events.trigger('test1');
      assert.equal(count, 2);
      events.trigger('test2', 'test');
      assert.equal(msgText, 'test');
    });
  });
});