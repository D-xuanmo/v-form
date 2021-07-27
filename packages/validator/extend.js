import { extend, localize } from 'vee-validate'
import * as veeRules from 'vee-validate/dist/rules'
// eslint-disable-next-line camelcase
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import { isObject } from '@xuanmo/javascript-utils'

localize('zh_CN', zh_CN)

const validator = {
  phone: {
    message: '手机号格式错误',
    validate: value => /^1[3456789]\d{9}$/g.test(value)
  },
  telphone: {
    message: '固定电话格式错误',
    validate: value => /^0\d{2,3}((-\d{7,8}$)|(\d{7,8}$))/.test(value)
  },
  idcard: {
    message: '身份证格式错误',
    validate: (value, args) => {
      let num = value
      let ret = false
      //  身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(num))) {
        return ret
      }

      //  校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。  下面分别分析出生日期和校验位
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let nTemp = 0
      let i = null
      const len = num.length
      let re = null
      let arrSplit = null
      let dtmBirth = null
      if (len === 15) {
        re = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/i
        arrSplit = num.match(re)
        //  检查出生日期是否正确
        dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
        if (dtmBirth !== 'Invalid Date') {
          //  将15位身份证转成18位  校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
          num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6)
          for (i = 0; i < 17; i++) {
            nTemp += num.substr(i, 1) * arrInt[i]
          }

          num += arrCh[nTemp % 11]
        }
      } else if (len === 18) {
        re = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/i
        arrSplit = num.match(re)
        // 检查出生日期是否正确
        dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
        if (dtmBirth !== 'Invalid Date') {
          // 检验18位身份证的校验码是否正确。 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
          let valnum
          for (i = 0; i < 17; i++) {
            nTemp += num.substr(i, 1) * arrInt[i]
          }
          // eslint-disable-next-line prefer-const
          valnum = arrCh[nTemp % 11]
          if (valnum === num.substr(17, 1).toUpperCase()) {
            ret = true
          }
        }
      }
      return ret
    }
  }
}

function customExtend (opt = {}) {
  if (!isObject(opt)) {
    throw new Error('自定义校验规则格式错误')
  }
  for (const [key, value] of Object.entries(opt)) {
    extend(key, {
      validate: () => true,
      ...value
    })
  }
}

// 注册插件自带校验规则
Object.keys(veeRules).forEach(rule => {
  extend(rule, {
    ...veeRules[rule],
    message: zh_CN.messages[rule]
  })
})

customExtend(validator)

export { customExtend as extend }
