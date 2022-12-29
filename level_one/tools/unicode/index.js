// 判断字符是否是32位Unicode编码组成
const is32Bit = (char, index = 0) => char.codePointAt(index) > 0xffff;

// 获取码点长度
const getCodePointOfLength = (str) => {
  let count = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    if (is32Bit(str)) {
      i++;
    }
    count++;
  }

  return count;
};
