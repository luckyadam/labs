'use strict';

class Queue {
  constructor(props) {
    this.dataSource = [];    
  }
  
  enqueue (element) {
    this.dataSource.push(element);
  }
  
  dequeue () {
    return this.dataSource.shift();
  }
  
  front () {
    return this.dataSource[0];
  }
}