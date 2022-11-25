(function () {
  /**
   * 根据css选择器，选中第一个dom元素
   * @param {string} selector css选择器
   * @param {Element} element 在某dom元素下检索元素
   * @returns 选中的第一个dom元素
   */
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 函数防抖
   * @param {function} fn 要防抖的函数
   * @param {number} delay 延迟毫秒数，默认延迟200ms
   * @param {boolean} immediate 是否立即执行函数再延迟，默认非立即执行
   * @returns 防抖后的函数
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

  var seamlessCarousel = function (config) {
    var carouselContainerDom = config.carouselContainerDom;
    var carouselImages = config.carouselImages;
    var carouselWidth = config.carouselWidth || 520;
    var carouselHeight = config.carouselHeight || 280;
    var duration = config.duration || 2000;
    var finishAnimationTime = config.finishAnimationTime || 500;
    var curIndex = config.curIndex || 0;

    // 获取dom元素
    var carouselListDom = carouselContainerDom.children[0];
    var carouselBtnContainerDom = carouselContainerDom.children[1];
    var leftBtnDom = carouselBtnContainerDom.children[0];
    var rightBtnDom = carouselBtnContainerDom.children[1];
    var carouselDotContainerDom = carouselContainerDom.children[2];

    // 轮播数据
    var newCarouselImages = Array.from(carouselImages);
    var carouselImageNum = carouselImages.length;
    var curActiveDotDom = null;
    var durationTimer = null;
    var finishAnimationTimer = null;

    // 初始化轮播容器
    var initCarouselContainer = function () {
      carouselContainerDom.style.width = carouselWidth + 'px';
      carouselContainerDom.style.height = carouselHeight + 'px';
      carouselListDom.style.width =
        carouselWidth * (carouselImageNum + 1) + 'px';
    };

    // 根据轮播图片数量生成小圆点
    var generateDots = function () {
      if (!carouselImageNum) return;

      var createDotItem = function (index) {
        return `<span class="carousel-dot-item${
          index === curIndex ? ' active' : ''
        }" data-index="${index}"></span>`;
      };

      var dotHTMLArr = newCarouselImages.reduce(function (
        dotHTMLArr,
        _,
        index
      ) {
        dotHTMLArr.push(createDotItem(index));
        return dotHTMLArr;
      },
      []);

      carouselDotContainerDom.innerHTML = dotHTMLArr.join('');
      curActiveDotDom = carouselDotContainerDom.children[curIndex];
    };

    // 根据轮播图片生成轮播项
    var generateCarouselImages = function () {
      if (!carouselImageNum) return;

      var createCarouselImage = function (href, imgUrl, index) {
        return `<a href="${href}" style="width: ${carouselWidth}px" class="carousel-list-item"><img src="${imgUrl}" alt=""></a>`;
      };

      newCarouselImages.push(newCarouselImages[0]);

      var carouselImageHTMLArr = newCarouselImages.reduce(function (
        carouselImageHTMLArr,
        item,
        index
      ) {
        carouselImageHTMLArr.push(
          createCarouselImage(item.href, item.imgUrl, index)
        );

        return carouselImageHTMLArr;
      },
      []);

      carouselListDom.innerHTML = carouselImageHTMLArr.join('');
      carouselListMove(-curIndex * carouselWidth);
    };

    // 显示左右点击按钮
    var showLeftAndRightBtn = function () {
      leftBtnDom.style.visibility = 'visible';
      rightBtnDom.style.visibility = 'visible';
    };

    // 隐藏左右点击按钮
    var hideLeftAndRightBtn = function () {
      leftBtnDom.style.visibility = '';
      rightBtnDom.style.visibility = '';
    };

    // 轮播动画
    var carouselAnimation = function (startValue, targetValue, callback) {
      if (finishAnimationTimer) return;

      var duration = 20;
      var finishAnimationTimeTimes =
        Math.abs(targetValue - startValue) / carouselWidth;
      var times = Math.ceil(
        (finishAnimationTime * finishAnimationTimeTimes) / duration
      );
      var onceStepLen = (targetValue - startValue) / times;
      var curValue = startValue;

      finishAnimationTimer = setInterval(function () {
        curValue += onceStepLen;

        if (Math.abs(targetValue - curValue) < Math.abs(onceStepLen)) {
          clearInterval(finishAnimationTimer);
          finishAnimationTimer = null;
          curValue = targetValue;
        }

        callback(curValue, !finishAnimationTimer);
      }, duration);
    };

    // 轮播图移动到指定位置
    var carouselListMove = function (curValue) {
      carouselListDom.style.transform = `translateX(${curValue}px)`;
    };

    // 设置激活的小圆点状态变化
    var setActiveDotStatus = function () {
      var statusClassName = 'active';
      var activeDotDom = carouselDotContainerDom.children[curIndex];

      curActiveDotDom.classList.remove(statusClassName);
      activeDotDom.classList.add(statusClassName);
      curActiveDotDom = activeDotDom;
    };

    // 轮播图向左移动
    var carouselListLeftMove = function () {
      if (finishAnimationTimer) return;

      curIndex = ++curIndex % (carouselImageNum + 1);

      var targetValue = -carouselWidth * curIndex;
      var startValue = -carouselWidth * (curIndex - 1);
      var curRealIndex = curIndex;

      curIndex = curIndex === carouselImageNum ? 0 : curIndex;

      setActiveDotStatus();
      carouselAnimation(
        startValue,
        targetValue,
        function (curValue, animationEnd) {
          carouselListMove(curValue);
          animationEnd &&
            curRealIndex === carouselImageNum &&
            carouselListMove(0);
        }
      );
    };

    // 轮播图向右移动
    var carouselListRightMove = function () {
      if (finishAnimationTimer) return;

      if (curIndex === 0) {
        carouselListMove(-carouselImageNum * carouselWidth);
        curIndex = carouselImageNum;
      }

      curIndex = --curIndex % (carouselImageNum + 1);

      var targetValue = -carouselWidth * curIndex;
      var startValue = -carouselWidth * (curIndex + 1);

      setActiveDotStatus();
      carouselAnimation(startValue, targetValue, carouselListMove);
    };

    // 点击小圆点轮播图移动
    var clickDotCarouselListMove = function (targetIndex) {
      if (targetIndex === curIndex) return;

      var curValue = -carouselWidth * curIndex;
      var targetValue = -carouselWidth * targetIndex;
      curIndex = targetIndex;

      setActiveDotStatus();
      carouselAnimation(curValue, targetValue, carouselListMove);
    };

    // 自动轮播
    var autoCarousel = function () {
      if (durationTimer) return;

      var leftBtnEvent = new MouseEvent('click', {
        bubbles: false,
        cancelable: true,
      });

      durationTimer = setInterval(function () {
        leftBtnDom.dispatchEvent(leftBtnEvent);
      }, duration);
    };

    // 清除自动轮播
    var clearAutoCarousel = function () {
      if (!durationTimer) return;

      clearInterval(durationTimer);
      durationTimer = null;
    };

    // 注册事件
    var registerEvents = function () {
      // 鼠标移入移出轮播容器事件
      carouselContainerDom.addEventListener('mouseenter', function () {
        showLeftAndRightBtn();
        clearAutoCarousel();
      });
      carouselContainerDom.addEventListener('mouseleave', function () {
        hideLeftAndRightBtn();
        autoCarousel();
      });
      // 左右按钮点击事件
      leftBtnDom.addEventListener('click', debounce(carouselListLeftMove));
      rightBtnDom.addEventListener('click', debounce(carouselListRightMove));
      // 小圆点点击事件：事件委托
      carouselDotContainerDom.addEventListener('click', function (e) {
        var targetDom = e.target;
        var dotMarkClassName = 'carousel-dot-item';

        targetDom.classList.contains(dotMarkClassName) &&
          clickDotCarouselListMove(+targetDom.dataset.index);
      });
      // 页面隐藏(浏览器最小化、计算机锁屏、切换Tab页)
      document.addEventListener('visibilitychange', function () {
        this.visibilityState === 'hidden'
          ? clearAutoCarousel()
          : autoCarousel();
      });
    };

    // 初始化
    var init = function () {
      initCarouselContainer();
      generateDots();
      generateCarouselImages();
      registerEvents();
      autoCarousel();
    };
    init();
  };

  // 初始化
  var init = function () {
    var carouselImages = [
      {
        imgUrl: './images/1.jpg',
        href: '',
      },
      {
        imgUrl: './images/2.webp',
        href: '',
      },
      {
        imgUrl: './images/3.jpg',
        href: '',
      },
      {
        imgUrl: './images/4.jpg',
        href: '',
      },
      {
        imgUrl: './images/5.webp',
        href: '',
      },
    ];
    var carouselContainerDom = $('.seamless-carousel-wrap');
    seamlessCarousel({
      carouselContainerDom,
      carouselImages,
    });
  };
  init();
})();