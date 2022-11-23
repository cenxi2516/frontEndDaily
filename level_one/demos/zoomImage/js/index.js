(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 放大镜
   * @param {Element} zoomDom 放大镜容器
   * @param {string} normalImageSrc 正常图片地址
   * @param {string} zoomImageSrc 大图地址
   */
  var zoomImage = function (zoomDom, normalImageSrc, zoomImageSrc) {
    // 获取dom元素
    var normalImageDom = zoomDom.children[0];
    var normalImageImgDom = normalImageDom.children[0];
    var zoomBarDom = normalImageDom.children[1];
    var zoomImageDom = zoomDom.children[1];

    // 获取dom元素尺寸
    var normalImageWidth = normalImageDom.clientWidth;
    var normalImageHeight = normalImageDom.clientHeight;
    var zoomImageWidth = zoomImageDom.clientWidth;
    var zoomImageHeight = zoomImageDom.clientHeight;

    // 获取dom元素位置
    var zoomDomClientData = zoomDom.getBoundingClientRect();
    var zoomDomLeft = zoomDomClientData.left;
    var zoomDomTop = zoomDomClientData.top;

    // 显示zoomImage、zoomBar
    var showZoomImageAndBar = function () {
      zoomImageDom.style.visibility = 'visible';
      zoomBarDom.style.visibility = 'visible';
    };

    // 隐藏zoomImage、zoomBar
    var hideZoomImageAndBar = function () {
      zoomImageDom.style.visibility = 'hidden';
      zoomBarDom.style.visibility = 'hidden';
    };

    // zoomBar移动
    var zoomBarMove = function (x, y) {
      zoomBarDom.style.transform = `translate(${x}px, ${y}px)`;
    };

    // zoomImage背景图移动
    var zoomImageBgImgMove = function (translateX, translateY) {
      zoomImageDom.style.backgroundPosition = `${translateX}px ${translateY}px`;
    };

    // 初始化正常大小图片
    normalImageImgDom.src = normalImageSrc;

    // 初始化放大镜
    var initZoomImage = function (zoomBarWidth, zoomBarHeight) {
      // 初始化zoomBar宽度和高度
      zoomBarDom.style.width = zoomBarWidth + 'px';
      zoomBarDom.style.height = zoomBarHeight + 'px';
      // 设置zoomImage背景
      zoomImageDom.style.backgroundImage = `url(${zoomImageSrc})`;
    };

    // 实现图片放大镜
    var zoomImageImpl = function (
      zoomBarWidth,
      zoomBarHeight,
      zoomImgWidth,
      zoomImgHeight
    ) {
      // zoomBar相对于offsetParent坐标
      var startLeft = zoomBarDom.offsetLeft;
      var startTop = zoomBarDom.offsetTop;
      // zoomBar在normalImage中能移动的最大值
      var zoomBarMaxMoveX = normalImageWidth - startLeft - zoomBarWidth;
      var zoomBarMaxMoveY = normalImageHeight - startTop - zoomBarHeight;
      // zoomBar、zoomImage背景图能移动的最大水平、垂直距离
      var zoomBgImgCanMoveX = zoomImgWidth - zoomImageWidth;
      var zoomBgImgCanMoveY = zoomImgHeight - zoomImageHeight;
      var zoomBarCanMoveX = normalImageWidth - zoomBarWidth;
      var zoomBarCanMoveY = normalImageHeight - zoomBarHeight;

      normalImageDom.addEventListener('mouseenter', function () {
        // 显示zoomBar、zoomImage
        showZoomImageAndBar();
      });

      normalImageDom.addEventListener('mouseleave', function () {
        // 隐藏zoomBar、zoomImage
        hideZoomImageAndBar();
      });

      normalImageDom.addEventListener('mousemove', function (e) {
        // zoomBar跟随鼠标移动
        var zoomBarTranslateX = e.clientX - zoomDomLeft - zoomBarWidth / 2;
        var zoomBarTranslateY = e.clientY - zoomDomTop - zoomBarHeight / 2;

        // zoomBar水平方向可移动距离
        zoomBarTranslateX =
          zoomBarTranslateX < -startLeft ? -startLeft : zoomBarTranslateX;
        zoomBarTranslateX =
          zoomBarTranslateX > zoomBarMaxMoveX
            ? zoomBarMaxMoveX
            : zoomBarTranslateX;

        // zoomBar垂直方向可移动距离
        zoomBarTranslateY =
          zoomBarTranslateY < -startTop ? -startTop : zoomBarTranslateY;
        zoomBarTranslateY =
          zoomBarTranslateY > zoomBarMaxMoveY
            ? zoomBarMaxMoveY
            : zoomBarTranslateY;

        // zoomImage背景图片移动距离
        var zoomImageBgImgTranslateX =
          -(zoomBgImgCanMoveX / zoomBarCanMoveX) * zoomBarTranslateX;
        var zoomImageBgImgTranslateY =
          -(zoomBgImgCanMoveY / zoomBarCanMoveY) * zoomBarTranslateY;

        zoomBarMove(zoomBarTranslateX, zoomBarTranslateY);
        zoomImageBgImgMove(zoomImageBgImgTranslateX, zoomImageBgImgTranslateY);
      });
    };

    var zoomImg = new Image();
    zoomImg.src = zoomImageSrc;
    zoomImg.addEventListener('load', function () {
      var zoomImgWidth = zoomImg.width;
      var zoomImgHeight = zoomImg.height;
      var zoomBarWidth = (zoomImageWidth / zoomImgWidth) * normalImageWidth;
      var zoomBarHeight = (zoomImageHeight / zoomImgHeight) * normalImageHeight;

      initZoomImage(zoomBarWidth, zoomBarHeight);
      zoomImageImpl(zoomBarWidth, zoomBarHeight, zoomImgWidth, zoomImgHeight);
    });
  };

  var init = function () {
    var normalImageSrc = './images/mouse.jpg';
    var zoomImageSrc = './images/mouseBigSize.jpg';
    zoomImage($('.zoom-image-wrap'), normalImageSrc, zoomImageSrc);
  };

  init();
})();
