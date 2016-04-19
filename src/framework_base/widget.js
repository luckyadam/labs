'use strict';

import Events from './events.js';

class Widget extends Events {
  constructor(config) {
    super();
    this.__config = config;
    this.eventSplitter = /\s+/;
    this.events = {};
    this.template = '';
    this._delegateEvent();
    this.setUp();
  }
  
  _delegateEvent () {
    var events = this.events || {};
    var parent = this.get('parent') || $(document.body);
    for (let eventStr in events) {
      let eventCb = events[eventStr];
      let eventArr = eventStr.split[this.eventSplitter];
      let selector = eventArr[0];
      let eventType = eventArr[1];
      if (eventArr.length < 2) {
        continue;
      }
      parent.on(selector, eventType, function (e) {
        eventCb.call(this, e);
      });
    }
  }
  
  _parseTemplate (str, data) {
    var fn = new Function('obj',
        'var p=[],print=function(){p.push.apply(p,arguments);};' +
        'with(obj){p.push(\'' + str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") +
        "');}return p.join('');");
    return data ? fn(data) : fn;
  }
  
  render (data) {
    if (!this.template) {
      return;
    }
    this.set('__data', data);
    var htmlStr = this._parseTemplate(this.template, data);
    var parent = this.get('parent') || $(document.body);
    this.set('__currentDom', $(htmlStr));
    parent.append(this.get('__currentDom'));
  }
  
  setUp () {
    this.render();
  }
  
  setState (obj) {
    if (!this.template) {
      return;
    }
    var data = this.get('__data');
    for (let key in obj) {
      data[key] = obj[key];
    }
    
    var htmlDom = $(this._parseTemplate(this.template, data));
    var currentDom = self.get('__currentDom');
    if (!currentDom) {
      return;
    }
    currentDom.replaceWith(htmlDom);
    self.set('__currentDom', htmlDom);
  }
  
  destroy () {
    this.off();
    this.get('__currentDom').remove();
    var events = this.events || {};
    var parent = this.get('parent') || $(document.body);
    for (let eventStr in events) {
      let eventCb = events[eventStr];
      let eventArr = eventStr.split[this.eventSplitter];
      let selector = eventArr[0];
      let eventType = eventArr[1];
      if (eventArr.length < 2) {
        continue;
      }
      parent.off(selector, eventType, function (e) {
        eventCb.call(this, e);
      });
    }
  }
  
  get (key) {
    return this.__config[key];
  }
  
  set (key, value) {
    this.__config[key] = value;
  }
}