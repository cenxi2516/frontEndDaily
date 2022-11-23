(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  var implPlaceholder = function (inpDom, className) {
    // inpDom获取焦点
    inpDom.addEventListener('focus', function () {
      if (
        this.value === this.defaultValue &&
        this.classList.contains(className)
      ) {
        this.value = '';
        this.classList.remove(className);
      }
    });

    // inpDom失去焦点
    inpDom.addEventListener('blur', function () {
      if (!this.value) {
        this.value = this.defaultValue;
        this.classList.add(className);
      }
    });
  };

  implPlaceholder($('input'), 'no-input');
})();
