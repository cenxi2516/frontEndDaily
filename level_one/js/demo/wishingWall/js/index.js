(function () {
  /**
   * 根据css选择器获取查询的第一个dom元素
   * @param {string} selector css选择器
   * @param {Element} element dom元素
   * @returns 查询的dom元素
   */
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 函数防抖
   * @param {function} fn 要防抖的函数
   * @param {number} delay 延迟的毫秒数
   * @param {boolean} immediate 是否立即执行函数
   * @returns 防抖处理的函数
   */
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
   * 获取[min,max]间的随机整数
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns [min,max]间的随机整数
   */
  var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  /**
   * 随机获取[min,max]间的十六进制字符串
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns 十六进制字符串
   */
  var randomHexColor = function (min = 0x000000, max = 0xffffff) {
    return `#${randomInt(min, max).toString(16)}`;
  };

  var wishWallInputDom = $('#wish-wall-input');
  var wishWallBoardDom = $('.wish-wall-board');
  var wishWallBoardClientWidth = wishWallBoardDom.clientWidth;
  var wishWallBoardClientHeight = wishWallBoardDom.clientHeight;
  var paperMetaArr = [
    {
      width: 170,
      height: 170,
      left: 100,
      top: 120,
      bgColor: '#0f0f0f',
      content: 'Hi，请添加你的愿望哦！',
      zIndex: 0,
    },
  ];

  /**
   * 获取所有paper中最大zIndex值
   * @returns 最大zIndex
   */
  var getMaxZIndex = function () {
    var zIndexArr = paperMetaArr.map(function (paperMeta) {
      return paperMeta.zIndex;
    });
    var maxZIndex = Math.max.apply(null, zIndexArr);

    return maxZIndex === -Infinity ? -1 : maxZIndex;
  };

  /**
   * paper拖拽移动
   * @param {object} paperMeta paper元信息
   */
  var mouseDragBox = function (paperMeta) {
    var paperDom = paperMeta.dom;
    // 记录拖拽按下时鼠标位置
    var startClientX = 0;
    var startClientY = 0;
    // 记录移动值
    var translateX = 0;
    var translateY = 0;

    // paper移动
    var paperTranslate = function (x, y) {
      // 移动范围
      var translateXMin = -paperMeta.left;
      var translateYMin = -paperMeta.top;
      var translateXMax =
        wishWallBoardClientWidth - paperMeta.left - paperMeta.width;
      var translateYMax =
        wishWallBoardClientHeight - paperMeta.top - paperMeta.height;
      // 水平方向
      x = x < translateXMin ? translateXMin : x;
      x = x > translateXMax ? translateXMax : x;
      // 垂直方向
      y = y < translateYMin ? translateYMin : y;
      y = y > translateYMax ? translateYMax : y;

      translateX = x;
      translateY = y;
      paperDom.style.transform = `translate(${x}px, ${y}px)`;
    };

    // 拖拽进行中
    var dragDoing = function (e) {
      var moveClientX = e.clientX;
      var moveClientY = e.clientY;
      paperTranslate(moveClientX - startClientX, moveClientY - startClientY);
    };

    // 取消拖拽
    var dragCancel = function () {
      this.removeEventListener('mousemove', dragDoing);

      var left = (paperMeta.left = translateX + paperMeta.left);
      var top = (paperMeta.top = translateY + paperMeta.top);

      paperDom.style.left = left + 'px';
      paperDom.style.top = top + 'px';

      paperTranslate(0, 0);
    };

    // 鼠标按下：开始拖拽
    paperDom.addEventListener('mousedown', function (e) {
      var zIndex = getMaxZIndex() + 1;
      paperMeta.zIndex = zIndex;
      paperDom.style.zIndex = zIndex;

      startClientX = e.clientX;
      startClientY = e.clientY;
      // 鼠标移动：进行拖拽
      document.addEventListener('mousemove', dragDoing);
      // 鼠标弹起：取消拖拽
      document.addEventListener('mouseup', dragCancel, { once: true });
    });
  };

  /**
   * 根据paper元信息，创建一个paper元素
   * @param {object} paperMeta paper元信息
   * @returns paper元素
   */
  var createPaperDom = function (paperMeta) {
    var paperWidth = paperMeta.width;
    var paperHeight = paperMeta.height;
    var left = paperMeta.left;
    var top = paperMeta.top;
    var bgColor = paperMeta.bgColor;
    var zIndex = paperMeta.zIndex;
    var content = paperMeta.content;

    var paperDom = document.createElement('div');
    paperDom.className = 'paper';

    paperDom.style.left = left + 'px';
    paperDom.style.top = top + 'px';
    paperDom.style.width = paperWidth + 'px';
    paperDom.style.height = paperHeight + 'px';
    paperDom.style.backgroundColor = bgColor;
    paperDom.style.zIndex = zIndex;

    paperDom.innerHTML = `
      <p class="paper-content">${content}</p>
      <i class="close-btn" data-del-btn="true">x</i>
    `;

    paperMeta.dom = paperDom;

    return paperDom;
  };

  /**
   * 创建一个paper
   * @param {string} content 愿望内容
   * @param {number} containerWidth 容器宽度
   * @param {number} containerHeight 容器高度
   * @param {number} paperWidth paper宽度
   * @param {number} paperHeight paper高度
   * @returns paper元素
   */
  var generatePaper = function (
    content,
    containerWidth,
    containerHeight,
    paperWidth = 170,
    paperHeight = 170
  ) {
    var paperMeta = {
      width: paperWidth,
      height: paperHeight,
      left: randomInt(0, containerWidth - paperWidth),
      top: randomInt(0, containerHeight - paperHeight),
      bgColor: randomHexColor(undefined, 0xffffff - 1),
      content,
      zIndex: getMaxZIndex() + 1,
    };

    var paperDom = createPaperDom(paperMeta);

    paperMetaArr.push(paperMeta);
    mouseDragBox(paperMeta);

    return paperDom;
  };

  /**
   * 删除一个paper元素
   * @param {Element} paperDom dom元素
   */
  var removePaper = function (paperDom) {
    var index = paperMetaArr.findIndex(function (paperMeta) {
      return paperMeta.dom === paperDom;
    });

    if (index > -1) {
      paperMetaArr.splice(index, 1);
      paperDom.remove();
    }
  };

  /**
   * 更新paper元素位置
   * @param {object} paperMeta paper元信息对象
   */
  var paperPosChange = function (paperMeta) {
    var paperDom = paperMeta.dom;

    paperDom.style.left = paperMeta.left + 'px';
    paperDom.style.top = paperMeta.top + 'px';
  };

  /**
   * 更新所有paper元信息和paper元素位置
   * @param {number} hChangeRate 前后宽度变化比率
   * @param {number} vChangeRate 前后高度变化比率
   */
  var updateAllPaperMetaAndPos = function (hChangeRate, vChangeRate) {
    paperMetaArr.forEach(function (paperMeta) {
      // 水平、垂直方向最大偏移量
      var maxLeft = wishWallBoardClientWidth - paperMeta.width;
      var maxTop = wishWallBoardClientHeight - paperMeta.height;

      var left = paperMeta.left * hChangeRate;
      var top = paperMeta.top * vChangeRate;

      left = left < 0 ? 0 : left;
      left = left > maxLeft ? maxLeft : left;
      top = top < 0 ? 0 : top;
      top = top > maxTop ? maxTop : top;

      paperMeta.left = left;
      paperMeta.top = top;

      paperPosChange(paperMeta);
    });
  };

  // 初始化所有的paper
  var initWishWallBoardPaper = function () {
    paperMetaArr.forEach(function (paperMeta) {
      wishWallBoardDom.appendChild(createPaperDom(paperMeta));
    });
  };

  // 注册事件
  var registerEvents = function () {
    // 监听Enter按键
    window.addEventListener(
      'keydown',
      debounce(function (e) {
        if (e.key === 'Enter' && wishWallInputDom.value.trim()) {
          wishWallBoardDom.appendChild(
            generatePaper(
              wishWallInputDom.value.trim(),
              wishWallBoardClientWidth,
              wishWallBoardClientHeight
            )
          );

          wishWallInputDom.value = '';
        }
      })
    );

    // 监听点击删除paper按钮
    wishWallBoardDom.addEventListener('click', function (e) {
      var targetDom = e.target;
      if (targetDom.dataset.delBtn === 'true') {
        removePaper(targetDom.parentNode);
      }
    });

    // 监听窗口尺寸改变
    window.addEventListener(
      'resize',
      debounce(function () {
        // 当前容器尺寸
        var currentWishWallBoardClientWidth = wishWallBoardDom.clientWidth;
        var currentWishWallBoardClientHeight = wishWallBoardDom.clientHeight;
        // 水平、垂直方向变化值
        var hChangeRate =
          currentWishWallBoardClientWidth / wishWallBoardClientWidth;
        var vChangeRate =
          currentWishWallBoardClientHeight / wishWallBoardClientHeight;
        // 更新容器尺寸
        wishWallBoardClientWidth = currentWishWallBoardClientWidth;
        wishWallBoardClientHeight = currentWishWallBoardClientHeight;

        updateAllPaperMetaAndPos(hChangeRate, vChangeRate);
      })
    );
  };

  // 初始化
  var init = function () {
    initWishWallBoardPaper();
    registerEvents();
  };
  init();
})();
