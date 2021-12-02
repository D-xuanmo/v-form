<template>
  <div id="app">
    <van-tabs v-model="active">
      <van-tab title="基础用法"><basic /></van-tab>
      <van-tab title="高级用法"><cors-validate /></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Tabs, Tab } from 'vant'
import Basic from './components/Basic'
import CorsValidate from './components/CorsValidate'

export default {
  name: 'App',
  components: {
    [Basic.name]: Basic,
    [CorsValidate.name]: CorsValidate,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab
  },
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less">
@import "./assets/style/index.less";
</style>
<style lang="less" scoped>
@import "./assets/style/var.less";
/deep/ .v-form-conatiner {
  .v-form-cell {
    &.has-child {
      background: #fff;
      border-bottom: 1px solid #F0F0F0;
    }
  }
  .v-form-cell__label {
    &:before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 15px;
      margin-right: 5px;
      border-radius: 2px;
      background: @blue;
      vertical-align: middle;
    }
  }
}
</style>
