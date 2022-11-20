(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  var tankSportInit = function (tankDom) {
    var UPKEY1 = 'ArrowUp';
    var RIGHTKEY1 = 'ArrowRight';
    var DOWNKEY1 = 'ArrowDown';
    var LEFTKEY1 = 'ArrowLeft';
    var direKeys = [UPKEY1, RIGHTKEY1, DOWNKEY1, LEFTKEY1];
    var speedUpKey = 'Shift';

    var curSpeed = 5;
    var curRate = 1;
    var curDire = DOWNKEY1;
    var translateX = 0;
    var translateY = 0;

    // 坦克移动
    var tankMove = function (x, y) {
      tankDom.style.transform = `translate(${x}px, ${y}px)`;
    };

    // 改变坦克方向
    var tankTurnDireAndMove = function (direction) {
      var bgImg = '';

      switch (direction) {
        case UPKEY1:
          bgImg = './images/tankU.gif';
          curDire = UPKEY1;
          translateY -= curSpeed;
          break;
        case RIGHTKEY1:
          bgImg = './images/tankR.gif';
          curDire = RIGHTKEY1;
          translateX += curSpeed;
          break;
        case DOWNKEY1:
          bgImg = './images/tankD.gif';
          curDire = DOWNKEY1;
          translateY += curSpeed;
          break;
        case LEFTKEY1:
          bgImg = './images/tankL.gif';
          curDire = LEFTKEY1;
          translateX -= curSpeed;
          break;
        default:
      }

      // 改变方向
      tankDom.style.backgroundImage = `url(${bgImg})`;
      // 坦克移动
      tankMove(translateX, translateY);
    };

    // 坦克加速
    var tankSpeedUp = function () {
      // 加速
      curSpeed += curRate;
    };

    window.addEventListener('keydown', function (e) {
      var pressKey = e.key;
      if (direKeys.includes(pressKey)) {
        // 方向键
        tankTurnDireAndMove(pressKey);
      } else if (pressKey === speedUpKey) {
        // 加速键
        tankSpeedUp();
      }
    });
  };

  var init = function () {
    tankSportInit($('.tank'));
  };
  init();
})();
