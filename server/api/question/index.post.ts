// server/api/question/index.post.ts
import {getCookie, type H3Event, setResponseStatus} from 'h3'
import {upstream} from "~~/server/utils/upstream";

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event);
    return upstream(event, 'question', {method: 'POST', body});
})

