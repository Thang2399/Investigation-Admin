// composables/useApi.ts
export function useApi() {
    const base = useRuntimeConfig().public.apiBase
    return {
        get:  <T>(p: string, opts: any = {}) => $fetch<T>(`${base}${p}`, { method: 'GET',  ...opts }),
        post: <T>(p: string, body?: any, opts: any = {}) => $fetch<T>(`${base}${p}`, { method: 'POST', body, ...opts }),
        patch:<T>(p: string, body?: any, opts: any = {}) => $fetch<T>(`${base}${p}`, { method: 'PATCH', body, ...opts }),
        del:  <T>(p: string, opts: any = {}) => $fetch<T>(`${base}${p}`, { method: 'DELETE', ...opts }),
    }
}
