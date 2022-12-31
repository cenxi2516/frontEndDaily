/**
 * 延迟
 * @param {number} duration 延迟时间
 * @returns Promise对象
 */
const delay = (duration) =>
  new Promise((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
