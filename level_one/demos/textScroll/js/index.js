((tools) => {
  const $ = (selector, element = document) => element.querySelector(selector);

  tools.$ = $;
})(window.tools || (window.tools = {}));

((myPlugin) => {
  // 默认配置
  const DefaultOptions = {
    duration: 1000, // 滚动间隔时间
    data: [],
    container: document.body,
    noticeTag: 'div',
    noticeClass: '',
    animateConfig: {},
  };

  // 将数据添加到页面
  const addDataToContainer = (() => {
    const createOneNotice = (content, noticeTag, noticeClass) =>
      `<${noticeTag} class="${noticeClass}">${content}</${noticeTag}>`;

    return ({ data, container, noticeTag, noticeClass }) => {
      const allNoticeHTMLArr = data.reduce(
        (allNoticeHTMLArr, noticeContent) => {
          allNoticeHTMLArr.push(
            createOneNotice(noticeContent, noticeTag, noticeClass)
          );

          return allNoticeHTMLArr;
        },
        []
      );

      container.innerHTML = allNoticeHTMLArr.join('');
    };
  })();
  // 将noticeItem高度加入数组
  const initNoticeData = (noticeHeightData, container) => {
    const allNoticeItems = [...container.children];
    allNoticeItems.forEach((noticeItemDom) => {
      noticeHeightData.push(noticeItemDom.offsetHeight);
    });
  };

  // 数组求和
  const sum = (arr) => arr.reduce((result, curValue) => result + curValue, 0);

  // 垂直移动
  const verticalMove = (container, y) =>
    (container.style.transform = `translateY(${y}px)`);

  // 注册事件
  const registerEvents = (that) => {
    document.addEventListener('visibilitychange', function () {
      if (this.visibilityState === 'visible') {
        // Tab显示
        that.start();
      } else {
        // Tab隐藏
        that.stop();
      }
    });
    window.addEventListener('load', () => that.start());
  };

  // 动画插件
  const { Animate } = myPlugin;

  class NoticeVerticalScroll {
    constructor(options = {}) {
      this.options = { ...DefaultOptions, ...options };
      this.timer = null; // 滚动时间间隔

      const { data } = this.options;
      this.count = data.length; // notice数量
      this.curIndex = 0; // 当前索引
      this.newData = [...data, data[0]]; // 将第一条数据拷贝添加到末尾
      this.noticeHeightData = [];
    }

    start() {
      if (this.timer) return;

      const { duration, animateConfig } = this.options;

      this.timer = setInterval(() => {
        this.curIndex = ++this.curIndex % (this.count + 1);
        const animate = new Animate({
          ...animateConfig,
          beginValue: {
            y:
              this.curIndex - 1
                ? sum(this.noticeHeightData.slice(0, this.curIndex - 1))
                : 0,
          },
          targetValue: {
            y: sum(this.noticeHeightData.slice(0, this.curIndex)),
          },
          onMove: ({ y }) => {
            verticalMove(this.options.container, -y);
          },
          onOver: () => {
            if (this.curIndex === this.count) {
              this.curIndex = 0;
              verticalMove(this.options.container, 0);
            }
          },
        });
        animate.start();
      }, duration);
    }

    stop() {
      if (!this.timer) return;

      clearInterval(this.timer);
      this.timer = null;
    }

    // 初始化
    init() {
      addDataToContainer({ ...this.options, data: this.newData });
      initNoticeData(this.noticeHeightData, this.options.container);
      registerEvents(this);
    }
  }

  myPlugin.NoticeVerticalScroll = NoticeVerticalScroll;
})(window.myPlugin || (window.myPlugin = {}));
