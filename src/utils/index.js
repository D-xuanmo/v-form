/**
 * 判断是否为对象
 * @param {*} obj
 * @returns {boolean}
 */
export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

/**
 * 判断是否为正则
 * @param {*} regexp
 * @returns {boolean}
 */
export const isRegExp = regexp => Object.prototype.toString.call(regexp) === '[object RegExp]'

/**
 * 是否为函数
 * @param {*} fn
 * @returns {boolean}
 */
export const isFunction = fn => typeof fn === 'function'

/**
 * 判断url是否为图片
 * @param {string} url
 * @returns {boolean}
 */
export const isImageUrl = url => /\.((png)|(jpe?g)|(gif)|(svg)|(webp))$/ig.test(url)

/**
 * 防抖
 * @param {function} fn 执行函数
 * @param {number} wait 等待时间，毫秒
 * @param {boolean} immediate 是否立即执行
 */
export function debounce (fn, wait = 0, immediate = false) {
  let timer = null
  let _immediate = immediate
  return function () {
    if (_immediate) {
      fn.apply(this, arguments)
      _immediate = false
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      immediate ? (_immediate = true) : fn.apply(this, arguments)
    }, wait)
  }
}

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
