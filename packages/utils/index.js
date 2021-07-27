import { isObject } from '@xuanmo/javascript-utils'

/**
 * 统一处理下拉选项 option 数据
 * @param {object[] | object[][]} data
 * @returns {object[] | object[][]}
 */
export const formatOption = data => {
  const result = []
  if (isObject(data[0])) {
    result.push({ values: data })
  } else if (Array.isArray(data[0])) {
    data.forEach((item) => {
      result.push({ values: item })
    })
  }
  return result
}
