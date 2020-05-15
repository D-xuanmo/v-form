<template>
  <div class="v-form-conatiner">
    <template v-for="(v, key, index) in model">
      <v-cell v-if="v.rules.type === 'VCell'" :key="key" :form-model="v"></v-cell>
      <template v-else>
        <row-2-col
          :key="key"
          :label="v.rules.label"
          :required="(v.rules.vRules || '').indexOf('required') !== -1"
        >
          <slot slot="extra" :name="`${key}-extra`"></slot>
          <slot :name="key" :data="v">
            <component
              :is="_splitComponentType(v.rules.type)[0]"
              :customer-type="_splitComponentType(v.rules.type)[1]"
              :value="v.value"
              :form-model="{
                ...v,
                name: key,
                index
              }"
              @input="_updateFormValues"
              @error="_getError"
              @event="$emit('event', $event)"
            ></component>
          </slot>
        </row-2-col>
      </template>
    </template>
  </div>
</template>

<script>
import 'vant/lib/index.less'
import formUnitBase from './formUnit'
export default formUnitBase.extend()
</script>

<style lang="less" scoped>
@import "../style/index";
</style>
