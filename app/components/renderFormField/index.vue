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

const search = ref(' ')
const loadingSearch = ref(false)

const emit = defineEmits<{
  (e: 'search', p: {name: string, q: string}): void
  (e: 'load-more', p: { name: string }): void
  (e: 'update:modelValue', v: any): void
  (e: 'emit-value', v: {}): void
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
      FIELD_TYPE.CALENDAR,
      FIELD_TYPE.AUTOCOMPLETE
    ].includes(props.field.type as any)
)
const listItems = ref<any[]>(props.field.options ?? [])

const hasMore = ref(true) // parent should also control this via prop if you prefer

// simple debounce without deps
let t: number | undefined
function onSearchChange(q: string) {
  search.value = q
  loadingSearch.value = true
  window.clearTimeout(t)
  t = window.setTimeout(() => {
    emit('search', { name: props.field.inputName, q })
  }, 350)
}
onBeforeUnmount(() => { if (t) window.clearTimeout(t) })


function onLoadMore() {
  if (!loadingSearch.value && hasMore.value) {
    emit('load-more', { name: props.field.inputName })
  }
}


const onMenuOpenChange = (open: boolean) => {
  console.log('onMenuOpenChange', open)
  if (open) {
    emit('emit-value', {open, search});
  }
}
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

<!--    Datepicker-->
    <div v-else-if="field.type === FIELD_TYPE.CALENDAR">
      <label :for="field.htmlFor" v-if="field.label">{{field.label}}</label>
      <VueDatePicker
          v-model="model"
          :placeholder="field.placeholder"
          :enable-time-picker="field.dateProps?.enableTimePicker ?? false"
          :format="field.dateProps?.format ?? 'yyyy-MM-dd'"
          :model-type="field.dateProps?.modelType ?? 'yyyy-MM-dd'"
          :min-date="field.dateProps?.minDate ?? new Date()"
          :max-date="field.dateProps?.maxDate"
          :clearable="field.dateProps?.clearable ?? true"
          :range="field.dateProps?.range ?? false"
          @update:model-value="update"
          teleport="body"
          :z-index="3000"
      />
    </div>

<!--    Autocomplete-->
    <v-autocomplete
        v-else-if="field.type === FIELD_TYPE.AUTOCOMPLETE"
        v-model:serch="search"
        :loading="loadingSearch"
        :clearable="field.clearable ?? true"
        :label="field.label"
        :items="field.options"
        :multiple="field.multiple ?? false"
        :chips="field.chips ?? true"
        :placeholder="field.placeholder"
        @update:menu="onMenuOpenChange"
        @update:search="onSearchChange"
        @update:modelValue="val => $emit('update:modelValue', val)"
    >
      <!-- Infinite-scroll sentinel at list bottom -->
      <template #append-item>
        <div
            v-intersect="onLoadMore"
            style="height: 1px;"
        />
        <div v-if="loadingSearch" class="px-4 py-2 text-caption">Loading…</div>
        <div v-else-if="!hasMore" class="px-4 py-2 text-caption">No more results</div>
      </template>
    </v-autocomplete>
  </div>
</template>

<style scoped>
.error { color: red; font-size: 0.85rem; }
</style>
