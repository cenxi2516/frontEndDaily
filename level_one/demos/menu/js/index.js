(() => {
  const { Animate } = myPlugin;
  const $ = (selector, element = document) => element.querySelector(selector);
  let nextActiveItemDom = $('.menu-wrap > .menu-item.active');
  const OnceMenuItemLiHeight = $('.menu-item-content', nextActiveItemDom)
    .children[0].offsetHeight;
  const totalTime = 300;

  const showMenuItem = (menuItemDom) => {
    const menuItemContentDom = $('.menu-item-content', menuItemDom);
    const height = menuItemContentDom.children.length * OnceMenuItemLiHeight;
    const animate = new Animate({
      totalTime,
      beginValue: {
        height: 0,
      },
      targetValue: {
        height,
      },
      onMove({ height }) {
        menuItemContentDom.style.height = height + 'px';
      },
      onOver() {
        menuItemDom.classList.add('active');
        nextActiveItemDom = menuItemDom;
      },
    });
    animate.start();
  };

  const hideMenuItem = (menuItemDom) => {
    const menuItemContentDom = $('.menu-item-content', menuItemDom);
    const height = menuItemContentDom.children.length * OnceMenuItemLiHeight;
    const animate = new Animate({
      totalTime,
      beginValue: {
        height,
      },
      targetValue: {
        height: 0,
      },
      onMove({ height }) {
        menuItemContentDom.style.height = height + 'px';
      },
      onOver() {
        menuItemDom.classList.remove('active');
      },
    });
    animate.start();
  };

  $('.menu-wrap').addEventListener('click', (e) => {
    const targetEle = e.target;
    const targetParent = targetEle.parentNode;
    if (targetEle.tagName === 'H2' && nextActiveItemDom !== targetParent) {
      // 显示
      showMenuItem(targetParent);
      // 隐藏
      hideMenuItem(nextActiveItemDom);
    }
  });
})();
