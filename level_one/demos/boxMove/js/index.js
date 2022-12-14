(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 函数防抖
   * @param {Function} fn 防抖函数
   * @param {number} delay 延迟的毫秒数
   * @param {boolean} immediate 是否立即执行
   * @returns 默认返回undefined
   */
  var debounce = function (fn, delay, immediate) {
    var timer = null; // 记录开启的定时器

    return function () {
      var context = this,
        args = arguments;

      timer && clearTimeout(timer);
      if (immediate) {
        var isImmediateExec = !timer;
        isImmediateExec && fn.apply(context, args);
        timer = setTimeout(function () {
          timer = null;
        }, delay);
      } else {
        timer = setTimeout(function () {
          fn.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  };

  /**
   * 鼠标左键按下拖拽盒子移动
   * @param {Element} boxDom
   */
  var dragBox = function (boxDom) {
    // boxDom注册鼠标按下事件
    boxDom.addEventListener('mousedown', function (e) {
      // 非鼠标左键按下无效
      if (e.button !== 0) return;
      // 记录鼠标初始位置
      var startX = e.clientX;
      var startY = e.clientY;
      // 记录盒子初始位置
      var boxClientData = boxDom.getBoundingClientRect();
      var startClientX = boxClientData.left;
      var startClientY = boxClientData.top;
      // 记录鼠标移动位置
      var _top = 0;
      var _left = 0;
      var _translateX = 0;
      var _translateY = 0;
      var config = {
        set top(val) {
          _top = val;
          boxDom.style.top = `${val}px`;
        },
        get top() {
          return _top;
        },
        set left(val) {
          _left = val;
          boxDom.style.left = `${val}px`;
        },
        get left() {
          return _left;
        },
        set translateX(val) {
          // 水平方向允许移动的范围
          val = val < -startClientX ? -startClientX : val;
          val = val > hMaxTranslate ? hMaxTranslate : val;

          boxDom.style.transform = `translate(${val}px, ${this.translateY}px)`;
          _translateX = val;
        },
        get translateX() {
          return _translateX;
        },
        set translateY(val) {
          // 垂直方向允许移动的范围
          val = val < -startClientY ? -startClientY : val;
          val = val > vMaxTranslate ? vMaxTranslate : val;

          boxDom.style.transform = `translate(${this.translateX}px, ${val}px)`;
          _translateY = val;
        },
        get translateY() {
          return _translateY;
        },
      };
      // 浏览器可视区域的尺寸
      var browserClientWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      var browserClientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      // 水平、垂直方向最大能移动的距离
      var hMaxTranslate =
        browserClientWidth - startClientX - boxClientData.width;
      var vMaxTranslate =
        browserClientHeight - startClientY - boxClientData.height;

      // 设置盒子移动距离
      var setBoxMove = debounce(function (e) {
        config.translateX = e.clientX - startX;
        config.translateY = e.clientY - startY;
      }, 5);

      // 设置盒子移动结束后位置
      var setBoxEndPos = function () {
        config.left = startClientX + config.translateX;
        config.top = startClientY + config.translateY;

        config.translateX = 0;
        config.translateY = 0;
      };

      // 禁止窗口默认菜单项出现
      var disabledMenuShow = function (e) {
        e.preventDefault();
      };

      // 结束盒子移动
      var endBoxMove = function (e) {
        if (e.button !== 0) return;

        this.removeEventListener('mousemove', setBoxMove);
        this.removeEventListener('contextmenu', disabledMenuShow);
        this.removeEventListener('mouseup', endBoxMove);
        setBoxEndPos();
      };

      // 禁止菜单项出现
      window.addEventListener('contextmenu', disabledMenuShow);
      // 鼠标在window移动
      window.addEventListener('mousemove', setBoxMove);
      // 鼠标在window弹起
      window.addEventListener('mouseup', endBoxMove);
    });
    //
  };

  var init = function () {
    dragBox($('.circle'));
  };

  init();
})();

/**
 * e.movementX: 相对于上一次鼠标移动的水平距离
 * e.movementY: 相对于上一次鼠标移动的垂直距离
 */
