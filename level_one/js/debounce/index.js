/**
 * 函数防抖
 * @param {function} fn 要防抖的函数
 * @param {number} delay 要延时的毫秒数
 * @param {boolean} immediate 是否立即执行，true：立即执行，false：非立即执行
 * @returns
 */
function debounce(fn, delay, immediate) {
  var timer = null;
  return function () {
    var context = this,
      args = arguments;

    timer && clearTimeout(timer);
    if (immediate) {
      // 立即执行
      var nowExec = !timer;
      nowExec && fn.apply(context, args);

      timer = setTimeout(function () {
        timer = null;
      }, delay);
    } else {
      // 非立即执行
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
}

/**
 *
 * @param {function} fn 要节流的函数
 * @param {number} delay 要延迟的毫秒数
 * @param {boolean} immediate 是否要立即执行， true：立即执行，false：非立即执行
 * @returns
 */
function throttle(fn, delay, immediate) {
  var timer = null;
  var lastExecTime = 0;

  return function () {
    var context = this,
      args = arguments;

    if (immediate) {
      // 立即执行
      var nowExecTime = +new Date();
      if (nowExecTime - lastExecTime > delay) {
        fn.apply(context, args);
        lastExecTime = nowExecTime;
      }
    } else {
      // 非立即执行
      if (timer) return;
      timer = setTimeout(function () {
        fn.apply(context, args);
        timer = null;
      }, delay);
    }
  };
}
