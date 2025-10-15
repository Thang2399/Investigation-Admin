<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import type { IFieldProps } from '~/interfaces/form'
import { LayoutTypes } from '~/constants/layout'
import { QuestionTypes } from '~/constants/question'
import { LayoutTypeEnum } from '~/enums/layout'
import { QuestionTypeEnum } from '~/enums/question'
import {
  fieldsHaveMinAndMaxLengthArr,
  fieldsHaveOptionsArr,
  fieldsNotHavePlaceholderArr,
  selectFieldsArr,
} from '~/constants/field'
import {useApi} from "~/composable/useApi";
import {isIntegerRule, maxGTEminRule, minLTEmaxRule} from "~/helper/rules";

const form = reactive({
  questionTitle: '',
  questionLayout: LayoutTypeEnum.TwoRows,
  questionType: QuestionTypeEnum.TextField,
  numberOfOptions: 1,
  isRowOptions: true,
  options: [] as Array<{ label: string; value: string }>, // ✅ data only
  minLength: 1,
  maxLength: 255,
  isRequired: true,
})

/* ---------- Field configs ---------- */
const titleField: IFieldProps[] = [
  {
    type: 'text',
    label: 'Question Title',
    placeholder: 'Enter Question Title',
    htmlFor: 'questionTitle',
    inputName: 'questionTitle',
    dataTestId: 'questionTitle',
    errorMessageDataTestId: 'questionTitleErrorMessage',
    rules: [
      (v: string) => (!!v && v.trim() !== '') || 'Question title is required',
      (v: string) => (!v || v.length >= 2) || 'Question title must be at least 2 characters',
    ],
  },
]

const selectTypeAndLayoutFields: IFieldProps[] = [
  {
    type: 'select',
    label: 'Question Layout',
    placeholder: 'Select Question Layout',
    htmlFor: 'questionLayout',
    inputName: 'questionLayout',
    dataTestId: 'questionLayout',
    errorMessageDataTestId: 'layoutErrorMessage',
    options: LayoutTypes, // [{title, value: LayoutTypeEnum.*}]
    rules: [(v: unknown) => (v !== null && v !== undefined && v !== '') || 'Question layout is required'],
  },
  {
    type: 'select',
    label: 'Question Type',
    placeholder: 'Select Question Type',
    htmlFor: 'questionType',
    inputName: 'questionType',
    dataTestId: 'questionType',
    errorMessageDataTestId: 'questionTypeErrorMessage',
    options: QuestionTypes,
    rules: [(v: unknown) => (v !== null && v !== undefined && v !== '') || 'Question type is required'],
  },
]

const placeholderField: IFieldProps[] = [
  {
    type: 'text',
    label: 'Question Placeholder',
    placeholder: 'Enter Question Placeholder',
    htmlFor: 'placeholder',
    inputName: 'placeholder',
    dataTestId: 'placeholder',
    errorMessageDataTestId: 'questionPlaceholderErrorMessage',
    // Only required when the type is NOT in fieldsNotHavePlaceholderArr
    rules: [
      (v: string) =>
          fieldsNotHavePlaceholderArr.includes(form.questionType) ||
          (!!v && v.trim() !== '') ||
          'Placeholder is required',
      (v: string) =>
          fieldsNotHavePlaceholderArr.includes(form.questionType) || (!v || v.length >= 2) ||
          'Placeholder must be at least 2 characters',
    ],
  },
]

const fieldOptionsArr: IFieldProps[] = [
  {
    type: 'number',
    label: 'Number of Options',
    placeholder: 'Enter Number of Options',
    inputName: 'numberOfOptions',
    htmlFor: 'numberOfOptions',
    dataTestId: 'numberOfOptions',
    errorMessageDataTestId: 'numberOfOptionsErrorMessage',
    min: 1,
    max: 5,
  },
  {
    type: 'checkbox',
    label: 'Do Options Display As A Row?',
    inputName: 'isRowOptions',
    dataTestId: 'isRowOptions',
    errorMessageDataTestId: 'isRowOptionsErrorMessage',
  },
]

const fieldsOptions: IFieldProps[] = [
  {
    type: 'text',
    label: 'Option Label',
    placeholder: 'Enter Options Label',
    inputName: 'label', // used as base; we’ll compose nested path when rendering
    htmlFor: 'label',
    dataTestId: 'label',
    errorMessageDataTestId: 'labelErrorMessage',
    rules: [(v: string) => (!!v && v.trim() !== '') || 'Label is required'],
  },
  {
    type: 'text',
    label: 'Option Value',
    placeholder: 'Enter Options Value',
    inputName: 'value',
    htmlFor: 'value',
    dataTestId: 'value',
    errorMessageDataTestId: 'valueErrorMessage',
    rules: [(v: string) => (!!v && v.trim() !== '') || 'Value is required'],
  },
]

const minAndMaxLengthFields: IFieldProps[] = [
  {
    type: 'number',
    label: 'Min Answer Length',
    placeholder: 'Enter The Minimum Character of The Answer',
    htmlFor: 'minLength',
    inputName: 'minLength',
    dataTestId: 'minLength',
    errorMessageDataTestId: 'minLengthErrorMessage',
    min: 1,
    max: 300,
    rules: [isIntegerRule(), minLTEmaxRule(form)],
  },
  {
    type: 'number',
    label: 'Max Answer Length',
    placeholder: 'Enter The Maximum Character of The Answer',
    htmlFor: 'maxLength',
    inputName: 'maxLength',
    dataTestId: 'maxLength',
    errorMessageDataTestId: 'maxLengthErrorMessage',
    min: 255,
    max: 300,
    rules: [isIntegerRule(), maxGTEminRule(form)],
  },
]

const isRequiredField: IFieldProps[] = [
  {
    type: 'checkbox',
    label: 'Is This Question Required?',
    htmlFor: 'isRequired',
    inputName: 'isRequired',
    dataTestId: 'isRequired',
  },
]

/* ---------- Form refs / actions ---------- */
const formRef = ref<any>(null)
const formValid = ref<boolean>(false)
const submitting = ref(false)

const api = useApi()

function reset() {
  formRef.value.reset();
  formRef.value?.resetValidation?.()
}

async function handleSubmit() {
  formRef.value?.validate?.()
  if(formValid.value) {
    submitting.value = true
    const formDataObject = JSON.parse(JSON.stringify(form));
    const payload = {
      ...formDataObject,
      options: fieldsHaveOptionsArr.includes(form.questionType) ? formDataObject.options: [],
      validation: {
        minLength: formDataObject.minLength,
        maxLength: formDataObject.maxLength,
        isRequired: formDataObject.isRequired,
      },
      surveyIds: [],
    };
    delete payload['minLength']
    delete payload['maxLength']
    delete payload['isRequired']

    try {
      const res = await api.post('/question', payload);
      console.log('res', res);
    } catch (err) {
      console.log('err', err)
    }
  }
}

const minOptions = 1
const maxOptions = 5

const updateOptions = (n: number) => {
  const target = Math.max(minOptions, Math.min(maxOptions, Number(n) || 0));
  const curr = form.options.length;

  if (target > curr) {
    form.options.push({ label: '', value: '' })
  } else if (target < curr) {
    form.options.splice(target)
  }
}

watch(() => form.numberOfOptions, updateOptions, { immediate: true })

/* Cross-field revalidation for min/max (Vuetify) */
watch(() => form.maxLength, async () => {
  await nextTick()
  formRef.value?.validate?.()
})
watch(() => form.minLength, async () => {
  await nextTick()
  formRef.value?.validate?.()
})
</script>

<template>
  <h1>Create New Question</h1>

  <v-card class="mx-auto mt-8" max-width="720">
    <v-card-text>
      <v-form ref="formRef" v-model="formValid" lazy-validation>
        <!-- Title -->
        <div class="mb-1">
          <RenderFormField
              v-for="field in titleField"
              :key="field.inputName"
              :field="field"
              :form="form"
              :rules="field.rules"
          />
        </div>

        <!-- Type + Layout -->
        <div class="d-flex ga-3 mb-1">
          <RenderFormField
              v-for="field in selectTypeAndLayoutFields"
              :key="field.inputName"
              :field="field"
              :form="form"
              :rules="field.rules"
          />
        </div>

        <!-- Placeholder (conditional) -->
        <div class="d-flex ga-3 mb-1" v-if="!fieldsNotHavePlaceholderArr.includes(form.questionType)">
          <RenderFormField
              v-for="field in placeholderField"
              :key="field.inputName"
              :field="field"
              :form="form"
              :rules="field.rules"
          />
        </div>

        <!-- Options controls -->
        <div class="d-flex ga-3 mb-1">
          <div
              class="w-100"
              v-if="fieldsHaveOptionsArr.includes(form.questionType)"
              v-for="field in fieldOptionsArr"
              :key="field.inputName"
          >
            <RenderFormField
                v-if="field.inputName !== 'isRowOptions' || !selectFieldsArr.includes(form.questionType)"
                :field="field"
                :form="form"
                :rules="field.rules"
            />
          </div>
        </div>

        <!-- Dynamic options — bind to nested paths -->
        <div
            v-if="fieldsHaveOptionsArr.includes(form.questionType) && form.options.length"
            v-for="(opt, i) in form.options"
            :key="`opt-${i}`"
            class="mb-1"
        >
          <div class="d-flex ga-3 align-start">
            <RenderFormField
                :field="{ ...fieldsOptions[0], inputName: `options.${i}.label` }"
                :form="form"
                :rules="fieldsOptions[0].rules"
                :index="i + 1"
            />
            <RenderFormField
                :field="{ ...fieldsOptions[1], inputName: `options.${i}.value` }"
                :form="form"
                :rules="fieldsOptions[1].rules"
                :index="i + 1"
            />
          </div>
        </div>

        <!-- Min/Max -->
        <div v-if="fieldsHaveMinAndMaxLengthArr.includes(form.questionType)" class="d-flex ga-3 items-start">
          <RenderFormField
              v-for="field in minAndMaxLengthFields"
              :key="field.inputName"
              :field="field"
              :form="form"
              :rules="field.rules"
          />
        </div>

        <!-- Required -->
        <div>
          <RenderFormField
              v-for="field in isRequiredField"
              :key="field.inputName"
              :field="field"
              :form="form"
          />
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn :loading="submitting" color="primary" @click="handleSubmit">Submit</v-btn>
      <v-btn text @click="reset">Reset</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.error { color: red; font-size: 0.9rem; }
</style>
