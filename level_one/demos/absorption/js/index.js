(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  var debounce = function (fn, delay = 200, immediate = false) {
    var timer = null;

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
   * 获取dom元素在页面的水平、垂直位置
   * @param {Element} dom dom元素
   * @returns dom元素在页面的位置
   */
  var getElementPositionInPage = function (dom) {
    var parent = dom.offsetParent;
    var left = 0;
    var top = 0;

    while (parent) {
      left +=
        dom.offsetLeft + parseFloat(getComputedStyle(parent).borderLeftWidth);
      top +=
        dom.offsetTop + parseFloat(getComputedStyle(parent).borderTopWidth);

      dom = parent;
      parent = parent.offsetParent;
    }

    return { left, top };
  };

  /**
   * 元素新增顶部吸附效果
   * @param {Element} dom dom元素
   * @param {number} top 距离顶部吸附距离
   */
  var absorptionEffect = function (dom, top = 0) {
    var domWidth = dom.offsetWidth;
    var domHeight = dom.offsetHeight;
    var domPosInPage = getElementPositionInPage(dom);
    var pageLeft = domPosInPage.left;
    var pageTop = domPosInPage.top;
    var currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    console.log(domPosInPage);
    // 新增固定定位
    var addAbsorption = function (left) {
      dom.style.position = 'fixed';
      dom.style.top = top + 'px';
      dom.style.left = left + 'px';
      dom.style.width = domWidth + 'px';
      dom.style.height = domHeight + 'px';
    };
    // 移除固定定位(将元素的相应行内样式属性设置为空字符串，则会移除该行内样式属性)
    var removeAbsorption = function () {
      dom.style.position = '';
      dom.style.top = '';
      dom.style.left = '';
      dom.style.width = '';
      dom.style.height = '';
    };

    // 切换吸附效果
    var toggleAbsorption = function (currentScrollTop, pageTop) {
      currentScrollTop >= pageTop
        ? addAbsorption(pageLeft)
        : removeAbsorption();
    };

    // 初始化
    toggleAbsorption(currentScrollTop, pageTop);

    // 监听浏览器窗口滚动
    window.addEventListener(
      'scroll',
      debounce(function () {
        toggleAbsorption(
          window.pageYOffset || document.documentElement.scrollTop,
          pageTop
        );
      }, 0)
    );
  };

  // 初始化
  var init = function () {
    absorptionEffect($('.absorption-box'));
  };

  init();
})();
