export type FieldType =
    | 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiple-select' | 'checkbox'
    | 'radio' | 'number' | 'calendar' | 'file' | 'autocomplete';

export interface IOption {
    title: string;
    value: any;
}

export interface IDate {
    enableTimePicker?: boolean;
    format?: string;
    modelType?: string;
    minDate?: Date;
    maxDate?: Date;
    clearable?: boolean;
    range?: boolean;
}

export interface IFieldProps {
    type: FieldType;
    label: string;
    placeholder?: string;
    htmlFor?: string;
    inputName: string;
    dataTestId?: string;
    errorMessageField?: string;
    errorMessageDataTestId?: string;
    options?: IOption[];
    min?: number;
    max?: number;
    onChange?: (name: string, value: any) => any;
    rules?: Array<(v: any) => true | string>;
    dateProps?: IDate;
    clearable?: boolean;
    multiple?: boolean;
    chips?: boolean;
}