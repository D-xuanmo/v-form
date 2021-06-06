<template>
  <div class="v-form-conatiner">
    <template v-for="(item, index) in model">
      <v-cell v-if="item.rules.type === 'VCell'" :key="item.key" :form-model="item"></v-cell>
      <template v-else>
        <row-2-col
          :key="item.key"
          :label="item.rules.label"
          :required="(item.rules.vRules || '').indexOf('required') !== -1"
          :disabled="item.rules.disabled"
          :error="formErrors[item.key]"
        >
          <slot slot="label" :name="`${item.key}-label`"></slot>
          <slot slot="extra" :name="`${item.key}-extra`"></slot>
          <slot :name="item.key" :data="item">
            <component
              :is="splitComponentType(item.rules.type)[0]"
              :ref="item.key"
              :customer-type="splitComponentType(item.rules.type)[1]"
              :value="item.value"
              :form-model="{
                ...item,
                name: item.key,
                index
              }"
              @input="updateFormValues"
              @error="getChildError"
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
@import "../style/index.less";
</style>
