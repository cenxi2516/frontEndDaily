(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 格式化日期时间
   * @param {Date} date Date对象
   * @param {string} formatStr 格式化日期字符串
   * @returns 格式化后的日期时间
   */
  var formatDateTime = function (
    date,
    formatStr = 'YYYY-MM-DD dd HH:mm:ss.SSS'
  ) {
    var weekTextArr = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ];
    var dateTime = {
      YYYY: date.getFullYear(),
      MM: date.getMonth() + 1,
      DD: date.getDate(),
      dd: weekTextArr[date.getDay()],
      HH: date.getHours(),
      mm: date.getMinutes(),
      ss: date.getSeconds(),
      SSS: date.getMilliseconds(),
    };

    return formatStr.replace(/(?:YYYY|MM|DD|dd|HH|mm|ss|SSS)/g, function ($) {
      return String(dateTime[$]).padStart($.length, '0');
    });
  };

  /**
   * 文本时钟
   * @param {Element} showContainer 日期时间显示的dom容器
   */
  var textClock = function (showContainer) {
    var updateRealDateTime = function () {
      showContainer.innerText = formatDateTime(
        new Date(),
        'YYYY-MM-DD HH:mm:ss'
      );
    };

    updateRealDateTime();
    setInterval(updateRealDateTime, 1000);
  };

  var init = function () {
    textClock($('.text-clock'));
  };
  init();
})();
