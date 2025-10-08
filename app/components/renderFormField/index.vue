<script setup lang="ts">
import type { IFieldProps } from '~/interfaces/form'
import { FIELD_TYPE } from '~/constants/field'

const props = defineProps<{
  field: IFieldProps
  form: Record<string, any>
  rules?: Array<(v:any)=>true|string>
  error?: string | string[]
  disabled?: boolean
  index?: number
}>()

function getByPath(obj:any, path:string){
  const p = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  return p.reduce((o,k)=> (o == null ? o : o[k]), obj)
}
function setByPath(obj:any, path:string, val:any){
  const p = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  const last = p.pop()!
  const target = p.reduce((o,k)=> (o[k] ??= {}), obj)
  target[last] = val
}

const model = computed({
  get: () => getByPath(props.form, props.field.inputName),
  set: (v) => setByPath(props.form, props.field.inputName, v),
})

const isTextLike = computed(() =>
    ![
      FIELD_TYPE.TEXTAREA,
      FIELD_TYPE.SELECT,
      FIELD_TYPE.MULTIPLE_SELECT,
      FIELD_TYPE.CHECKBOX,
      FIELD_TYPE.RADIO,
      FIELD_TYPE.NUMBER,
    ].includes(props.field.type as any)
)
const listItems = computed(() => props.field.options ?? [])
</script>

<template>
  <div class="w-100">
    <!-- Text-like -->
    <v-text-field
        v-if="isTextLike"
        v-model="model"
        :id="field.htmlFor"
        :label="index ? `${field.label} ${index}` : field.label"
        :placeholder="index ? `${field.placeholder} ${index}` : field.placeholder"
        :name="field.inputName"
        :data-test-id="field.dataTestId"
        :rules="rules"
        :error-messages="error"
        variant="underlined"
        clearable
    />

    <!-- Select / Multi-select -->
    <v-select
        v-else-if="field.type === FIELD_TYPE.SELECT || field.type === FIELD_TYPE.MULTIPLE_SELECT"
        v-model="model"
        :label="field.label"
        :id="field.htmlFor"
        :placeholder="field.placeholder"
        :items="listItems"
        item-title="title"
        item-value="value"
        :multiple="field.type === FIELD_TYPE.MULTIPLE_SELECT"
        :rules="rules"
        :error-messages="error"
        variant="underlined"
        clearable
        :data-test-id="field.dataTestId"
    />

    <!-- Number -->
    <v-number-input
        v-else-if="field.type === FIELD_TYPE.NUMBER"
        v-model="model"
        :placeholder="field.placeholder"
        :label="field.label"
        :id="field.htmlFor"
        :min="field.min"
        :max="field.max"
        :rules="rules"
        :error-messages="error"
        control-variant="default"
        variant="underlined"
        :data-test-id="field.dataTestId"
    />

    <!-- Radio -->
    <v-radio-group
        v-else-if="field.type === FIELD_TYPE.RADIO"
        v-model="model"
        inline
        :data-test-id="field.dataTestId"
    >
      <template #label><p>{{ field.label }}</p></template>
      <v-radio v-for="option in field.options" :key="option.title" :label="option.title" :value="option.value" />
      <div class="error" v-if="error">{{ error }}</div>
    </v-radio-group>

    <!-- Checkbox -->
    <v-checkbox
        v-else-if="field.type === FIELD_TYPE.CHECKBOX"
        v-model="model"
        :label="field.label"
        :rules="rules"
        :error-messages="error"
        :data-test-id="field.dataTestId"
    />
  </div>
</template>

<style scoped>
.error { color: red; font-size: 0.85rem; }
</style>
