// 深拷贝
export const deepCopy = obj => {
  let result = Array.isArray(obj) ? [] : {}
  for (let [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'object' ? deepCopy(value) : value
  }
  return result
}

// 是否为对象
export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

// 判断url是否为图片
export const isImageUrl = url => /\.((png)|(jpe?g)|(gif)|(svg)|(webp))$/ig.test(url)
