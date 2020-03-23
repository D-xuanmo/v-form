<template>
  <div id="app">
    <v-form ref="vform" :model="model" @change="change" @event="_event"></v-form>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      model: {
        text: {
          value: '',
          rules: {
            label: '文字',
            type: 'VInput',
            vRules: 'required',
            placeholder: '请输入文字',
            errMsg: '请输入文字'
          }
        },
        cell: {
          value: '',
          rules: {
            label: '文字',
            type: 'VCell',
            style: {
              background: '#fff'
            }
          }
        },
        text1: {
          value: '123123123123123123123123123123123123123123123123123123123123',
          rules: {
            label: '文字',
            type: 'VText'
          }
        },
        checkbox: {
          value: ['a'],
          rules: {
            label: '复选框',
            type: 'VCheckbox',
            vRules: 'required',
            placeholder: '请输入复选框',
            errMsg: '请输入复选框',
            direction: 'horizontal',
            options: [
              { label: '复选框 a', value: 'a' },
              { label: '复选框 b', value: 'b' },
              { label: '复选框 c', value: 'c' }
            ]
          }
        },
        radio: {
          value: 'b',
          rules: {
            label: '单选框',
            type: 'VRadio',
            vRules: 'required',
            placeholder: '请输入单选框',
            errMsg: '请输入单选框',
            direction: 'horizontal',
            options: [
              { label: '复选框 a', value: 'a' },
              { label: '复选框 b', value: 'b' },
              { label: '复选框 c', value: 'c' }
            ]
          }
        },
        number: {
          value: '',
          rules: {
            label: '数字',
            type: 'VInput|digit',
            vRules: 'required',
            placeholder: '请输入数字',
            errMsg: '请输入数字'
          }
        },
        address: {
          value: '110000,110100,110114',
          rules: {
            label: '地址选择',
            type: 'VAddress',
            vRules: 'required',
            placeholder: '请输入地址',
            errMsg: '请输入地址'
          }
        },
        textarea: {
          value: '',
          rules: {
            label: '文本域',
            type: 'VInput|textarea',
            vRules: 'required',
            placeholder: '文本域',
            errMsg: '文本域'
          }
        },
        select: {
          value: '4',
          rules: {
            label: '选择器',
            type: 'VSelect',
            placeholder: 'picker选择器',
            errMsg: 'picker选择器',
            vRules: 'required',
            options: [
              {
                values: [
                  { text: '杭州', value: 1 },
                  { text: '宁波', value: 2 },
                  { text: '温州', value: 3 },
                  { text: '嘉兴', value: 4 },
                  { text: '湖州', value: 5 }
                ]
              }
            ]
          }
        },
        selectMultiple: {
          value: '4,2',
          rules: {
            label: '多列选择器',
            type: 'VSelect',
            placeholder: 'picker选择器',
            errMsg: 'picker选择器',
            options: [
              {
                values: [
                  { text: '杭州', value: '1' },
                  { text: '宁波', value: '2' },
                  { text: '温州', value: '3' },
                  { text: '嘉兴', value: '4' },
                  { text: '湖州', value: '5' }
                ]
              },
              {
                values: [
                  { text: '杭州', value: '1' },
                  { text: '宁波', value: '2' },
                  { text: '温州', value: '3' },
                  { text: '嘉兴', value: '4' },
                  { text: '湖州', value: '5' }
                ]
              }
            ]
          }
        },
        // selectCascade: {
        //   value: '4,2',
        //   rules: {
        //     label: '多列选择器',
        //     type: 'VSelect',
        //     placeholder: 'picker选择器',
        //     errMsg: 'picker选择器',
        //     options: [{
        //       text: '浙江',
        //       value: '1',
        //       children: [{
        //         text: '杭州',
        //         value: '1-1',
        //         children: [{ text: '西湖区', value: '1-1-1' }, { text: '余杭区', value: '1-1-2' }]
        //       }, {
        //         text: '温州',
        //         value: '1-2',
        //         children: [{ text: '鹿城区', value: '1-2-1' }, { text: '瓯海区', value: '1-2-2' }]
        //       }]
        //     }, {
        //       text: '福建',
        //       value: '2',
        //       children: [{
        //         text: '福州',
        //         value: '2-1',
        //         children: [{ text: '鼓楼区', value: '2-1-1' }, { text: '台江区', value: '2-1-2' }]
        //       }, {
        //         text: '厦门',
        //         value: '2-2',
        //         children: [{ text: '思明区', value: '2-2-1' }, { text: '海沧区', value: '2-2-2' }]
        //       }]
        //     }]
        //   }
        // }
      }
    }
  },
  methods: {
    change (v) {
      console.log('change', v)
    },
    _event (v) {
      console.log(1, v)
    }
  }
}
</script>

<style>
#app {
  background: cornsilk;
  font-size: 14px;
}
</style>
