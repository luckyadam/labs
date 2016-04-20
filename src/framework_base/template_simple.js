'use strict';

/**
 * 一个简单模板引擎
 * 思路是使用正则匹配出js逻辑部分
 * 将非js逻辑部分塞入数组，这样将模板重新拼接成一个字符串
 * 再使用Function类来编译这个字符串
 */
const templateEngine = (tpl, data) => {
  const reg = /<%([^%>]+)?%>/g;
  const regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  let code = 'var r = [];\n';
  let cursor = 0;
  let match;
  
  const add = (line, js) => {
    js ? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
      (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
    return add;
  };
  
  while (match = reg.exec(tpl)) {
    add(tpl.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  
  add(tpl.substr(cursor, tpl.length - cursor));
  code += 'return r.join("");';
  return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
};
