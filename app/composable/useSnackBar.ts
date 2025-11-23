export const useSnackbar = () => {
    const show = useState('snackbar-show', () => false)
    const text = useState('snackbar-text', () => '')
    const color = useState('snackbar-color', () => 'success')

    const openSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        text.value = message
        color.value = type
        show.value = true
    }

    return { show, text, color, openSnackbar }
}