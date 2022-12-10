const JSONParse = (() => {
  // 保存最后数据
  const emptyStrKey = '';
  const wrapResultObj = {
    [emptyStrKey]: undefined,
  };
  // 检测解析的数据是否符合JSON语法
  const checkExistNotValidJSONValue = (value) => {
    const isNotValidJSONType = [
      'undefined',
      'symbol',
      'function',
      'bigint',
    ].includes(typeof value);
    const isNotValidJSONNumber =
      typeof value === 'number' &&
      (Number.isNaN(value) || !Number.isFinite(value));

    if (isNotValidJSONType || isNotValidJSONNumber) {
      throw new SyntaxError(
        `${value}${typeof value === 'bigint' ? 'n' : ''} is not valid JSON`
      );
    }
  };
  // 深度优先遍历数据
  const depthFirstSearch = (() => {
    const isObjectType = (v) => v && typeof v === 'object';
    const isFunction = (v) => typeof v === 'function';
    const isUndefined = (v) => typeof v === 'undefined';
    const handler = (data, key, value, fn) => {
      const fnResult = isFunction(fn) ? fn.call(data, key, value) : value;
      if (isUndefined(fnResult)) {
        delete data[key];
      } else {
        data[key] = fnResult;
      }
    };

    return (data, fn) => {
      if (isObjectType(data)) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (isObjectType(value)) {
              depthFirstSearch(value, fn);
              handler(data, key, value, fn);
            } else {
              handler(data, key, value, fn);
            }
          }
        }

        return data;
      }

      return data;
    };
  })();

  return (JSONStr, reviver) => {
    wrapResultObj[emptyStrKey] = eval(`(${JSONStr})`);

    checkExistNotValidJSONValue(wrapResultObj[emptyStrKey]);
    depthFirstSearch(wrapResultObj, reviver);

    return wrapResultObj[emptyStrKey];
  };
})();
