/**
 * 格式化日期时间
 * @param {Date} date Date对象
 * @param {string} dateFormatStr 日期时间格式
 * @returns 日期时间
 */
function format(date, dateFormatStr) {
  var weeks = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  var dateTime = {
    YYYY: date.getFullYear(), // 年，例如：2022
    MM: date.getMonth() + 1, // 月，例如：12
    DD: date.getDate(), // 日，例如：22
    dd: weeks[date.getDay()], // 星期，例如：星期四
    HH: date.getHours(), // 时，例如：23
    mm: date.getMinutes(), // 分，例如：56
    ss: date.getSeconds(), // 秒，例如：02
    SSS: date.getMilliseconds(), // 毫秒，例如：024
  };

  return dateFormatStr.replace(/(?:YYYY|MM|DD|dd|HH|mm|ss|SSS)/g, function ($) {
    return dateTime[$];
  });
}
