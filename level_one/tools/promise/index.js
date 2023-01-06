const MyPromise = (() => {
  // Promise三种状态
  const PENDING = 'pending';
  const FULFILLED = 'fulfilled';
  const REJECTED = 'rejected';

  // Promise属性：状态、数据、队列
  const PromiseStatusProp = Symbol('PromiseStatus');
  const PromiseResultProp = Symbol('PromiseResult');
  const PromiseTaskQueueProp = Symbol('PromiseTaskQueue');

  // 内部私有方法
  const _changeStatusAndResult = function (status, result) {
    if (this[PromiseStatusProp] !== PENDING) return;

    this[PromiseStatusProp] = status;
    this[PromiseResultProp] = result;
  };

  const _resolve = function (data) {
    _changeStatusAndResult.call(this, FULFILLED, data);
    _runTaskHandlers.call(this);
  };

  const _reject = function (reason) {
    _changeStatusAndResult.call(this, REJECTED, reason);
    _runTaskHandlers.call(this);
  };

  const _isFunction = (fn) => typeof fn === 'function';

  const _isPromise = (obj) =>
    obj && typeof obj === 'object' && typeof obj.then === 'function';

  const _runMicroTask = (() => {
    const divDom =
      typeof window === 'object' ? document.createElement('div') : null;

    return (callback) => {
      if (process && process.nextTick) {
        // node环境
        process.nextTick(callback);
      } else if (_isFunction(MutationObserver)) {
        // 浏览器环境
        const observer = new MutationObserver(callback);
        observer.observe(divDom, { childList: true });
        divDom.innerHTML = Math.random();
      } else {
        // 其他环境
        setTimeout(callback, 0);
      }
    };
  })();

  const _pushTaskQueue = function (executor, status, resolve, reject) {
    this[PromiseTaskQueueProp].push({
      executor,
      status,
      resolve,
      reject,
    });
  };

  const _runTaskHandlers = function () {
    if (this[PromiseStatusProp] === PENDING) return;

    while (this[PromiseTaskQueueProp][0]) {
      const handler = this[PromiseTaskQueueProp].shift();
      _runOneTaskHandler.call(this, handler);
    }
  };

  const _runOneTaskHandler = function (handler) {
    const { executor, status, resolve, reject } = handler;
    if (this[PromiseStatusProp] !== status) return;

    _runMicroTask(() => {
      try {
        if (_isFunction(executor)) {
          const result = executor(this[PromiseResultProp]);
          if (_isPromise(result)) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } else {
          const result = this[PromiseResultProp];
          this[PromiseStatusProp] === FULFILLED
            ? resolve(result)
            : reject(result);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  class MyPromise {
    // 属性
    [PromiseStatusProp] = PENDING;
    [PromiseResultProp] = undefined;
    [PromiseTaskQueueProp] = [];

    constructor(executor) {
      try {
        executor(_resolve.bind(this), _reject.bind(this));
      } catch (error) {
        _reject(error);
      }
    }

    // 原型方法
    then(onFulfilled, onRejected) {
      return new MyPromise((resolve, reject) => {
        _pushTaskQueue.call(this, onFulfilled, FULFILLED, resolve, reject);
        _pushTaskQueue.call(this, onRejected, REJECTED, resolve, reject);
        _runTaskHandlers.call(this);
      });
    }

    catch(onRejected) {
      return this.then(null, onRejected);
    }

    finally(onSettled) {
      return this.then(
        (data) => {
          _isFunction(onSettled) && onSettled();

          return data;
        },
        (reason) => {
          _isFunction(onSettled) && onSettled();
          throw reason;
        }
      );
    }

    // 静态方法
    static resolve(data) {
      if (data instanceof MyPromise) return data;

      return new MyPromise((resolve, reject) => {
        if (_isPromise(data)) {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      });
    }

    static reject(reason) {
      return new MyPromise((_, reject) => {
        reject(reason);
      });
    }

    static all(proms) {
      return new MyPromise((resolve, reject) => {
        const promises = [...proms];
        const promCount = promises.length;
        const newPromiseResult = [];

        if (!promCount) return resolve(newPromiseResult);

        try {
          promises.forEach((prom, index) => {
            MyPromise.resolve(prom).then((data) => {
              newPromiseResult[index] = data;
              if (Object.keys(newPromiseResult).length === promCount) {
                resolve(newPromiseResult);
              }
            }, reject);
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    static allSettled(proms) {
      const promises = [...proms].map((prom) =>
        MyPromise.resolve(prom).then(
          (value) => ({ status: FULFILLED, value }),
          (reason) => ({ status: REJECTED, reason })
        )
      );

      return MyPromise.all(promises);
    }

    static race(proms) {
      return new MyPromise((resolve, reject) => {
        const promises = [...proms];
        promises.forEach((prom) =>
          MyPromise.resolve(prom).then(resolve, reject)
        );
      });
    }

    static any(proms) {
      return new MyPromise((resolve, reject) => {
        const promises = [...proms];
        const promCount = promises.length;
        const newPromiseResult = [];

        promises.forEach((prom, index) => {
          MyPromise.resolve(prom).then(resolve, (reason) => {
            newPromiseResult[index] = reason;
            if (Object.keys(newPromiseResult).length === promCount) {
              reject({ errors: newPromiseResult });
            }
          });
        });
      });
    }
  }

  return MyPromise;
})();
