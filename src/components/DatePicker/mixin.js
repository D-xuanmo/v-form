import datejs from '@xuanmo/datejs'
export default {
  props: {
    formModel: {
      type: Object,
      default: () => ({})
    },

    type: {
      type: String,
      default: ''
    }
  },

  methods: {
    datejs,
    __confirm (v) {
      this.$emit('confirm', this._format(v))
    },

    __cancel () {
      this.$emit('cancel')
    }
  }
}
