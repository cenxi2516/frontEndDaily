/**
 * 获取dom元素在页面的位置
 * @param {Element} element dom元素
 * @returns dom元素在整个页面的位置
 */
function getElementPositionInPage(element) {
  var parentOffset = element.offsetParent;
  var left = 0,
    top = 0;

  while (parentOffset) {
    left +=
      element.offsetLeft +
      parseFloat(getComputedStyle(parentOffset).borderLeftWidth);
    top +=
      element.offsetTop +
      parseFloat(getComputedStyle(parentOffset).borderTopWidth);

    element = parentOffset;
    parentOffset = parentOffset.offsetParent;
  }

  return { left, top };
}
