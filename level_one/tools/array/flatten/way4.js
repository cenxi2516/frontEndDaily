// 仅适用于：数组中仅包含数值、字符串、布尔值，对象中没有数组
const flatten = (arr) =>
  JSON.parse(`[${JSON.stringify(arr).replace(/\[|\]/g, '')}]`);
