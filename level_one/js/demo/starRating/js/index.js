(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 函数防抖
   * @param {Function} fn 函数防抖
   * @param {number} delay 延迟的毫秒数
   * @param {boolean} immediate 是否立即执行
   * @returns 防抖函数
   */
  var debounce = function (fn, delay, immediate) {
    var timer = null;

    return function () {
      var context = this,
        args = arguments;

      timer && clearTimeout(timer);
      if (immediate) {
        var immediateExec = !timer;
        immediateExec && fn.apply(context, args);
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
   * 星星评分
   * @param {Element} ratingDom 星星评分容器
   * @param {Array} ratingDesc 评分描述
   */
  var starRating = function (ratingDom, ratingDesc) {
    var starRatingDom = ratingDom.children[0];
    var solidStarDom = starRatingDom.children[1];
    var ratingDescDom = ratingDom.children[1];
    var starRatingClient = starRatingDom.getBoundingClientRect();
    var starRatingClientLeft = starRatingClient.left;
    var starRatingWidth = starRatingClient.width;
    var ratingGrade = 0;
    var currentRatingGrade = 0;

    var setRatingGrade = function (ratingGrade) {
      solidStarDom.style.transform = `translateX(-${100 - ratingGrade * 20}%)`;
      ratingDescDom.innerText = ratingDesc[ratingGrade - 1] || '';
    };

    // 鼠标在starRatingDom移动
    starRatingDom.addEventListener(
      'mousemove',
      debounce(function (e) {
        currentRatingGrade = Math.ceil(
          (((e.clientX - starRatingClientLeft) / starRatingWidth) * 10) / 2
        );

        setRatingGrade(currentRatingGrade);
      }, 5)
    );

    // 鼠标在starRatingDom离开
    starRatingDom.addEventListener('mouseleave', function () {
      setRatingGrade(ratingGrade);
    });

    // 鼠标在starRatingDom点击
    starRatingDom.addEventListener('click', function (e) {
      ratingGrade = currentRatingGrade;
    });
  };

  var init = function () {
    var ratingDesc = ['满意', '一般满意', '还不错', '很满意', '非常满意'];
    starRating($('.star-rating-wrap'), ratingDesc);
  };
  init();
})();
