'use strict';

/**
 * 同样是构建函数体给Function执行
 */

const templateEngine = (tpl, data) => {
  const reg = /<%=([\s\S]+?)%>|<%([\s\S]+?)%>|$/g;
  const escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  const escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };
  let cursor = 0;
  let code = 'var p = \'\';';
  code += 'p += \'';

  tpl.replace(reg, function (match, interpolate, evaluate, offset) {
    code += tpl.slice(cursor, offset).replace(escaper, function (match) {
      return '\\' + escapes[match];
    });

    if (evaluate) {
      code += '\';' + evaluate + 'p += \'';
    }

    if (interpolate) {
      code += '\' + ' + interpolate + ' + \'';
    }

    cursor = offset + match.length;
  });

  code += '\';return p;';
  return new Function('obj', code).apply(data);
};

export default templateEngine;