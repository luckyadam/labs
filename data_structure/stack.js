'use strict';

class Stack {
  constructor () {
    this.dataSource = [];
  }

  push (element) {
    this.dataSource.push(element);
  }
  
  pop () {
    return this.dataSource.pop();
  }
  
  peek () {
    return this.dataSource[this.length() - 1];
  }
  
  length () {
    return this.dataSource.length;
  }
  
  clear () {
    this.dataSource = [];
  }
  
  isEmpty () {
    return this.length() === 0;
  }
  
  print () {
    console.log(this.dataSource.toString());
  }
}