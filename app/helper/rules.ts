export const isEmpty = (v: any) => v === null || v === undefined || v === ''

export const isIntegerRule = (msg = 'Must be an integer') => (v: any) =>
    isEmpty(v) || Number.isInteger(Number(v)) || msg;

export const minLTEmaxRule = (form: typeof form) => (v: any) => {
    if (isEmpty(v) || isEmpty(form.maxLength)) return true
    const min = Number(v)
    const max = Number(form.maxLength)
    return (Number.isFinite(min) && Number.isFinite(max) && min <= max) || 'Min length must be ≤ Max length'
};

export const maxGTEminRule = (form: typeof form) => (v: any) => {
    if (isEmpty(v) || isEmpty(form.minLength)) return true
    const max = Number(v)
    const min = Number(form.minLength)
    return (Number.isFinite(min) && Number.isFinite(max) && max >= min) || 'Max length must be ≥ Min length'
}''