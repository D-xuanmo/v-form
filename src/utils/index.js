/**
 * 深拷贝
 * @param {array | object} data
 * @returns {array | object}
 */
export function deepCopy (data) {
  if ([null, undefined].includes(data)) return data

  if (typeof data === 'object') {
    const result = Array.isArray(data) ? [] : {}

    for (let i in data) {
      result[i] = deepCopy(data[i])
    }

    return result
  }

  return data
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
