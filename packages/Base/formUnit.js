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
      handler(value) {
        this.formValues = value
      }
    },

    model: {
      deep: true,
      handler(model) {
        this.createModel()
        this.createRefs()
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

    // 注册局部校验规则
    extend(this.validator)

    this.createModel()

    this.$emit('input', this.formValues)
  },

  mounted() {
    this.createRefs()
  },

  methods: {
    /**
     * 执行校验
     * @param {Function} callback
     * @returns {Promise<void>}
     */
    async validate(callback) {
      this.showErrorMessage = true

      // 已经执行过校验的组件
      const completed = []
      let result = {}

      const refs = this.formItemRefs
      for (const i in refs) {
        const current = refs[i]
        completed.push(current.formModel.key)

        // 控件隐藏直接跳过校验
        if (current.formModel.rules.visible === false) continue

        // 如果当前存在未校验通过的信息，直接结束循环
        if (current.errorMessage.errorMsg) {
          result = current.errorMessage
          break
        }

        /**
         * 组件校验规则顺序说明
         * 1. 优先执行组件内部的自定义校验规则
         * 2. 执行表单组件统一校验规则
         */
        if (current.customValidator) {
          result = await current.customValidator?.()
          // 校验未通过终止本次循环，执行回调
          if (!result?.isValid && current.isNotVerified) break

          // 校验通过，并且未最后一次校验，跳过本次循环
          if (result?.isValid && result?.isLastValid && current.isNotVerified) continue
        }

        // 如果已经校验完成或者已经隐藏的控件则不需要校验
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

    /**
     * 切换组件单元显示状态
     * @param {string} key
     * @param {boolean} visible
     */
    toggleFormItemVisible(key, visible) {
      this.$set(this.formModel[this.findModelItemIndexByKey(key)].rules, 'visible', visible)
    },

    /**
     * 设置数据单元 option 字段
     * @param {string} key
     * @param {Array | Function} callback
     * @returns {Promise<void>}
     */
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

    /**
     * 通过 key 查找数据单元
     * @param {string} key
     * @returns {object}
     */
    findModelItemByKey(key) {
      return this.formModel.find((item) => item.key === key) || {}
    },

    /**
     * 通过 key 查找数据单元 index
     * @param {string} key
     * @returns {number}
     */
    findModelItemIndexByKey(key) {
      return this.formModel.findIndex((item) => item.key === key)
    },

    /**
     * 创建数据模型
     */
    createModel() {
      const formModel = this.$VForm.primaryData
        ? this.modelFormatter(this.model)
        : this.model

      const formValues = {}

      const propsValue = this.value

      this.formModel = formModel.map((item) => {
        const { key, value, rules } = item

        // 排除展示类组件
        if (!['VCell'].includes(rules.type)) {
          formValues[key] = isEmpty(propsValue[key]) ? value : propsValue[key]
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

        // 分割组件类型
        item.componentTypes = this.splitComponentType(item.rules.type)

        delete item.value
        return item
      })
      this.formValues = formValues
      this.debounceChange(formValues)
    },

    /**
     * 创建 vue refs
     * @returns {Promise<void>}
     */
    async createRefs() {
      await this.$nextTick()
      const refs = this.$refs
      for (const key in refs) {
        this.formItemRefs[key] = refs[key][0]
      }
    },

    /**
     * 处理数据模型，当所有的属性不存在 rules 字段的情况下调用
     * @param {Array} model 数据模型
     * @returns {Array} model
     */
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

    /**
     * 分割组件类型
     * @param {string} type
     * @returns {string[]}
     */
    splitComponentType(type) {
      const [compType, compParameter = ''] = type.split('|')
      return [compType, compParameter]
    },

    /**
     * 数据上报
     * @param {number} index
     * @param {object} value
     */
    updateFormValues(index, value) {
      this.$set(this.formValues, this.formModel[index].key, value)
      this.debounceChange(this.formValues)
    },

    /**
     * 获取子级错误信息
     * @param {string} name
     * @param {object} err
     */
    getChildError(name, err) {
      this.$set(this.formErrors, name, err)
      this.debounceChange(this.value)
    }
  }
})

export default formUnitBase
