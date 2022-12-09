Function.prototype.newApply = function (thisArg, argsList) {
  // 处理借用函数执行时this指向
  const context = [undefined, null].includes(thisArg)
    ? window || global
    : Object(thisArg);
  // 当前this指向被借用的函数，将之添加到context中
  context.fn = this;
  // 使用eval执行context.fn，fn执行时this指向context
  const result = eval('context.fn(...argsList)'); // context.fn(...argsList);
  // 将借用函数从context中删除
  delete context.fn;

  return result;
};
