(function (myPlugin) {
  var maskLayerDom = null,
    modalDom = null,
    modalHeaderDom = null,
    modalBodyDom = null,
    modalFooterDom = null,
    modalOkBtnDom = null,
    modalCancelBtnDom = null,
    modalCloseBtnDom = null,
    modalTitleDom = null;

  var options = null;
  var isRegisterEvent = false;

  // 根据css选择器，获取第一个元素
  var $ = function (selector, element) {
    element = element || document;
    return element.querySelector(selector);
  };

  // 初始化modal header
  function initModalHeader() {
    if (!modalHeaderDom) {
      modalHeaderDom = document.createElement('div');

      modalHeaderDom.style.display = 'flex';
      modalHeaderDom.style.alignItems = 'center';
      modalHeaderDom.style.position = 'relative';
      modalHeaderDom.style.flex = '0 0 auto';
      modalHeaderDom.style.height = '40px';
      modalHeaderDom.style.padding = '0 20px';
      modalHeaderDom.style.whiteSpace = 'nowrap';
      modalHeaderDom.style.textOverflow = 'ellipsis';
      modalHeaderDom.style.overflow = 'hidden';
      modalHeaderDom.style.backgroundColor = '#eee';

      modalHeaderDom.innerHTML = `
      <div data-confirm-id="title"></div>
      <span data-confirm-id="closeBtn" style="cursor: pointer; position: absolute; top: 50%; transform: translateY(-50%); right: 10px;">
        <svg t="1669479554929" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2672" width="16" height="16"><path d="M557.311759 513.248864l265.280473-263.904314c12.54369-12.480043 12.607338-32.704421 0.127295-45.248112-12.512727-12.576374-32.704421-12.607338-45.248112-0.127295L512.127295 467.904421 249.088241 204.063755c-12.447359-12.480043-32.704421-12.54369-45.248112-0.063647-12.512727 12.480043-12.54369 32.735385-0.063647 45.280796l262.975407 263.775299-265.151458 263.744335c-12.54369 12.480043-12.607338 32.704421-0.127295 45.248112 6.239161 6.271845 14.463432 9.440452 22.687703 9.440452 8.160624 0 16.319527-3.103239 22.560409-9.311437l265.216826-263.807983 265.440452 266.240344c6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.591372-9.34412 12.512727-12.480043 12.54369-32.704421 0.063647-45.248112L557.311759 513.248864z" p-id="2673"></path></svg>
      </span>`;

      modalDom.appendChild(modalHeaderDom);
      modalCloseBtnDom = $('[data-confirm-id="closeBtn"]');
      modalTitleDom = $('[data-confirm-id="title"]');
    }

    options.headerClass && modalHeaderDom.classList.add(options.headerClass);
    modalTitleDom.innerHTML = options.title || '提示';
  }

  // 初始化modal body
  function initModalBody() {
    if (!modalBodyDom) {
      modalBodyDom = document.createElement('div');

      modalBodyDom.style.flex = '1 1 auto';
      modalBodyDom.style.padding = '10px 20px';
      modalBodyDom.style.wordBreak = 'break-word';

      modalDom.appendChild(modalBodyDom);
    }

    options.bodyClass && modalBodyDom.classList.add(options.bodyClass);
    modalBodyDom.innerHTML = options.content || '确认是否删除?';
  }

  // 初始化modal footer
  function initModalFooter() {
    if (!modalFooterDom) {
      modalFooterDom = document.createElement('div');

      modalFooterDom.style.display = 'flex';
      modalFooterDom.style.justifyContent = 'flex-end';
      modalFooterDom.style.alignItems = 'center';
      modalFooterDom.style.flex = '0 0 auto';
      modalFooterDom.style.height = '50px';
      modalFooterDom.style.padding = '0 20px';

      modalFooterDom.innerHTML = `
      <button data-confirm-id="okBtn"></button>
      <button data-confirm-id="cancelBtn"></button>
      `;

      modalDom.appendChild(modalFooterDom);

      modalOkBtnDom = $('button[data-confirm-id="okBtn"]');
      modalCancelBtnDom = $('button[data-confirm-id="cancelBtn"]');
    }

    options.footerClass && modalFooterDom.classList.add(options.footerClass);
    modalOkBtnDom.innerText = options.okText || '确认';
    modalCancelBtnDom.innerText = options.cancelText || '取消';

    options.okClass && modalOkBtnDom.classList.add(options.okClass);
    options.cancelClass && modalCancelBtnDom.classList.add(options.cancelClass);
  }

  // 显示confirm
  function showConfirm() {
    maskLayerDom.style.visibility = 'visible';
  }

  // 隐藏confirm
  function hideConfirm() {
    maskLayerDom.style.visibility = 'hidden';
  }

  // 创建遮罩层maskLayer：多次使用confirm，仅有一个
  function initMaskLayer() {
    if (!maskLayerDom) {
      maskLayerDom = document.createElement('div');

      maskLayerDom.style.position = 'fixed';
      maskLayerDom.style.top = '0';
      maskLayerDom.style.left = '0';
      maskLayerDom.style.width = '100%';
      maskLayerDom.style.height = '100%';
      maskLayerDom.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';

      document.body.appendChild(maskLayerDom);
    }

    showConfirm();
  }

  // 创建modal：多次使用confirm，仅有一个
  function initModal() {
    if (!modalDom) {
      // 创建modal容器
      modalDom = document.createElement('div');

      modalDom.style.display = 'flex';
      modalDom.style.flexDirection = 'column';
      modalDom.style.position = 'absolute';
      modalDom.style.top = 0;
      modalDom.style.right = 0;
      modalDom.style.bottom = 0;
      modalDom.style.left = 0;
      modalDom.style.margin = 'auto';
      modalDom.style.fontSize = '14px';
      modalDom.style.backgroundColor = '#fff';
      modalDom.style.boxShadow = '0 0 2px 0 rgba(0, 0, 0, 0.3)';

      maskLayerDom.appendChild(modalDom);
    }

    modalDom.style.width = (options.width || 260) + 'px';
    modalDom.style.height = (options.height || 160) + 'px';

    // 初始化modal header
    initModalHeader();
    // 初始化modal body
    initModalBody();
    // 初始化modal footer
    initModalFooter();
  }

  // 注册事件
  function registerEvents() {
    if (isRegisterEvent) return;

    isRegisterEvent = true;

    modalCloseBtnDom.addEventListener('click', hideConfirm);
    modalCancelBtnDom.addEventListener('click', function () {
      typeof options.onCancel === 'function' && options.onCancel();
      hideConfirm();
    });
    modalOkBtnDom.addEventListener('click', function () {
      typeof options.onOk === 'function' && options.onOk();
      hideConfirm();
    });
    maskLayerDom.addEventListener('click', function (e) {
      e.target === this && hideConfirm();
    });
  }

  // 初始化
  function init() {
    initMaskLayer();
    initModal();
    registerEvents();
  }

  // 确定弹窗
  function confirm(config = {}) {
    // config配置项为对象或字符串(modal body 内容)
    options = typeof config === 'string' ? { content: config } : config;
    init();
  }

  myPlugin.confirm = confirm;
})(window.myPlugin || (window.myPlugin = {}));
