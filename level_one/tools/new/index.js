/**
 * 实现new
 * @param {Function} ctor 构造函数
 * @param  {...any} args 构造函数参数
 * @returns 引用值
 */
function _new(ctor, ...args) {
  // 参数处理
  // 1. ctor只能是函数
  if (typeof ctor !== 'function') {
    throw _new(TypeError, `${ctor} 不是一个函数`);
  }
  // 2. ctor不能是箭头函数
  if (!Object.prototype.hasOwnProperty.call(ctor, 'prototype')) {
    throw _new(
      SyntaxError,
      `${ctor} 是一个箭头函数，没有prototype属性，不能作为构造函数使用`
    );
  }

  // new执行过程
  // 1. 新建一个新对象，新对象的隐式原型指向构造函数的原型
  const newObj = Object.create(ctor.prototype);
  // 2. 构造函数内this指向新对象，执行构造函数内内代码，给新对象添加成员
  const returnValue = ctor.apply(newObj, args);
  // 3. 始终返回引用值
  const isObject = returnValue && typeof returnValue === 'object';
  const isFunction = typeof returnValue === 'function';

  return isObject || isFunction ? returnValue : newObj;
}
