/**
 * 获取[min,max]间随机十六进制颜色值
 * @param {number} min 十六进制最小值
 * @param {number} max 十六进制最大值
 * @returns [min,max]间十六进制颜色值
 */
function getRandomHexColor(min = 0x000000, max = 0xffffff) {
  return `#${Math.floor(Math.random() * (max - min + 1) + min).toString(16)}`;
}
