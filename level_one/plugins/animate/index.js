// 动画本质：一个数值 在一段时间内 变化为另一个数值
((myPlugin) => {
  // 默认配置
  const DefaultOptions = {
    duration: 16, // 每次运动时间间隔，单位毫秒
    totalTime: 1000, // 完成运动总时间，单位毫秒
    beginValue: {}, // 运动起始值
    targetValue: {}, // 运动目标值
    onStart: null, // 运动开始回调
    onMove: null, // 运动回调
    onOver: null, // 运动结束回调
  };
  // 私有属性名
  const {
    symOptions,
    symTimer,
    symTimes,
    symCurTimes,
    symCurData,
    symOnceStep,
  } = {
    symOptions: Symbol('options'),
    symTimer: Symbol('timer'),
    symTimes: Symbol('times'),
    symCurTimes: Symbol('curTimes'),
    symCurData: Symbol('curData'),
    symOnceStep: Symbol('onceStep'),
  };
  // 深拷贝数据
  const depthClone = (() => {
    const copyData = (data, hash) => {
      const newData = Array.isArray(data) ? [] : {}; // 创建新对象
      const dataPrototype = Object.getPrototypeOf(data); // 获取旧对象隐私原型
      const allDescriptors = Object.getOwnPropertyDescriptors(data); // 获取旧对象中所有成员(可枚举、不可枚举、符号属性)的描述符
      Object.setPrototypeOf(newData, dataPrototype); // 将旧对象隐私原型设置为新对象隐式原型
      Object.defineProperties(newData, allDescriptors); // 新对象中成员描述符为旧对象成员描述符

      hash.set(data, newData); // 将旧对象原型指向新对象，解决循环引用

      return newData;
    };

    const isObject = (v) => v && typeof v === 'object';

    return (data, hash = new WeakMap()) => {
      if (isObject(data)) {
        if (hash.has(data)) return hash.get(data); // 循环引用出口

        const newData = copyData(data, hash);
        const allProps = Reflect.ownKeys(data); // 获取对象中所有成员键(可枚举、不可枚举、符号属性)组成的数组

        for (const prop of allProps) {
          const value = data[prop];
          if (isObject(value)) {
            newData[prop] = depthClone(value, hash);
          }
        }

        return newData;
      }

      // function、null、undefined、string、number、boolean、symbol、bigint
      return data;
    };
  })();
  class Animate {
    constructor(options = {}) {
      this[symOptions] = { ...DefaultOptions, ...options };

      const { duration, totalTime, beginValue, targetValue } = this[symOptions];
      this[symTimer] = null; // 定时器
      this[symTimes] = Math.ceil(totalTime / duration); // 运动次数
      this[symCurTimes] = 0; // 当前运动次数
      this[symCurData] = depthClone(beginValue); // 当前运动数据
      this[symOnceStep] = {}; // 每次运动值

      for (const prop in beginValue) {
        if (Object.hasOwn(beginValue, prop)) {
          this[symOnceStep][prop] =
            (targetValue[prop] - beginValue[prop]) / this[symTimes];
        }
      }
    }

    start() {
      // 已开启定时器或运动完成
      if (this[symTimer] || this[symCurTimes] === this[symTimes]) return;

      const { duration, targetValue, onStart, onMove, onOver } =
        this[symOptions];
      const curData = this[symCurData];

      onStart?.(Object.freeze(depthClone(curData)));

      this[symTimer] = setInterval(() => {
        this[symCurTimes]++;
        for (const prop in curData) {
          if (Object.hasOwn(curData, prop)) {
            if (this[symCurTimes] === this[symTimes]) {
              curData[prop] = targetValue[prop];
            } else {
              curData[prop] += this[symOnceStep][prop];
            }
          }
        }

        onMove?.(Object.freeze(depthClone(curData)));
        if (this[symCurTimes] === this[symTimes]) {
          this.stop();
          onOver?.(Object.freeze(depthClone(curData)));
        }
      }, duration);
    }
    stop() {
      // 定时器已清除
      if (!this[symTimer]) return;

      clearInterval(this[symTimer]);
      this[symTimer] = null;
    }
  }
  myPlugin.Animate = Animate;
})(window.myPlugin || (window.myPlugin = {}));
