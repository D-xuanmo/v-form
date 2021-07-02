import Vue from 'vue'
import components from './components'
import validate, { extend } from '../validator'
import { isRegexp, isFunction, debounce, isEmpty } from '@xuanmo/javascript-utils'

const formUnitBase = Vue.extend({
  components,

  provide() {
    return {
      VFormRoot: this,
      $validate: validate
    }
  },

  props: {
    // 数据模型
    model: {
      type: Array,
      required: true,
      default: () => []
    },

    value: {
      type: Object,
      default: () => ({})
    },

    // 局部校验规则
    validator: {
      type: Object,
      default: () => ({})
    },

    disabled: {
      type: Boolean,
      default: false
    },

    labelWidth: {
      type: String,
      default: ''
    },

    labelPosition: {
      type: String,
      default: 'left'
    },

    labelColor: {
      type: String,
      default: ''
    },

    showLabel: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      formItemRefs: {},

      // 内部数据模型
      formModel: [],

      // 处理后的 value
      formValues: {},

      // 所有的错误信息
      formErrors: {},
      showErrorMessage: false,

      crossFields: {},

      debounceChange: null
    }
  },

  computed: {
    formErrorList() {
      return Object.values(this.formErrors)
        .filter((v) => Object.values(v).length !== 0)
        .sort((a, b) => a.index - b.index)
    },

    isValid() {
      return this.formErrorList.length === 0
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        this.formValues = value
        for (let [_key, _value] of Object.entries(value)) {
          this.model.forEach((item) => {
            if (item.key === _key) {
              item.value = _value
            }
          })
        }
      }
    }
  },

  created() {
    // 统一传递数据
    this.debounceChange = debounce((value) => {
      this.$emit('input', value)
      this.$emit('change', {
        value,
        errorMsg: this.formErrorList,
        isValid: this.isValid
      })
    }, this.$VForm.debounceTime)

    // 创建数据模型
    this.createModel()

    // 注册局部校验规则
    extend(this.validator)

    this.$emit('input', this.formValues)
  },

  mounted() {
    const refs = this.$refs
    for (const key in refs) {
      this.formItemRefs[key] = refs[key][0]
    }
  },

  methods: {
    // 执行校验
    async validate(callback) {
      this.showErrorMessage = true

      // 已经执行过校验的组件
      const completed = []
      let result = {}

      const refs = this.formItemRefs
      for (const i in refs) {
        const current = refs[i]
        completed.push(current.formModel.key)

        // 如果已经校验完成则不需要校验
        if (current.isValid) continue

        // 存在错误信息直接终止本次循环，执行回调
        result = await current.__validator()
        if (!isEmpty(result)) break
      }
      isFunction(callback) && callback(isEmpty(result), [result])

      // 将未执行完成的校验放入异步队列，以免影响页面渲染
      setTimeout(() => {
        for (const i in refs) {
          if (completed.includes(refs[i].formModel.key)) continue
          refs[i].__validator()
        }
      }, 0)
    },

    async setModelItemOptions(key, callback) {
      try {
        const data = isFunction(callback) ? await callback() : callback
        this.$set(this.formModel[this.findModelItemIndexByKey(key)].rules, 'options', data)
      } catch (err) {
        // eslint-disable-next-line
        if (err.message.indexOf('rules') !== -1) throw new TypeError(`[VForm] setModelItemOptions key "${key}" is not defined.`)
        console.error(err)
      }
    },

    findModelItemByKey(key) {
      return this.formModel.find((item) => item.key === key) || {}
    },

    findModelItemIndexByKey(key) {
      return this.formModel.findIndex((item) => item.key === key)
    },

    createModel() {
      const formModel = this.$VForm.primaryData
        ? this.modelFormatter(this.model)
        : this.model
      this.formModel = formModel

      const formValues = {}

      formModel.forEach((item) => {
        const { key, value, rules } = item

        // 排除展示类组件
        if (!['VCell', 'VText'].includes(rules.type)) {
          formValues[key] = value
        }

        // 生成跨域校验字段
        if (!isRegexp(rules.vRules)) {
          const crossFields = (rules.vRules || '').match(/\w+:@\w+(,@\w+)*/g) || []
          crossFields.forEach((_) => {
            const [name, cross] = _.split(':')
            this.crossFields[name] = {
              local: key,
              target: cross.split(',').map((_) => _.replace('@', ''))
            }
          })
        }
      })
      this.formValues = formValues
      this.debounceChange(formValues)
    },

    // 处理数据模型
    // 当所有的属性不存在 rules 字段的情况下调用
    modelFormatter(model) {
      const fixedKeys = ['key', 'value']
      const result = []
      model.forEach((item) => {
        const resultItem = {
          rules: {}
        }
        for (const [key, value] of Object.entries(item)) {
          if (fixedKeys.includes(key)) {
            resultItem[key] = value
            continue
          }
          resultItem.rules[key] = value
        }
        result.push(resultItem)
      })
      return result
    },

    // 分割组件类型
    splitComponentType(type) {
      let [compType, compParameter = ''] = type.split('|')
      return [compType, compParameter]
    },

    // 数据上报
    updateFormValues(index, value) {
      this.$set(this.formValues, this.formModel[index].key, value)
      this.formModel[index].value = value
      this.debounceChange(this.formValues)
    },

    // 获取子级错误信息
    getChildError(name, err) {
      this.$set(this.formErrors, name, err)
      this.debounceChange(this.value)
    }
  }
})

export default formUnitBase
