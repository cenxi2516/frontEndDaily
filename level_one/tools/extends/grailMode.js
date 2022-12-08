/**
 * 圣杯模式，实现继承(兼容性最佳)
 * @param  {function} Parent 父构造器
 * @param  {function} Child  子构造器
 * @return {undefined} 默认返回undef
 */
var inherit = (function() {
    var F = function() {};

    return function(Child, Parent) {
        F.prototype = Parent.prototype;
        Child.prototype = new F();

        Child.prototype.constructor = Child;
        Child.prototype.uber = Parent.prototype;
        Child.prototype.super = Parent;

        Object.defineProperties(Child.prototype, {
          constructor: {
            enumerable: false,
          },
        });
    };
}());


// var inherit = function(Child, Parent){
//     Child.prototype = Object.create(Parent.prototype);
//     Child.prototype.constructor = Child;
//     Child.prototype.uber = Parent.prototype;
//     Child.prototype.super = Parent;
// }；