/**
 * 函数管道：传递多个单参数函数，返回一个新的函数。在这些函数中，上一个函数的输出，是下一个函数的输入
 * @return {Function} 新的函数
 */
function pipe() {
  var fnArgs = arguments;

  return function() {
    var context = this,
      transArgs = arguments;
    var fnResult;

    for (var i = 0, len = fnArgs.length; i < len; i++) {
      fnResult = i === 0 ? fnArgs[i].apply(context, transArgs) : fnArgs[i].call(context, fnResult);
    }

    return fnResult;
  }
}