import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'http://localhost:8001/user/show',
    method: 'get',
    params
  })
}