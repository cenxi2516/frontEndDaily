Function.prototype.newBind = function (context, ...fixedArgs) {
  // 1. newBind只能被一个函数调用
  if (typeof this !== 'function') {
    throw new TypeError(`${this} 不是一个函数`);
  }

  // 2. 当前this指向被借用函数
  const borrowFn = this;
  // 3. 返回一个新的函数，使用apply执行被借用函数，并改变函数内this指向
  const bound = function (...transArgs) {
    return borrowFn.apply(context, [...fixedArgs, ...transArgs]);
  };
  // 4. 若是被借用函数存在原型，则新函数的原型继承被借用函数的原型。注：箭头函数没有原型
  borrowFn.prototype &&
    Object.setPrototypeOf(bound.prototype, borrowFn.prototype);

  return bound;
};
