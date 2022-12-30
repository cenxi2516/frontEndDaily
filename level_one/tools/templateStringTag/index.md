# 模版字符串标记

> 本质：是一个函数。例如：String.raw，表示皆是普通字符串。

## 函数中传递的参数和返回值
**函数传递的参数**

**函数的返回值**

```javascript
const you = '你';
const i = '我';
const str = myTag`我爱${you}，${you}爱${i}。`;

function myTag(parts, ...rests){
  const newArrStr = rests.reduce((arr, value, i) => {
    arr.push(parts[i]+value);
    return arr;
  }, []);

  newArrStr.push(parts[parts.length-1]);

  return newArrStr.join('');
}
```