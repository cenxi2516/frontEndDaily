/**
 * 函数柯里化：固定某函数前面参数，返回一个新的函数
 * @param  {Function} fn 需固定参数的函数
 * @return {Function}     柯里化后函数
 */
function curry(fn) {
  var fixedArg = Array.prototype.slice.call(arguments, 1);

  return function() {
    var context = this,
      currArg = Array.prototype.slice.call(arguments);;
    var allArg = [].concat(fixedArg, currArg);

    if (allArg.length >= fn.length) {
      return fn.apply(context, allArg);
    }

    return curry.apply(null, [].concat(fn, allArg));
  };
}