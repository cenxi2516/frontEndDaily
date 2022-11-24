(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  // 配置
  var config = {
    countdownTime: 5,
    hitTimes: 0,
    timer: null,
    startCountDown: false,
    isReset: false,
    showCountdownTimeDom: $('.countdown-time'),
    showHitsTimesDom: $('.hits-times'),
  };

  // 设置倒计时
  var setCountdownTime = function (dom, time) {
    dom.innerText = time;
  };

  // 设置点击次数
  var setHitTimes = function (dom, times) {
    dom.innerText = times;
  };

  // 初始化倒计时和点击次数
  var initAPMCalculator = function () {
    if (config.timer) {
      clearInterval(config.timer);
      config.timer = null;
    }
    config.startCountDown = false;
    config.hitTimes = 0;
    setCountdownTime(config.showCountdownTimeDom, config.countdownTime);
    setHitTimes(config.showHitsTimesDom, config.hitTimes);
  };

  // 开启倒计时
  var startCountDownTime = function () {
    if (config.startCountDown) return;

    config.isReset = false;
    config.startCountDown = true;
    var countdownTime = config.countdownTime;
    var showCountdownTimeDom = config.showCountdownTimeDom;

    config.timer = setInterval(function () {
      showCountdownTimeDom.innerText = --countdownTime;
      if (countdownTime === 0) {
        clearInterval(config.timer);
        config.timer = null;
      }
    }, 1000);
  };

  // 记录点击次数
  var recordHitTimes = function () {
    if (!config.timer) return;

    config.hitTimes++;
    setHitTimes(config.showHitsTimesDom, config.hitTimes);
  };

  // 重置APM
  var resetAPMCalculator = function () {
    // 清除定时器
    // 重置倒计时、点击次数
    // 重置开启了倒计时
    if (config.isReset) return;

    config.isReset = true;
    initAPMCalculator();
  };

  // 开始APM
  var startAPMCalculator = function () {
    // 开启倒计时
    startCountDownTime();
    // 记录点击次数
    recordHitTimes();
  };

  // 注册事件
  var registerEvents = function () {
    // 点击
    $('.func-btn>.click').addEventListener('click', startAPMCalculator);
    // 重置
    $('.func-btn>.reset').addEventListener('click', resetAPMCalculator);
  };

  // 初始化
  var init = function () {
    initAPMCalculator(config);
    registerEvents();
  };
  init();
})();
