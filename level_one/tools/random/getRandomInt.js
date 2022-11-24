/**
 * 获取[min, max]间的随机整数
 * @param {number} min 最小整数值
 * @param {number} max 最大整数值
 * @returns [min,max]间的随机整数
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
