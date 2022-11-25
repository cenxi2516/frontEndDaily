(function () {
  /**
   * 获取css选择器选中的第一个元素
   * @param  {string} selector css选择器
   * @param  {Element} element  Dom元素
   * @return {Element}          Dom元素
   */
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 函数防抖
   * @param {function} fn 要防抖的函数
   * @param {number} delay 延迟的毫秒数
   * @param {boolean} immediate 是否立即执行，默认非立即执行
   * @returns 经过防抖的函数
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

  var Ball = (function () {
    function Ball(option) {
      this.dom = option.dom;
      this.width = this.dom.offsetWidth;
      this.height = this.dom.offsetHeight;
      this.left = option.left || 200;
      this.top = option.top || 200;
      this.xSpeed = option.xSpeed || 10; // 水平方向初速度, 1s
      this.ySpeed = option.ySpeed || 10; // 垂直方向初速度, 1s
      this.translateX = 0; // 水平方向移动距离
      this.translateY = 0; // 垂直方向移动距离
      this.duration = 20; // 定时器频率
      this.timer = null; // 记录定时器标识

      this.init();
    }

    Ball.prototype = {
      init() {
        this.initParam();
        this.registerEvents();
        this.setPosition();
        this.startInterval();
      },
      initParam() {
        this.vwWidth =
          document.documentElement.clientWidth || document.body.clientWidth;
        this.vwHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        this.xMinMoveValue = -this.left;
        this.xMaxMoveValue = this.vwWidth - this.width - this.left;
        this.yMinMoveValue = -this.top;
        this.yMaxMoveValue = this.vwHeight - this.height - this.top;
      },
      setPosition() {
        this.dom.style.left = this.left + 'px';
        this.dom.style.top = this.top + 'px';
      },
      move() {
        this.dom.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
      },
      changeDirection(realXSpeed, realYSpeed) {
        var translateX = this.translateX,
          translateY = this.translateY;
        // top
        if (translateY <= this.yMinMoveValue) {
          realYSpeed = -realYSpeed;
          this.translateY = this.yMinMoveValue;
        }
        // right
        if (translateX >= this.xMaxMoveValue) {
          realXSpeed = -realXSpeed;
          this.translateX = this.xMaxMoveValue;
        }
        // bottom
        if (translateY >= this.yMaxMoveValue) {
          realYSpeed = -realYSpeed;
          this.translateY = this.yMaxMoveValue;
        }
        // left
        if (translateX <= this.xMinMoveValue) {
          realXSpeed = -realXSpeed;
          this.translateX = this.xMinMoveValue;
        }

        return {
          realXSpeed,
          realYSpeed,
        };
      },
      startInterval() {
        if (this.timer) return;

        var realXSpeed = (this.xSpeed / 1000) * this.duration;
        var realYSpeed = (this.ySpeed / 1000) * this.duration;

        this.timer = setInterval(
          function () {
            this.translateX += realXSpeed;
            this.translateY += realYSpeed;

            var realSpeedObj = this.changeDirection(realXSpeed, realYSpeed);

            realXSpeed = realSpeedObj.realXSpeed;
            realYSpeed = realSpeedObj.realYSpeed;

            this.move();
          }.bind(this),
          this.duration
        );
      },
      registerEvents() {
        // 窗口尺寸更改
        window.addEventListener('resize', debounce(this.initParam.bind(this)));
      },
    };

    return Ball;
  })();

  // 初始化
  var init = function () {
    var ball = new Ball({
      dom: $('.box'),
      left: 200,
      top: 200,
      xSpeed: 200,
      ySpeed: 300,
    });
  };
  init();
})();
