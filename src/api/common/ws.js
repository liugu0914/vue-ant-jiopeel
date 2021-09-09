import { request } from '@/utils/request'

const prefix = '/wss'

export const wsUrl = `${process.env.VUE_APP_BASE_API}/wss`

export const deleteTodo = ids => request(`${prefix}/todo/delTodo`, null, { ids })
