(function () {
  var $ = function (selector, element = document) {
    return element.querySelector(selector);
  };

  var onlyInputInteger = function (inpDom) {
    var allowInputChars = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
    ];

    inpDom.addEventListener('keydown', function (e) {
      if (!allowInputChars.includes(e.key)) {
        e.preventDefault();
      }
    });

    inpDom.addEventListener('input', function () {
      var inpValue = this.value;
      if (Number.isNaN(Number(inpValue))) {
        this.value = parseInt(inpValue) || '';
      }
    });
  };

  var init = function () {
    onlyInputInteger($('.only-int'));
  };
  init();
})();
