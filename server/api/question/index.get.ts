// server/api/question/index.get.ts
import {upstream} from "~~/server/utils/upstream";

import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    return upstream(event, 'question', {
        method: 'GET',
        query
    })
})
