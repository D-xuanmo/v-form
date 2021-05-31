/**
 * 深拷贝
 * @param {array | object} obj
 * @returns {array | object}
 */
export const deepCopy = obj => {
  let result = Array.isArray(obj) ? [] : {}
  for (let [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'object' ? deepCopy(value) : value
  }
  return result
}

/**
 * 判断是否为对象
 * @param {*} obj 数据源
 * @returns {boolean}
 */
export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

/**
 * 判断url是否为图片
 * @param {string} url
 * @returns {boolean}
 */
export const isImageUrl = url => /\.((png)|(jpe?g)|(gif)|(svg)|(webp))$/ig.test(url)
