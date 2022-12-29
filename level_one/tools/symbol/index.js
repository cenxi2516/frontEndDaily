// 模拟Symbol.for()
const symbolFor = (() => {
  const commonSymbols = {};

  return (key) => {
    key = String(key);
    const commonSymbolValue = commonSymbols[key];

    return commonSymbolValue
      ? commonSymbolValue
      : (commonSymbols[key] = Symbol(key));
  };
})();
