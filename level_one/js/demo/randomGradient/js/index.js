(() => {
  const BlockSize = 10;
  const ColNum = 100;
  const RowNum = 100;

  /**
   * 简化通过css选择器获取第一个元素的方法
   * @param {string} selector css选择器
   * @param {Element} element Dom元素
   * @returns Dom元素
   */
  const $ = (selector, element = document) => element.querySelector(selector);

  /**
   * 获取[min, max]间的随机整数
   * @param {number} min 最小数
   * @param {number} max 最大数
   * @returns 最小数与最大数间的随机整数
   */
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  /**
   * 生成指定尺寸且随机颜色的方块
   * @param {string} rgbColor rgb颜色值
   * @param {number} size 方块尺寸
   * @returns 方块HTML内容
   */
  const generateHasColorBlock = (rgbColor, size) =>
    `<div style="background-color: ${rgbColor}; width: ${size}px; height: ${size}px"></div>`;

  const createAllBlock = (wrapDom, rowNum, colNum) => {
    const blockArr = [];
    // 颜色值1
    const R1 = randomInt(0, 128);
    const G1 = randomInt(0, 255);
    const B1 = randomInt(0, 255);

    // 颜色值2
    const R2 = randomInt(129, 255);
    const G2 = randomInt(0, 255);
    const B2 = randomInt(0, 255);

    // 每行色值变化量
    const getOnceChangeValue = (One, Two) => Math.floor((Two - One) / rowNum);
    const ROnceChange = getOnceChangeValue(R1, R2);
    const GOnceChange = getOnceChangeValue(G1, G2);
    const BOnceChange = getOnceChangeValue(B1, B2);

    let RValue = R1;
    let GValue = G1;
    let BValue = B1;

    for (let i = 1; i <= rowNum; i++) {
      RValue += ROnceChange;
      GValue += GOnceChange;
      BValue += BOnceChange;
      for (let j = 1; j <= colNum; j++) {
        blockArr.push(
          generateHasColorBlock(
            `rgb(${RValue}, ${GValue}, ${BValue})`,
            BlockSize
          )
        );
      }
    }

    wrapDom.innerHTML = blockArr.join('');
  };

  createAllBlock($('.wrap'), RowNum, ColNum);
})();
