import {QuestionTypeEnum} from "~/enums/question";

export const QuestionTypes = [
    {title: 'Text Field', value: QuestionTypeEnum.TextField},
    {title: 'Single Select', value: QuestionTypeEnum.SingleSelect},
    {title: 'Multiple Selects', value: QuestionTypeEnum.MultipleSelects},
    {title: 'Datepicker', value: QuestionTypeEnum.DatePicker},
    {title: 'Text Area', value: QuestionTypeEnum.TextArea},
    {title: 'Checkbox', value: QuestionTypeEnum.Checkbox},
    {title: 'Radio', value: QuestionTypeEnum.Radio},
    {title: 'Rating', value: QuestionTypeEnum.Rating},
]