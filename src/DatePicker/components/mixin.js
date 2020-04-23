import datejs from '@xuanmo/datejs'
export default {
  props: {
    value: {
      type: Number,
      default: ''
    },

    formModel: {
      type: Object,
      default: () => ({})
    },

    type: {
      type: String,
      default: ''
    },

    showToolbar: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    datejs,
    __confirm (v) {
      this.$emit('confirm', this._format(v))
    },

    __cancel () {
      this.$emit('cancel')
    },

    __change (Picker) {
      this.$emit('change', Picker.confirm())
    }
  }
}
