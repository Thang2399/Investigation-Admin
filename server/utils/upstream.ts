// server/utils/upstream.ts
import {getCookie, H3Event, setResponseStatus} from 'h3'
import { FetchError } from 'ofetch'
import { joinURL, withQuery } from 'ufo'

type FetchInit = Parameters<typeof $fetch>[1]

export async function upstream(
    event: H3Event,
    path: string,                         // e.g. 'question' or 'question/123'
    init: FetchInit = {}
) {
    const { externalBaseURL, cookieName } = useRuntimeConfig(event)
    const token = getCookie(event, cookieName)

    // Build target URL safely + attach query if provided in init
    const url = withQuery(joinURL(externalBaseURL, path), init?.query as any)

    try {
        return await $fetch(url, {
            ...init,
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(init?.headers || {}),
            },
        })
    } catch (err) {
        if (err instanceof FetchError) {
            setResponseStatus(event, err.response?.status ?? 500)
            return {
                message: (err.data as any)?.message ?? err.message ?? 'Upstream error',
                detail: err.data ?? null,
            }
        }
        setResponseStatus(event, 500)
        return { message: 'Unexpected upstream error', detail: null }
    }
}
