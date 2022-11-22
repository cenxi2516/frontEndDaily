(function () {
  /**
   * 获取css选择器选中的第一个don元素
   * @param {string} selector css选择器
   * @param {Element} element dom元素
   * @returns css选择器选中的第一个dom元素
   */
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  /**
   * 自定义菜单显示与隐藏
   * @param {Element} menuDom 要显示菜单的dom元素
   * @param {function} callback 点击菜单项回调
   * @param {Element} showContainerDom 在哪触发，显示自定义菜单的dom元素
   */
  var customDefineMenu = function (
    menuDom,
    callback,
    showContainerDom = window
  ) {
    // 文档视口的尺寸
    var vwWidth =
      document.documentElement.clientWidth || document.body.clientWidth;
    var vwHeight =
      document.documentElement.clientHeight || document.body.clientHeight;

    // 自定义菜单尺寸和位置
    var menuVWData = menuDom.getBoundingClientRect();
    var menuWidth = menuVWData.width;
    var menuHeight = menuVWData.height;
    var menuTop = menuVWData.top;
    var menuLeft = menuVWData.left;

    // 自定义菜单能移动最大、最小水平(垂直)值
    var menuMoveMinHValue = -menuLeft;
    var menuMoveMaxHValue = vwWidth - menuLeft - menuWidth;
    var menuMoveMinVValue = -menuTop;
    var menuMoveMaxVValue = vwHeight - menuTop - menuHeight;

    // 菜单是否显示
    var isShowMenu = false;
    var MenuItemMark = 'menu-item';

    // 显示自定义菜单
    var showMenu = function () {
      menuDom.style.visibility = 'visible';
      isShowMenu = true;
    };

    // 隐藏自定义菜单
    var hideMenu = function () {
      menuDom.style.visibility = 'hidden';
      isShowMenu = false;
    };

    // 移动自定义菜单位置
    var moveMenuPos = function (x, y) {
      var translateX = x,
        translateY = y;

      // 水平方向
      translateX =
        translateX < menuMoveMinHValue ? menuMoveMinHValue : translateX;
      translateX =
        translateX > menuMoveMaxHValue ? menuMoveMaxHValue : translateX;
      // 垂直方向
      translateY =
        translateY < menuMoveMinVValue ? menuMoveMinVValue : translateY;
      translateY =
        translateY > menuMoveMaxVValue ? menuMoveMaxVValue : translateY;

      menuDom.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };

    // 判断点击是否是自定义菜单
    var isClickMenu = function (clickDom) {
      return (
        clickDom === menuDom ||
        (clickDom.classList.contains(MenuItemMark) &&
          clickDom.dataset.disabled === 'true')
      );
    };

    // 触发显示自定义菜单
    showContainerDom.addEventListener('contextmenu', function (e) {
      e.bubbles && e.preventDefault();
      e.stopPropagation();
      moveMenuPos(e.clientX, e.clientY);
      showMenu();
    });

    // 点击除自定义菜单外处，隐藏自定义菜单
    window.addEventListener('click', function (e) {
      if (isShowMenu && !isClickMenu(e.target)) {
        // 隐藏自定义菜单
        hideMenu();
      }
    });

    // 自定义菜单禁用默认菜单显示
    menuDom.addEventListener('contextmenu', function (e) {
      e.bubbles && e.preventDefault();
      e.stopPropagation();
    });

    if (showContainerDom !== window) {
      window.addEventListener('contextmenu', function () {
        isShowMenu && hideMenu();
      });
    }

    // 点击菜单项
    menuDom.addEventListener('click', function (e) {
      var targetDom = e.target;
      if (
        targetDom.classList.contains(MenuItemMark) &&
        targetDom.dataset.disabled === 'false'
      ) {
        callback(targetDom.dataset.value);
      }
    });
  };

  // 初始化
  var init = function () {
    customDefineMenu($('.custom-define-menu'), function (value) {
      console.log(value);
    });
  };
  init();
})();
