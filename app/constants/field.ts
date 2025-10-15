import {QuestionTypeEnum} from "~/enums/question";

export const FIELD_TYPE = {
    INPUT: 'input',
    PASSWORD: 'password',
    SELECT: 'select',
    MULTIPLE_SELECT: 'multiple-select',
    TEXTAREA: 'textarea',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    CALENDAR: 'calendar',
    NUMBER: 'number',
    RATING: 'rating',
    AUTOCOMPLETE: 'autocomplete',
};

export const fieldsHaveMinAndMaxLengthArr = [QuestionTypeEnum.TextField, QuestionTypeEnum.TextArea];

export const selectFieldsArr = [QuestionTypeEnum.SingleSelect, QuestionTypeEnum.MultipleSelects]

export const fieldsHaveOptionsArr = [QuestionTypeEnum.SingleSelect, QuestionTypeEnum.MultipleSelects, QuestionTypeEnum.Checkbox, QuestionTypeEnum.Radio];

export const fieldsNotHavePlaceholderArr = [QuestionTypeEnum.Checkbox, QuestionTypeEnum.Radio, QuestionTypeEnum.Rating]
