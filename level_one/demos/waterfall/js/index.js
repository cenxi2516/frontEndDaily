((myPlugin) => {
  // 默认配置
  const defaultConfig = {
    container: document.body,
    data: [],
    imageWidth: 220,
    minHGap: 10,
    vGap: 20,
  };
  // 最终配置
  const finallyConfig = {};
  // 容器尺寸和每行列数、水平间距
  const waterfallInfo = {
    containerWidth: 0,
    containerHeight: 0,
    isInit: true, // 是否初始化中
    hGap: 0, // 水平间隙
    vGap: 0, // 垂直间隙
    columnCount: 0, // 每行列数
    allImageData: [], // 所有图片数据：dom、width、height、top、left
    columnHeights: [], // 记录每一列高度
  };

  // 函数防抖
  const debounce = (fn, delay = 200, immediate = false) => {
    let timer = null;

    return function (...argsList) {
      timer && clearTimeout(timer);
      if (immediate) {
        const isImmediateExec = !timer;
        isImmediateExec && fn.apply(this, argsList);
        timer = setTimeout(() => {
          timer = null;
        }, delay);
      } else {
        timer = setTimeout(() => {
          fn.apply(this, argsList);
          timer = null;
        }, delay);
      }
    };
  };

  // 初始化父容器
  const initContainer = () => {
    // 检测父容器是否定位
    const { container } = finallyConfig;
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
  };
  // 初始化容器尺寸、每行列数、水平间距
  const initWaterfallInfo = () => {
    const { container, imageWidth, minHGap, vGap } = finallyConfig;
    const containerWidth = container.clientWidth;
    const columnCount = Math.floor(
      (containerWidth + minHGap) / (imageWidth + minHGap)
    ); // columnCount*imageWidth + (columnCount -1)*minHGap = containerWidth
    const hGap =
      (containerWidth - imageWidth * columnCount) / (columnCount - 1);
    const columnHeights = new Array(columnCount).fill(0);

    Object.assign(waterfallInfo, {
      containerWidth,
      columnCount,
      hGap,
      vGap,
      columnHeights,
    });
  };
  // 计算每张图片位置，并设置
  const setImagePosition = (() => {
    // 获取列中最小高度值和对应的索引
    const getMinHeightAndIndex = () => {
      const { columnHeights } = waterfallInfo;
      const minHeight = Math.min.apply(Math, columnHeights);
      const index = columnHeights.findIndex((height) => height === minHeight);

      return { minHeight, index };
    };

    return (imgInfo, callback) => {
      const { imgDom, imageWidth, imageHeight } = imgInfo;
      const { hGap, vGap, columnHeights } = waterfallInfo;
      const { minHeight, index } = getMinHeightAndIndex();
      const top = minHeight;
      const left = (imageWidth + hGap) * index;
      // 更新数据
      columnHeights[index] += imageHeight + vGap;
      imgInfo.left = left;
      imgInfo.top = top;
      // 更新样式
      imgDom.style.left = left + 'px';
      imgDom.style.top = top + 'px';
      // 更新容器高度
      callback?.();
    };
  })();
  // 改变瀑布流布局
  const changeWaterfallLayout = (callback) => {
    initWaterfallInfo();
    waterfallInfo.allImageData.forEach((imgInfo) => {
      setImagePosition(imgInfo, setContainerHeight);
      callback?.(imgInfo);
    });
  };
  // 设置容器高度
  const setContainerHeight = debounce(() => {
    const { columnHeights, vGap, isInit, allImageData } = waterfallInfo;
    const { container, data } = finallyConfig;

    const maxHeight = Math.max.apply(Math, columnHeights) - vGap;
    waterfallInfo.containerHeight = maxHeight;
    container.style.height = maxHeight + 'px';

    if (data.length === allImageData.length && isInit) {
      // 当所有图片加载完，将所有图片添加到容器中，解决出现滚动条后：容器宽度前后不一致(当容器宽度为百分比时)
      waterfallInfo.isInit = false;
      changeWaterfallLayout(({ imgDom }) => container.appendChild(imgDom));
    }
  });
  // 初始化所有图片
  const initAllImageItem = (() => {
    // 创建一张图片
    const createImageItem = (() => {
      // 初始化图片数据
      const initImageData = function (callback) {
        const { width, height } = this;
        const { imageWidth, container } = finallyConfig;
        const imageHeight = (height / width) * imageWidth; // height / width = imageHeight / imageWidth
        const imgInfo = {
          imgDom: this,
          imageWidth,
          imageHeight,
          top: 0,
          left: 0,
        };

        this.width = imageWidth;
        this.height = imageHeight;
        this.style.position = 'absolute';
        this.style.transition = '0.5s';

        waterfallInfo.allImageData.push(imgInfo);

        callback?.(imgInfo);
      };

      return (imgSrc, callback) => {
        const imgDom = new Image();
        imgDom.addEventListener('load', initImageData.bind(imgDom, callback));
        imgDom.src = imgSrc;
      };
    })();

    return () =>
      data.forEach((imgSrc) =>
        createImageItem(imgSrc, (imgInfo) =>
          setImagePosition(imgInfo, setContainerHeight)
        )
      );
  })();
  // 注册事件
  const registerEvents = () => {
    window.addEventListener(
      'resize',
      debounce(changeWaterfallLayout.bind(null, null))
    );
  };

  // 初始化
  const init = () => {
    initContainer();
    initWaterfallInfo();
    initAllImageItem();
    registerEvents();
  };

  const waterfall = (userConfig = {}) => {
    Object.assign(finallyConfig, defaultConfig, userConfig);
    init();
  };

  myPlugin.waterfall = waterfall;
})(window.myPlugin || (window.myPlugin = {}));
