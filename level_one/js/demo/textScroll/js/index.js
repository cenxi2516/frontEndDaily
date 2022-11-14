(function () {
  // 数据
  var notices = (function () {
    return [
      '1. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos, repellat?',
      '2. Eveniet itaque voluptatibus quam animi nulla, odit architecto temporibus vero!',
      '3. A ipsam dolores minima exercitationem ullam. Consectetur corporis nisi distinctio.',
      '4. Aliquid quis at laborum? Fuga ab eveniet consequuntur qui deleniti.',
      '5. Similique sequi sint maxime expedita excepturi in quae iusto eius?',
    ];
  })();

  // 工具
  var tools = (function () {
    /**
     * 根据css选择器获取第一个dom对象
     * @param {string} selector css选择器
     * @param {Element} element dom对象
     * @returns dom对象
     */
    var $ = function (selector, element = document) {
      return element.querySelector(selector);
    };

    return {
      $,
    };
  })();

  // 业务
  var noticeVerticalScroll = (function () {
    var contentContainerDom = tools.$('.content');
    var timer = null;
    var curIndex = 0;
    var noticeNum = 0;
    var noticeContentHeight = 0;
    var onceChangeHeight = 0;
    // 在页面生成公告
    var generateNotices = function () {
      if (!notices.length) return;
      var generateOneNotice = function (noticeContent) {
        return `<li>${noticeContent}</li>`;
      };
      notices.push(notices[0]);
      var noticesHTMLs = notices.reduce(function (noticesHTMLs, notice) {
        noticesHTMLs.push(generateOneNotice(notice));
        return noticesHTMLs;
      }, []);
      contentContainerDom.innerHTML = noticesHTMLs.join('');
    };

    // 每间隔duration切换一次公告
    var autoVerticalScroll = function (duration = 2000) {
      noticeNum = notices.length;
      noticeContentHeight = contentContainerDom.offsetHeight;
      onceChangeHeight = noticeContentHeight / noticeNum;
      var innerTimer = null;
      var totalDuration = 500;
      var onceDuration = 10;
      var times = totalDuration / onceDuration;

      var scrollFromTo = function () {
        curIndex = ++curIndex % noticeNum;
        var startPos = (curIndex - 1) * onceChangeHeight;
        var endPos = curIndex * onceChangeHeight;
        var curPos = startPos;
        var stepLen = (endPos - startPos) / times;

        innerTimer && clearInterval(innerTimer);
        innerTimer = setInterval(function () {
          curPos += stepLen;
          if (curPos >= endPos) {
            curPos = endPos;
            clearInterval(innerTimer);
            innerTimer = null;
            if (curIndex === noticeNum - 1) {
              curPos = 0;
              curIndex = 0;
            }
          }
          contentContainerDom.style.transform = `translateY(-${curPos}px)`;
        }, onceDuration);
      };

      return function () {
        timer && clearInterval(timer);
        timer = setInterval(scrollFromTo, duration);
      };
    };

    // 开始自动播放公告
    var start = function () {
      autoVerticalScroll()();
    };

    // 暂停自动播放公告
    var stop = function () {
      clearInterval(timer);
      timer = null;
    };

    // 初始化
    var init = function () {
      generateNotices();
    };

    return {
      init,
      start,
      stop,
    };
  })();

  // 注册事件
  var registerEvents = function () {
    // 当页面加载完
    window.addEventListener('load', function () {
      noticeVerticalScroll.start();
    });

    // Tab显示或隐藏切换
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        // Tab 显示
        noticeVerticalScroll.start();
      } else {
        // Tab 隐藏
        noticeVerticalScroll.stop();
      }
    });
  };

  // 初始化
  var init = function () {
    noticeVerticalScroll.init();
    registerEvents();
  };
  init();
})();
