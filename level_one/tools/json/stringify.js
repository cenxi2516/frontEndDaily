// 实现JSON.stringify方法
const JSONStringify = (() => {
  // 获取数据类型
  const getDataType = (v) => {
    const dataType = typeof v;
    if (dataType === 'object') {
      return Object.prototype.toString
        .call(v)
        .replace(/^\[object (\S+)\]$/, '$1');
    }

    return dataType;
  };
  // 判断序列化数据是否有toJSON方法
  const hasToJSONFunc = (data) =>
    data && typeof data === 'object' && typeof data.toJSON === 'function';
  // 判断是否是函数、符号、undefined
  const isUndefinedOrSymbolOrFunction = (v) => {
    switch (getDataType(v)) {
      case 'undefined':
      case 'function':
      case 'symbol':
        return true;
      default:
        return false;
    }
  };
  // 检测对象中是否存在循环引用
  const isExistCircleRef = (() => {
    // 记录每次比较数据
    const compareData = { value: null };
    const isObject = (v) => v && typeof v === 'object';
    const isOwnProperty = (obj, k) =>
      Object.prototype.hasOwnProperty.call(obj, k);
    // 遍历对象
    const forEachObject = (data, hash, fn) => {
      for (const key in data) {
        if (isOwnProperty(data, key)) {
          const value = data[key];
          if (!isObject(value) || hash.has(value)) {
            continue;
          }
          hash.set(value, value);
          if (fn?.(value, hash)) {
            return true;
          }
        }
      }

      return false;
    };
    // 对象 与 对象中所有数据检索是否存在相同数据
    const searchObject = (data, hash = new WeakMap()) => {
      const fn = (value, hash) =>
        value === compareData.value || forEachObject(value, hash, fn);
      return forEachObject(data, hash, fn);
    };

    return (data, hash = new WeakMap()) => {
      // 若是原始值或function，则不存在循环引用
      if (!isObject(data)) return false;

      compareData.value = data;

      return searchObject(data) || forEachObject(data, hash, isExistCircleRef);
    };
  })();
  // 序列化普通对象
  const objectToJSONStr = (data) => {
    const resultArr = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (isUndefinedOrSymbolOrFunction(value)) {
          continue;
        }
        resultArr.push(`"${key}":${JSONStringify(value)}`);
      }
    }

    return `{${resultArr.join(',')}}`;
  };
  // 序列化数组
  const arrayToJSONStr = (data) => {
    const resultArr = data.reduce((arr, value) => {
      if (isUndefinedOrSymbolOrFunction(value)) {
        arr.push('null');
      } else {
        arr.push(JSONStringify(value));
      }
      return arr;
    }, []);

    return `[${resultArr.join(',')}]`;
  };

  return (data) => {
    // 检测数据是否存在循环引用
    if (isExistCircleRef(data)) {
      throw new TypeError('cyclic object value');
    }

    // 对象统一处理是否有toJSON方法
    if (hasToJSONFunc(data)) return JSONStringify(data.toJSON());

    // 不同类型序列化处理
    switch (getDataType(data)) {
      case 'number':
        return isFinite(data) ? `${data}` : 'null';
      case 'string':
        return `"${data}"`;
      case 'boolean':
        return `${data}`;
      case 'Null':
        return 'null';
      case 'function':
      case 'symbol':
      case 'undefined':
        return undefined;
      case 'RegExp':
        return '{}';
      case 'Number':
      case 'String':
      case 'Boolean':
        return JSONStringify(data.valueOf());
      case 'bigint':
        throw new TypeError("BigInt value can't be serialized in JSON ");
      case 'Object':
        return objectToJSONStr(data);
      case 'Array':
        return arrayToJSONStr(data);
    }
  };
})();
