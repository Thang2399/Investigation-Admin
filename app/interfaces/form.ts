export type FieldType =
    | 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiple-select' | 'checkbox'
    | 'radio' | 'number' | 'date' | 'file';

export interface IOption {
    title: string;
    value: any;
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
    rules?: Array<(v: any) => true | string>
}