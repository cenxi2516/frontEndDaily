/**
 * 检测元素水平方向上是否在视口内
 * @param {Element} element 检测的dom元素
 * @param {number} vwWidth 视口宽度
 * @returns 检测的元素水平方向是否在视口内，true：在，false：不在
 */
function judgeElementXDireInVW(element, vwWidth) {
  var clientRect = element.getBoundingClientRect();
  var right = clientRect.right;
  var left = clientRect.left;

  var rightIsVW = right > 0 && right <= vwWidth;
  var leftIsVw = left >= 0 && left < vwWidth;

  return rightIsVW && leftIsVw;
}

/**
 * 检测元素垂直方向上是否在视口内
 * @param {Element} element 检测的dom元素
 * @param {number} vwHeight 视口的高度
 * @returns 检测的dom元素垂直方向上是否在视口内，true：在，false：不在
 */
function judgeElementYDireInVW(element, vwHeight) {
  var clientRect = element.getBoundingClientRect();
  var top = clientRect.top;
  var bottom = clientRect.bottom;

  var topIsInVW = top >= 0 && top < vwHeight;
  var bottomIsVW = bottom > 0 && bottom <= vwHeight;

  return topIsInVW && bottomIsVW;
}

/**
 * 检测元素是否在视口内
 * @param {Element} element 要检测的dom元素
 * @param {number} vwWidth 视口宽度
 * @param {number} vwHeight 视口高度
 * @returns 检测的元素是否在视口内，true：在，false：不在
 */
function judgeElementInVW(element, vwWidth, vwHeight) {
  var clientRect = element.getBoundingClientRect();
  var top = clientRect.top;
  var right = clientRect.right;
  var bottom = clientRect.bottom;
  var left = clientRect.left;

  var topIsInVW = top >= 0 && top < vwHeight;
  var rightIsVW = right > 0 && right <= vwWidth;
  var bottomIsVW = bottom > 0 && bottom <= vwHeight;
  var leftIsVw = left >= 0 && left < vwWidth;

  return topIsInVW && rightIsVW && bottomIsVW && leftIsVw;
}
