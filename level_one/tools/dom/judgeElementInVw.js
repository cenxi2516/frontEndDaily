/**
 * 检测元素是否在视口内
 * @param {Element} element dom元素
 * @param {number} vwWidth 视口宽度
 * @param {number} vwHeight 视口高度
 * @returns 元素是否在视口范围内
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
