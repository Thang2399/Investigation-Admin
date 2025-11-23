<script setup lang="ts">
import {QuestionTypeEnum} from "~/enums/question";

const props = defineProps<{
  questionType: QuestionTypeEnum,
  placeholder?: string,
  optionsList: { label: string, value: string}[],
  isRowOptions?: boolean,
  minLength: number,
  maxLength: number
}>()

const listItems = computed(() =>
    (props.optionsList ?? []).map(option => ({
      title: option.label,
      value: option.value,
    }))
)

const minLength = computed(() => props.minLength || 1)
const maxLength = computed(() => props.minLength || 255)
const date = ref();
</script>

<template>
<!--  Input-->
  <v-text-field
      v-if="props.questionType === QuestionTypeEnum.TextField"
      :placeholder="props.placeholder"
      variant="underlined"
      :rules="[
        v => (v && v.length >= minLength) || `Minimum length is ${minLength} characters`,
        v => (v && v.length <= maxLength) || `Maximum length is ${maxLength} characters`
      ]"
      clearable
  />

  <!-- Select / Multi-select -->
  <v-select
      v-else-if="props.questionType === QuestionTypeEnum.SingleSelect || props.questionType === QuestionTypeEnum.MultipleSelects"
      :label="props.placeholder"
      :items="listItems"
      item-title="title"
      item-value="value"
      :multiple="props.questionType === QuestionTypeEnum.MultipleSelects"
      variant="underlined"
      clearable
  />

<!--  Textarea-->
  <v-textarea
      v-else-if="props.questionType === QuestionTypeEnum.TextArea"
      :placeholder="props.placeholder"
      variant="underlined"
      :rules="[
        v => (v && v.length >= props.minLength) || `Minimum length is ${props.minLength} characters`,
        v => (v && v.length <= props.maxLength) || `Maximum length is ${props.maxLength} characters`
      ]"
      clearable
      counter
  />

  <!-- Radio -->
  <v-radio-group
      v-else-if="props.questionType === QuestionTypeEnum.Radio"
      :inline="props.isRowOptions"
  >
    <v-radio v-for="option in listItems" :key="option.title" :label="option.title" :value="option.value" />
  </v-radio-group>

  <!-- Checkbox -->
  <div class="d-flex ga-2" :class="props.isRowOptions ? 'flex-row' : 'flex-column' " v-else-if="props.questionType === QuestionTypeEnum.Checkbox">
    <v-checkbox
        v-for="option in listItems"
        :label="option.title"
        :value="option.value"
    />
  </div>

  <!--    Datepicker-->
  <div v-else-if="props.questionType === QuestionTypeEnum.DatePicker">
    <VueDatePicker
        :placeholder="props.placeholder"
        v-model="date"
        :enable-time-picker="false"
        :formats="{ day: 'dd' }"
        model-type="'yyyy-MM-dd'"
        :clearable="true"
        :range="false"
        teleport="body"
        :z-index="3000"
    />
  </div>

  <v-rating
      v-else
      hover
      :length="5"
      :size="32"
      :model-value="3"
      active-color="primary"
  />

</template>