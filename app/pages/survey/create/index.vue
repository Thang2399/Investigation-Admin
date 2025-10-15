<script setup lang="ts">
import type {IFieldProps} from "~/interfaces/form";
import {ref} from "vue";
import {useApi} from "~/composable/useApi";

const form = reactive({
  surveyTitle: '',
  isLimitedSurvey: false,
  questions: [],
  expiredAt: ''
})

const api = useApi()
const fieldRefs = ref<any[]>([])

const titleAndIsLimitedSurveyFields: IFieldProps[] = [
  {
    type: 'text',
    label: 'Survey Title',
    placeholder: 'Enter Survey Title',
    htmlFor: 'surveyTitle',
    inputName: 'surveyTitle',
    dataTestId: 'surveyTitle',
    errorMessageDataTestId: 'surveyTitleErrorMessage',
    rules: [
      (v: string) => (!!v && v.trim() !== '') || 'Survey title is required',
      (v: string) => (!v || v.length >= 2) || 'Survey title must be at least 2 characters',
    ],
  },
  {
    type: 'checkbox',
    label: 'Is Limited Survey?',
    htmlFor: 'isLimitedSurvey',
    inputName: 'isLimitedSurvey',
    dataTestId: 'isLimitedSurvey',
}
]

const questionField = ref<IFieldProps[]>([
  {
    type: 'autocomplete',
    label: 'Question',
    placeholder: 'Add Questions To Survey',
    inputName: 'questions',
    dataTestId: 'questions',
    chips: true,
    multiple: true,
    clearable: true,
    options: [],
  }
])

const expiredAtField: IFieldProps[] = [
  {
    type: 'calendar',
    label: 'Expired Date',
    placeholder: 'Select Expired Date',
    inputName: 'expiredAt',
    dataTestId: 'expiredAt',
  }
]

const formRef = ref<any>(null)
const formValid = ref<boolean>(false)

const updateExpiredDate = (value: boolean) => {
  form.expiredAt = '';
}

watch(() => form.isLimitedSurvey, updateExpiredDate, {immediate: true});

const handleSearch = async ({ name, search }: { name: string; search: string }) => {
  console.log('q', search)
  const query = {
    page: 1,
    pageSize: 15,
    questionTitle: search,
    orderBy: 'asc',
    orderType: 'updatedAt'
  }
  await handleGetListQuestions(query);

}

const handleGetListQuestions = async (query: any) => {
  try {
    const res: any = await api.get('/question', query)
    const {data} = res;
    if (data && data.length > 0) {
      const convertData = data.map((item: any) => ({
        title: item.questionTitle,
        value: item._id,
      }));

      // update the target field by inputName
      questionField.value = questionField.value.map((f: IFieldProps) =>
          f.inputName === 'questions' ? {...f, options: convertData} : f
      )
    }
  } catch (err) {
    console.log('error', err);
  }
}
const handleLoadMore = () => {}

const onSelectedChange = (val: any) => {
  form.questions = val;
}

const handleSubmit = async () => {
  formRef.value?.validate?.()
  if (formValid.value) {
    const formDataObject = JSON.parse(JSON.stringify(form));
    console.log(formDataObject);
    try {
      const res = await api.post('/survey', formDataObject);
      console.log('res', res);
    } catch (err) {
      console.log('err', err)
    }
  }
}

const reset = () => {
  formRef.value.reset();
  formRef.value?.resetValidation?.()
}

</script>

<template>
<h1>Create new survey</h1>

  <v-card class="mx-auto mt-8" max-width="720">
    <v-card-text>
      <v-form ref="formRef" v-model="formValid" lazy-validation>
<!--        Title and Limited Survey-->
        <div class="mb-1">
          <RenderFormField
            v-for="field in titleAndIsLimitedSurveyFields"
            :key="field.inputName"
            :field="field"
            :form="form"
            :rules="field.rules"
          />
        </div>

        <!--        Questions-->
        <div class="mb-1">
          <RenderFormField
            v-for="field in questionField"
            :key="field.inputName"
            :field="field"
            :form="form"
            @emit-value="handleSearch"
            @search="handleSearch"
            @load-more="handleLoadMore"
            @update:modelValue="onSelectedChange"
            ref="fieldRefs"
          />
        </div>

        <div class="mb-1" v-if="form.isLimitedSurvey">
          <RenderFormField
              v-for="field in expiredAtField"
              :key="field.inputName"
              :field="field"
              :form="form"
          />
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="handleSubmit">Submit</v-btn>
      <v-btn text @click="reset">Reset</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>