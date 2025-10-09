// server/utils/proxy-factory.ts
import { upstream } from './upstream'
import {H3Event} from "h3";

export function makeResourceProxy(resource: string) {
    return {
        get:   (event: H3Event, sub = '', init = {}) => upstream(event, join(resource, sub), { method: 'GET',  ...init }),
        post:  (event: H3Event, sub = '', init = {}) => upstream(event, join(resource, sub), { method: 'POST', ...init }),
        patch: (event: H3Event, sub = '', init = {}) => upstream(event, join(resource, sub), { method: 'PATCH', ...init }),
        del:   (event: H3Event, sub = '', init = {}) => upstream(event, join(resource, sub), { method: 'DELETE', ...init }),
    }
}

function join(base: string, sub: string) {
    return sub ? `${base}/${sub.replace(/^\/+/, '')}` : base
}
