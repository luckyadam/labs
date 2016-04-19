'use strict';

const isEmpty = (obj) => {
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
};

class Events {
  constructor () {
    this.eventSplitter = /\s+/;
    this.callbacks = {};
  }
  
  on (events, callback, context) {
    if (!callback) {
      return this;
    }
    events = events.split(this.eventSplitter);
    let event, node, tail, list;
    while (event = events.shift()) {
      list = this.callbacks[event];
      node = list ? list.tail : {};
      node.next = tail = {};
      node.context = context;
      node.callback = callback;
      this.callbacks[event] = {
        tail: tail,
        next: list ? list.next: node
      };
    }
    
    return this;
  }
  
  off (events, callback, context) {
    if (isEmpty(this.callbacks)) {
      return this;
    }
    if (arguments.length === 0) {
      this.callbacks = {};
      return this;
    }
    
    let event, node, tail, cb, ctx;
    events = events ? events.split(this.eventSplitter) : Object.keys(this.callbacks);
    while (event = events.shift()) {
      node = this.callbacks[event];
      delete this.callbacks[event];
      if (!node || !(callback || context)) {
        continue;
      }
      tail = node.tail;
      while ((node = node.next) !== tail) {
        cb = node.callback;
        ctx = node.context;
        if ((callback && cb !== callback) || (context && ctx !== context)) {
          this.on(event, cb, ctx);
        }
      }
    }
    
    return this;
  }
  
  trigger (events) {
    if (isEmpty(this.callbacks)) {
      return this;
    }
    
    let event, node, tail, argsRest;
    events = events.split(this.eventSplitter);
    argsRest = [].slice.call(arguments, 1) || [];
    
    while (event = events.shift()) {
      if (node = this.callbacks[event]) {
        tail = node.tail;
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, argsRest);
        }
      }
    }
    
    return this;
  }
}

export default Events;