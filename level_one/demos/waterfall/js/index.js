(function (myPlugin) {
  var options = null;
  var vwWidth = 0,
    vwHeight = 0;
  var wrapWidth = 0;
  var colNum = 0; // 大于1
  var gap = 0;

  var dataSizeArr = [];
  var columnHeightArr = [];

  function debounce(fn, delay = 200, immediate = false) {
    var timer = null;

    return function () {
      var context = this,
        args = arguments;

      timer && clearTimeout(timer);
      if (immediate) {
        var isImmediateExec = !timer;
        isImmediateExec && fn.apply(context, args);
        timer = setTimeout(function () {
          timer = null;
        }, delay);
      } else {
        timer = setTimeout(function () {
          fn.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  }

  function initVwSize() {
    vwWidth = document.documentElement.clientWidth || document.body.clientWidth;
    vwHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    wrapWidth = options.dom.clientWidth;
    colNum = Math.floor(wrapWidth / options.width);
    gap = (wrapWidth - colNum * options.width) / (colNum - 1);
  }

  function setItemPosition(dom, left, top) {
    dom.style.position = 'absolute';
    dom.style.left = left + 'px';
    dom.style.top = top + 'px';

    options.dom.appendChild(dom);
  }

  function getMinHeightAndIndex() {
    var minValue = Math.min.apply(null, columnHeightArr);
    var minIndex = columnHeightArr.findIndex(function (item) {
      return Math.floor(item) === Math.floor(minValue);
    });

    return {
      value: minValue,
      index: minIndex,
    };
  }

  function addItemToWrap(param) {
    var dataLen = columnHeightArr.length;
    if (dataLen < colNum) {
      setItemPosition(param.dom, dataLen * (options.width + gap), 0);
      columnHeightArr[dataLen] = param.height + options.marginBottom;
    } else {
      var minParam = getMinHeightAndIndex();
      var index = minParam.index;
      var value = minParam.value;

      setItemPosition(param.dom, index * (options.width + gap), value);
      columnHeightArr[index] = value + param.height + options.marginBottom;
    }
  }

  function createItem(item, callback) {
    var imgDom = new Image();
    imgDom.addEventListener('load', function () {
      var height = (imgDom.height / imgDom.width) * options.width;
      var param = {
        dom: imgDom,
        height,
      };
      imgDom.width = options.width;
      imgDom.height = height;
      callback(param);
      dataSizeArr.push(param);
    });
    imgDom.src = item;
  }

  function initItem() {
    options.data.forEach(function (item) {
      createItem(item, addItemToWrap);
    });
  }

  function registerEvents() {
    window.addEventListener(
      'resize',
      debounce(function () {
        initVwSize();
        columnHeightArr.length = 0;
        dataSizeArr.forEach(addItemToWrap);
      })
    );
  }

  function init() {
    initVwSize();
    initItem();
    registerEvents();
  }

  function waterfall(config) {
    options = config;
    init();
  }

  myPlugin.waterfall = waterfall;
})(window.myPlugin || (window.myPlugin = {}));

myPlugin.waterfall({
  dom: document.querySelector('.waterfall-wrap'),
  width: 220,
  marginBottom: 20,
  data: [
    './images/0.jpg',
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg',
    './images/6.jpg',
    './images/7.jpg',
    './images/8.jpg',
    './images/9.jpg',
    './images/10.jpg',
    './images/11.jpg',
    './images/12.jpg',
    './images/13.jpg',
    './images/14.jpg',
    './images/15.jpg',
    './images/16.jpg',
    './images/17.jpg',
    './images/18.jpg',
    './images/19.jpg',
    './images/20.jpg',
    './images/21.jpg',
    './images/22.jpg',
    './images/23.jpg',
    './images/24.jpg',
    './images/25.jpg',
    './images/26.jpg',
    './images/27.jpg',
    './images/28.jpg',
    './images/29.jpg',
    './images/30.jpg',
    './images/31.jpg',
    './images/32.jpg',
    './images/33.jpg',
    './images/34.jpg',
    './images/35.jpg',
    './images/36.jpg',
    './images/37.jpg',
    './images/38.jpg',
    './images/39.jpg',
    './images/40.jpg',
  ],
  callback: function (item, dom) {},
});
